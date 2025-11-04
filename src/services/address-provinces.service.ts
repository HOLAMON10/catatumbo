import { injectable } from 'inversify';

import { AddressProvinceDocumentInterface, AddressProvinceSchema } from '../models';
import { AddressProvinceModelInterface } from '../interfaces/models'
import { AddressProvincesServiceInterface } from '../interfaces/services';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { DataBaseActions, DataBaseErrorHandling, NotFoundDataHandling, RecordAlreadyCreatedHandling } from '../error-handlers';

@injectable()
export class AddressProvincesService implements AddressProvincesServiceInterface {
  public CreateRecord = this.createRecord;
  public ModifyRecord = this.modifyRecord;
  public GetAll = this.getAll;
  public GetByID = this.getByID;
  public Search = this.search;

  private dbDocument: AddressProvinceDocumentInterface;


  public constructor() { }

  private async createRecord(
    workingObj: AddressProvinceModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      const dbResult = await AddressProvinceSchema.findOne({
        _id: workingObj._id.trim(),
      });
      let result: any;
      if (dbResult) {
        throw new RecordAlreadyCreatedHandling(`address province with code ${workingObj._id} is already created.`)
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
    workingObj: AddressProvinceModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult = await AddressProvinceSchema.findById(workingObj._id);
      if (!dbResult) {
        throw new NotFoundDataHandling(`address province with code ${workingObj._id} was not found`)
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
      let dbResult: AddressProvinceDocumentInterface[] = await AddressProvinceSchema.find();
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
      let dbResult: AddressProvinceDocumentInterface = await AddressProvinceSchema.findById(id);
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
      let dbResult: AddressProvinceDocumentInterface[] = await AddressProvinceSchema.find(
        params
      ).select(fieldsToRetreive);
      return {
        code: 'success',
        detail: dbResult,
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async insert(workingObj: AddressProvinceModelInterface): Promise<any> {
    try {
      this.dbDocument = new AddressProvinceSchema({
        ...workingObj,
        creationTimestamp: Date.now()
      });
      const result = await this.dbDocument.save({ validateBeforeSave: true });
      return {
        actionPerformed: 'dataCreation',
        result: result._id,
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(ex, AddressProvinceSchema.name, DataBaseActions.insert);
    }
  }

  private async update(
    workingObject: AddressProvinceDocumentInterface,
    newObject: AddressProvinceModelInterface
  ): Promise<any> {
    try {
      workingObject.name = newObject.name;
      workingObject.score = newObject.score;
      workingObject.isActive = newObject.isActive;
      workingObject.lastModificationTimestamp = Date.now();
      workingObject.markModified(AddressProvinceSchema.modelName);
      const result = await workingObject.save();
      return {
        actionPerformed: 'dataModification',
        result: result._id,
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(ex, AddressProvinceSchema.name, DataBaseActions.update);
    }
  }
}
