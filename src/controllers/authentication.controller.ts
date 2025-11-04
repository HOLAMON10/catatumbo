import Validator from 'params-verifier';
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  interfaces,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import { ApiTypes } from '../apiTypes';
import { ConstantValues } from '../constantValues';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { AuthenticationService } from '../services';
import { handleErrorResponse } from '../error-handlers';

@controller(ConstantValues.auth)
export class AuthenticationController implements interfaces.Controller {
  private dataSrv: AuthenticationService;

  public constructor(
    @inject(ApiTypes.authService)
    dataSrv: AuthenticationService
  ) {
    this.dataSrv = dataSrv;
  }

  @httpPost('/verifycredentials')
  public async VerifyCredentials(req: Request, res: Response): Promise<void> {
    try {
      const paramValidator = new Validator(req.body, 'object', {
        stringNoEmpty: true,
      });
      paramValidator
        .field('email', 'string', {
          required: true,
          validatorErrMsg: 'email is required',
          typeErrMsg: 'wrong value type on field email',
        })
        .field('password', 'string', {
          required: true,
          validatorErrMsg: 'password is required',
          typeErrMsg: 'wrong value type on field password',
        });

      let serviceResult: ServiceResultInterface =
        await this.dataSrv.VerifyCredentials(
          req.body.email,
          req.body.password,
          req.body.keepSessionAlive || false
        );
      if (!serviceResult) {
        res.status(200).send({
          code: 'requestNotProcessed',
          detail: 'Any data was saved',
        });
      } else {
        let statusCode: number = 500;
        if (serviceResult.code !== 'error') {
          statusCode = 200;
        }
        res.status(statusCode).send(serviceResult);
      }
    } catch (ex) {
      handleErrorResponse(ex, res);
    }
  }

  @httpPost('/verifysessionalive')
  public async VerifyKeepSessionAlive(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const paramValidator = new Validator(req.body, 'object', {
        stringNoEmpty: true,
      });
      paramValidator.field('userId', 'string', {
        required: true,
        validatorErrMsg: 'userId is required',
        typeErrMsg: 'wrong value type on field userId',
      });

      let serviceResult: ServiceResultInterface =
        await this.dataSrv.VerifyKeepSessionAlive(req.body.userId);
      if (!serviceResult) {
        res.status(200).send({
          code: 'requestNotProcessed',
          detail: 'Any data was saved',
        });
      } else {
        let statusCode: number = 500;
        if (serviceResult.code !== 'error') {
          statusCode = 200;
        }
        res.status(statusCode).send(serviceResult);
      }
    } catch (ex) {
      handleErrorResponse(ex, res);
    }
  }

  @httpPut('/changepassword')
  public async ModifyPassword(req: Request, res: Response): Promise<void> {
    try {
      const paramValidator = new Validator(req.body, 'object', {
        stringNoEmpty: true,
      });
      paramValidator
        .field('_id', 'string', {
          required: true,
          validatorErrMsg: '_id is required',
          typeErrMsg: 'wrong value type on field _id',
        })
        .field('currentPassword', 'string', {
          required: true,
          validatorErrMsg: 'currentPassword is required',
          typeErrMsg: 'wrong value type on field currentPassword',
        })
        .field('newPassword', 'string', {
          required: true,
          validatorErrMsg: 'newPassword is required',
          typeErrMsg: 'wrong value type on field newPassword',
        });

      let serviceResult: ServiceResultInterface =
        await this.dataSrv.ModifyPassword(
          req.body._id,
          req.body.currentPassword,
          req.body.newPassword
        );
      if (!serviceResult) {
        res.status(200).send({
          code: 'requestNotProcessed',
          detail: 'Any data was saved',
        });
      } else {
        let statusCode: number = 500;
        if (serviceResult.code !== 'error') {
          statusCode = 200;
        }
        res.status(statusCode).send(serviceResult);
      }
    } catch (ex) {
      handleErrorResponse(ex, res);
    }
  }

  @httpPut('/createrecoverypasswordtoken')
  public async CreateRecoveryPasswordToken(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const paramValidator = new Validator(req.body, 'object', {
        stringNoEmpty: true,
      });
      paramValidator.field('email', 'string', {
        required: true,
        validatorErrMsg: 'email is required',
        typeErrMsg: 'wrong value type on field email',
      });

      let serviceResult: ServiceResultInterface =
        await this.dataSrv.CreateRecoveryPasswordToken(req.body.email);
      let statusNumber = 200;
      if (serviceResult.code === 'error') {
        statusNumber = 500;
      }
      res.status(statusNumber).send(serviceResult);
    } catch (ex) {
      handleErrorResponse(ex, res);
    }
  }

  @httpGet('/verifytoken/:token')
  public async VerifyToken(req: Request, res: Response): Promise<void> {
    try {
      let serviceResult: ServiceResultInterface =
        await this.dataSrv.VerifyToken(req.params.token);
      if (serviceResult.code === 'error') {
        res.status(500).send(serviceResult);
        return;
      }
      res.send(serviceResult);
    } catch (ex) {
      handleErrorResponse(ex, res);
    }
  }

  @httpPut('/endinguserregistration')
  public async EndingUserRegistration(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const paramValidator = new Validator(req.body, 'object', {
        stringNoEmpty: true,
      });
      paramValidator
        .field('token', 'string', {
          required: true,
          validatorErrMsg: 'token is required',
          typeErrMsg: 'wrong value type on field token',
        })
        .field('email', 'string', {
          required: true,
          validatorErrMsg: 'email is required',
          typeErrMsg: 'wrong value type on field email',
        })
        .field('password', 'string', {
          required: true,
          validatorErrMsg: 'password is required',
          typeErrMsg: 'wrong value type on field password',
        });

      let serviceResult: ServiceResultInterface =
        await this.dataSrv.RegisterPassword(
          req.body.email,
          req.body.token,
          req.body.password,
          true
        );
      if (serviceResult.code === 'error') {
        res.status(500).send(serviceResult);
        return;
      }
      res.send(serviceResult);
    } catch (ex) {
      handleErrorResponse(ex, res);
    }
  }

  @httpPut('/recoveruseraccount')
  public async RecoverUserAccount(req: Request, res: Response): Promise<void> {
    try {
      const paramValidator = new Validator(req.body, 'object', {
        stringNoEmpty: true,
      });
      paramValidator
        .field('token', 'string', {
          required: true,
          validatorErrMsg: 'token is required',
          typeErrMsg: 'wrong value type on field token',
        })
        .field('email', 'string', {
          required: true,
          validatorErrMsg: 'email is required',
          typeErrMsg: 'wrong value type on field email',
        })
        .field('password', 'string', {
          required: true,
          validatorErrMsg: 'password is required',
          typeErrMsg: 'wrong value type on field password',
        });

      let serviceResult: ServiceResultInterface =
        await this.dataSrv.RegisterPassword(
          req.body.email,
          req.body.token,
          req.body.password,
          false
        );
      if (serviceResult.code === 'error') {
        res.status(500).send(serviceResult);
        return;
      }
      res.send(serviceResult);
    } catch (ex) {
      handleErrorResponse(ex, res);
    }
  }

  @httpPut('/removeusercredentials')
  public async RemoveUserCredentials(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      let serviceResult: ServiceResultInterface =
        await this.dataSrv.RemoveUserCredentials(req.body);

      if (!serviceResult) {
        res.status(200).send({
          code: 'requestNotProcessed',
          detail: 'Any data was saved',
        });
      } else {
        let statusCode: number = 500;
        if (serviceResult.code !== 'error') {
          statusCode = 200;
        }
        res.status(statusCode).send(serviceResult);
      }
    } catch (ex) {
      handleErrorResponse(ex, res);
    }
  }
}
