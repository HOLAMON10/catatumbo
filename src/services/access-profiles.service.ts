import { injectable } from 'inversify';

import { AccessProfileDocumentInterface, AccessProfileSchema } from '../models';
import { AccessProfileModelInterface } from '../interfaces/models';
import { AccessProfilesServiceInterface } from '../interfaces/services';
import { DataBaseActions, DataBaseErrorHandling, NotFoundDataHandling, RecordAlreadyCreatedHandling } from "../error-handlers";
import { ServiceResultInterface } from '../interfaces/service-result.interface';

@injectable()
export class AccessProfilesService implements AccessProfilesServiceInterface {
  //#region Public Properties

  public CreateRecord = this.createRecord;
  public ModifyRecord = this.modifyRecord;
  public GetAll = this.getAll;
  public Search = this.search;

  //#endregion

  private dbDocument: AccessProfileDocumentInterface;

  public constructor() { }

  //#region Private Functions

  private async createRecord(
    workingObj: AccessProfileModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      const dbResult = await AccessProfileSchema.findOne({
        referenceCode: workingObj.referenceCode.trim(),
      });
      let result: any;
      if (dbResult) {
        throw new RecordAlreadyCreatedHandling(`access profile with reference code ${workingObj.referenceCode} is already created.`)
      } else {
        result = await this.insert(workingObj);
      }
      return {
        code: 'success',
        detail: result,
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async modifyRecord(
    workingObj: AccessProfileModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult = await AccessProfileSchema.findById(workingObj._id);
      if (!dbResult) {
        throw new NotFoundDataHandling(`access profile with _id ${workingObj._id} was not found`)
      }
      return {
        code: 'success',
        detail: await this.update(dbResult, workingObj)
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async getAll(): Promise<ServiceResultInterface> {
    try {
      let dbResult = await AccessProfileSchema.find()
        .populate(
          'createdBy',
          ['email', 'firstName', 'lastName', 'isActive'],
          'User'
        )
        .populate(
          'lastModificationUser',
          ['email', 'firstName', 'lastName', 'isActive'],
          'User'
        );
      return {
        code: 'success',
        detail: dbResult.length ?
          dbResult.map(result => (this.formatReturningData(result))) :
          [],

      };
    } catch (ex) {
      throw ex;
    }
  }

  private async search(
    params: any,
    fieldsToRetreive: string[],
    populateAll: boolean
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult: AccessProfileDocumentInterface[] = [];
      if (populateAll) {
        dbResult = await AccessProfileSchema.find(params)
          .select(fieldsToRetreive)
          .populate('menuOptions',
            ['name', 'url'], 'MenuOption',
            { isActive: true })
          .populate('createdBy',
            ['email', 'firstName', 'lastName', 'isActive']
          )
          .populate('lastModificationUser',
            [
              'email',
              'firstName',
              'lastName',
              'isActive',
            ]);
      } else {
        dbResult = await AccessProfileSchema.find(params).select(fieldsToRetreive);
      }
      if (!dbResult) {
        return {
          code: 'notDataFound',
          detail: 'Data not found',
        };
      }
      return {
        code: 'success',
        detail: dbResult.length ?
          dbResult.map(result => (this.formatReturningData(result))) :
          []
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async insert(workingObj: AccessProfileModelInterface): Promise<any> {
    try {
      this.dbDocument = new AccessProfileSchema({
        ...workingObj,
      });
      const result = await this.dbDocument.save({ validateBeforeSave: true });
      return {
        actionPerformed: 'dataCreation',
        result: result._id,
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(ex, AccessProfileSchema.name, DataBaseActions.insert);
    }
  }

  private async update(
    workingObject: AccessProfileDocumentInterface,
    newObject: AccessProfileModelInterface
  ): Promise<any> {
    try {
      workingObject.referenceCode = newObject.referenceCode;
      workingObject.name = newObject.name;
      workingObject.description = newObject.description;
      workingObject.menuOptions = newObject.menuOptions;
      workingObject.isActive = newObject.isActive;
      workingObject.lastModificationUser = newObject.lastModificationUser;
      workingObject.lastModificationDate = new Date();
      workingObject.markModified(AccessProfileSchema.modelName);
      const result = await workingObject.save();
      return {
        actionPerformed: 'dataModification',
        result: result._id,
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(ex, AccessProfileSchema.name, DataBaseActions.update);
    }
  }

  private formatReturningData(data: AccessProfileDocumentInterface): AccessProfileModelInterface {
    return {
      _id: data._id,
      referenceCode: data.referenceCode,
      name: data.name,
      description: data.description,
      menuOptions: data.menuOptions,
      isActive: data.isActive,
      createdBy: data.createdBy,
      createdDate: data.createdDate,
      lastModificationUser: data.lastModificationUser,
      lastModificationDate: data.lastModificationDate
    } as AccessProfileModelInterface
  }
}
