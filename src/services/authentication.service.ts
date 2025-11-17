import { injectable } from 'inversify';

import { UserDocumentInterface, UserSchema } from '../models';
import { UserModelInterface } from '../interfaces/models';
import { AuthenticationServiceInterface } from '../interfaces/services';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { CommonFunctions } from '../common';
import {
  CredentialsErrorHandling,
  DataBaseActions,
  DataBaseErrorHandling,
  NotActionPerformedHandling,
  NotFoundDataHandling,
  ValidationError,
} from '../error-handlers';

@injectable()
export class AuthenticationService implements AuthenticationServiceInterface {
  //#region Public Properties

  public CreateRecoveryPasswordToken = this.createRecoveryPasswordToken;
  public ModifyPassword = this.modifyPassword;
  public RegisterPassword = this.registerPassword;
  public RemoveUserCredentials = this.removeUserCredentials;
  public VerifyCredentials = this.verifyCredentials;
  public VerifyKeepSessionAlive = this.verifyKeepSessionAlive;
  public VerifyToken = this.verifyToken;

  //#endregion

  public constructor() {}

  //#region Private Functions

  private async createRecoveryPasswordToken(
    email: string
  ): Promise<ServiceResultInterface> {
    try {
      const dbResult: UserDocumentInterface = await UserSchema.findOne({
        email: email.trim(),
      });
      if (!dbResult) {
        throw new CredentialsErrorHandling('user data not found');
      }

      if (!dbResult.isActive && !dbResult.isConfirmed) {
        throw new ValidationError(
          'The request action cannot be performed'
        );
      }

      dbResult.verificationToken = CommonFunctions.generateUUID(false);
      dbResult.keepSessionAlive = false;
      dbResult.markModified('UserInfo');
      let updateResult = await dbResult.save();
      if (updateResult._id) {
        return {
          code: 'success',
          detail: dbResult.verificationToken,
        };
      } else {
        throw new NotActionPerformedHandling('token was not generated');
      }
    } catch (ex) {
      throw ex;
    }
  }

  private async modifyPassword(
    _id: string,
    currentPassword: string = null,
    newPassword: string
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult: UserDocumentInterface = await UserSchema.findById(_id);
      if (!dbResult) {
        throw new CredentialsErrorHandling('user data not found');
      }
      if (currentPassword) {
        if (
          dbResult.password &&
          dbResult.password !== require('md5')(currentPassword)
        ) {
          throw new CredentialsErrorHandling('user data not found');
        }
      }
      dbResult.password = require('md5')(newPassword);
      dbResult.verificationToken = null;
      dbResult.markModified('User');

      let updateResult = await dbResult.save();
      if (updateResult._id) {
        return Promise.resolve({
          code: 'success',
          detail: 'password modified',
        });
      } else {
        throw new NotActionPerformedHandling('password not modified');
      }
    } catch (ex) {
      throw ex;
    }
  }

  private async registerPassword(
    email: string,
    verificationToken: string,
    password: string,
    endingRegistration: boolean
  ): Promise<ServiceResultInterface> {
    try {
      //getting user information
      const userInformation = await UserSchema.findOne({
        email,
        verificationToken,
      });

      if (!userInformation) {
        throw new NotFoundDataHandling(
          'The email and the token were not found'
        );
      }
      if (endingRegistration && userInformation.isConfirmed) {
        throw new CredentialsErrorHandling('The user is already registered.');
      }
      userInformation.password = require('md5')(password);
      userInformation.verificationToken = null;
      userInformation.isConfirmed = true;
      userInformation.markModified('UserInfo');
      await userInformation.save();

      return {
        code: 'success',
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async removeUserCredentials(
    workingObject: UserModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult: UserDocumentInterface = await UserSchema.findById(
        workingObject._id
      );

      if (!dbResult) {
        throw new NotFoundDataHandling(
          `User not found for _id ${workingObject._id}`
        );
      }

      return {
        code: 'success',
        detail: await this.updateCredentials(dbResult),
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async updateCredentials(
    workingObject: UserDocumentInterface
  ): Promise<any> {
    try {
      workingObject.isActive = false;
      workingObject.isConfirmed = false;
      workingObject.password = null;
      workingObject.verificationToken = null;

      const result = await workingObject.save();
      return {
        actionPerformed: 'dataModification',
        result: result._id,
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(
        'Error modifying user credentials',
        UserSchema.name,
        DataBaseActions.update
      );
    }
  }

  private async verifyCredentials(
    email: string,
    password: string,
  ): Promise<ServiceResultInterface> {
    try {
      const dbResult = await UserSchema.findOne({
        email: email,
      });
      if (!dbResult) {
        throw new CredentialsErrorHandling('user data not found');
      }
      if (dbResult.password !== require('md5')(password)) {
        throw new CredentialsErrorHandling('user credentials not valid');
      }
      if (!dbResult.isActive) {
        throw new CredentialsErrorHandling('user is not active');
      }
      dbResult.markModified('User');
      const authToken = await CommonFunctions.generateToken(
				{ user: dbResult._id,
          token: global.gearInfo.token 
         },
				global.gearInfo.secret,
				 24 * 60 * 60 * 1000
			);
      await dbResult.save();

      return {
        code: 'success',
        detail: authToken
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async verifyKeepSessionAlive(
    userId: string
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult: UserDocumentInterface = await UserSchema.findById(
        userId
      ).select(['isActive', 'isConfirmed', 'keepSessionAlive']);
      if (!dbResult) {
        throw new NotFoundDataHandling(`user with id ${userId} was not found`);
      }
      // validating user
      if (!dbResult.isActive) {
        throw new ValidationError(`user with id ${userId} is not active`);
      }
      if (!dbResult.isConfirmed) {
        throw new ValidationError(`user with id ${userId} is not confirmed`);
      }
      return {
        code: 'success',
        detail: dbResult.keepSessionAlive,
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async verifyToken(
    verificationToken: string
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult: UserDocumentInterface = await UserSchema.findOne({
        verificationToken,
      }).select(['isConfirmed']);
      if (!dbResult) {
        return {
          code: 'tokenNotValid',
          detail: 'the token is not valid',
        };
      }
      return {
        code: 'success',
        detail: {
          isConfirmed: dbResult.isConfirmed,
        },
      };
    } catch (ex) {
      throw ex;
    }
  }
  //#endregion
}
