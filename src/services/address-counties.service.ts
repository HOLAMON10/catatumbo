import { injectable } from 'inversify';

import { AddressCountyDocumentInterface, AddressCountySchema } from '../models';
import { AddressCountyModelInterface } from '../interfaces/models';
import { AddressCountiesServiceInterface } from '../interfaces/services';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import {
  DataBaseActions,
  DataBaseErrorHandling,
  NotFoundDataHandling,
  RecordAlreadyCreatedHandling,
} from '../error-handlers';

@injectable()
export class AddressCountiesService implements AddressCountiesServiceInterface {
  public CreateRecord = this.createRecord;
  public ModifyRecord = this.modifyRecord;
  public GetAll = this.getAll;
  public GetByID = this.getByID;
  public Search = this.search;

  private dbDocument: AddressCountyDocumentInterface;

  public constructor() {}

  private async createRecord(
    workingObj: AddressCountyModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      const dbResult = await AddressCountySchema.findOne({
        _id: workingObj._id.trim(),
      });
      let result: any;
      if (dbResult) {
        throw new RecordAlreadyCreatedHandling(
          `address county with code ${workingObj._id} is already created.`
        );
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
    workingObj: AddressCountyModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult = await AddressCountySchema.findById(workingObj._id);
      if (!dbResult) {
        throw new NotFoundDataHandling(
          `address county with code ${workingObj._id} was not found`
        );
      }
      return {
        code: 'success',
        detail: await this.update(dbResult, workingObj),
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async getAll(): Promise<ServiceResultInterface> {
    try {
      let dbResult: AddressCountyDocumentInterface[] =
        await AddressCountySchema.find().populate(
          'province',
          ['_id', 'name'],
          'AddressProvince'
        );
      return {
        code: 'success',
        detail: dbResult,
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async getByID(id: string): Promise<ServiceResultInterface> {
    try {
      let dbResult: AddressCountyDocumentInterface =
        await AddressCountySchema.findById(id);
      return {
        code: 'success',
        detail: dbResult,
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async search(
    params: any,
    fieldsToRetreive: string[]
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult: AddressCountyDocumentInterface[] =
        await AddressCountySchema.find(params)
          .select(fieldsToRetreive)
          .populate('province', ['_id', 'name'], 'AddressProvince');
      return {
        code: 'success',
        detail: dbResult,
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async insert(workingObj: AddressCountyModelInterface): Promise<any> {
    try {
      this.dbDocument = new AddressCountySchema({
        ...workingObj,
        creationTimestamp: Date.now(),
      });
      const result = await this.dbDocument.save({ validateBeforeSave: true });
      return {
        actionPerformed: 'dataCreation',
        result: result._id,
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(
        ex,
        AddressCountySchema.name,
        DataBaseActions.insert
      );
    }
  }

  private async update(
    workingObject: AddressCountyDocumentInterface,
    newObject: AddressCountyModelInterface
  ): Promise<any> {
    try {
      workingObject.province = newObject.province;
      workingObject.name = newObject.name;
      workingObject.score = newObject.score;
      workingObject.isActive = newObject.isActive;
      workingObject.lastModificationTimestamp = Date.now();
      workingObject.markModified(AddressCountySchema.modelName);
      const result = await workingObject.save();
      return {
        actionPerformed: 'dataModification',
        result: result._id,
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(
        ex,
        AddressCountySchema.name,
        DataBaseActions.update
      );
    }
  }
}
