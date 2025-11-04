import { injectable } from 'inversify';

import { AddressDistrictDocumentInterface, AddressDistrictSchema } from '../models';
import { AddressDistrictsServiceInterface } from '../interfaces/services';
import { AddressDistrictModelInterface } from '../interfaces/models';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { DataBaseActions, DataBaseErrorHandling, NotFoundDataHandling, RecordAlreadyCreatedHandling } from '../error-handlers';

@injectable()
export class AddressDistrictsService implements AddressDistrictsServiceInterface {
  public CreateRecord = this.createRecord;
  public ModifyRecord = this.modifyRecord;
  public GetAll = this.getAll;
  public GetByID = this.getByID;
  public Search = this.search;

  private dbDocument: AddressDistrictDocumentInterface;


  public constructor() { }

  private async createRecord(
    workingObj: AddressDistrictModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      const dbResult = await AddressDistrictSchema.findOne({
        _id: workingObj._id.trim(),
      });
      let result: any;
      if (dbResult) {
        throw new RecordAlreadyCreatedHandling(`address district with code ${workingObj._id} is already created.`)
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
    workingObj: AddressDistrictModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult = await AddressDistrictSchema.findById(workingObj._id);
      if (!dbResult) {
        throw new NotFoundDataHandling(`address district with code ${workingObj._id} was not found`)
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
      let dbResult: AddressDistrictDocumentInterface[] = await AddressDistrictSchema.find()
        .populate('county',
          ['_id', 'province', 'name', 'isActive'],
          'AddressCounty');
      ;
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
      let dbResult: AddressDistrictDocumentInterface = await AddressDistrictSchema.findById(id);
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
      let dbResult: AddressDistrictDocumentInterface[] = await AddressDistrictSchema.find(
        params
      )
        .populate('county',
          ['_id', 'name', 'province', 'isActive'],
          'AddressCounty')
        .select(fieldsToRetreive);

      return {
        code: 'success',
        detail: dbResult,
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async insert(workingObj: AddressDistrictModelInterface): Promise<any> {
    try {
      this.dbDocument = new AddressDistrictSchema({
        ...workingObj,
        creationTimestamp: Date.now()
      });
      const result = await this.dbDocument.save({ validateBeforeSave: true });
      return {
        actionPerformed: 'dataCreation',
        result: result._id,
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(ex, AddressDistrictSchema.name, DataBaseActions.insert);
    }
  }

  private async update(
    workingObject: AddressDistrictDocumentInterface,
    newObject: AddressDistrictModelInterface
  ): Promise<any> {
    try {
      workingObject.name = newObject.name;
      workingObject.county = newObject.county;
      workingObject.score = newObject.score;
      workingObject.isActive = newObject.isActive;
      workingObject.lastModificationTimestamp = Date.now();
      workingObject.markModified(AddressDistrictSchema.modelName);
      const result = await workingObject.save();
      return {
        actionPerformed: 'dataModification',
        result: result._id,
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(ex, AddressDistrictSchema.name, DataBaseActions.update);
    }
  }
}
