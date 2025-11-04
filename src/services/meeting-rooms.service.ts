import { injectable } from 'inversify';

import { MeetingRoomDocumentInterface, MeetingRoomSchema } from '../models';
import { MeetingRoomModelInterface } from '../interfaces/models';
import { MeetingRoomsServiceInterface } from '../interfaces/services';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import {
  DataBaseActions,
  DataBaseErrorHandling,
  NotFoundDataHandling,
  RecordAlreadyCreatedHandling,
} from '../error-handlers';

@injectable()
export class MeetingRoomsService implements MeetingRoomsServiceInterface {
  public CreateRecord = this.createRecord;
  public ModifyRecord = this.modifyRecord;
  public GetAll = this.getAll;
  public GetById = this.getById;
  public Search = this.search;

  private dbDocument: MeetingRoomDocumentInterface;

  public constructor() {}

  private async createRecord(
    payload: MeetingRoomModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      const dbResult = await MeetingRoomSchema.findOne({
        name: payload.name.trim(),
      });

      let result: any;
      if (dbResult) {
        throw new RecordAlreadyCreatedHandling(
          `The meeting room with the name ${payload.name} is already created`
        );
      }

      result = await this.insert(payload);

      return {
        code: 'success',
        detail: result,
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async modifyRecord(
    payload: MeetingRoomModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult = await MeetingRoomSchema.findById(payload._id);

      if (!dbResult) {
        throw new NotFoundDataHandling(
          `Meeting room with the _id ${payload._id} was not found`
        );
      }

      return {
        code: 'success',
        detail: await this.update(dbResult, payload),
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async getAll(): Promise<ServiceResultInterface> {
    try {
      let dbResult: MeetingRoomDocumentInterface[] =
        await MeetingRoomSchema.find();

      return {
        code: 'success',
        detail: dbResult,
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async getById(
    meetingRoomId: string
  ): Promise<ServiceResultInterface> {
    try {
      const dbResult = await MeetingRoomSchema.findById(meetingRoomId);

      console.log('dbResult :>> ', dbResult);
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
        let dbResult: MeetingRoomDocumentInterface[] = await MeetingRoomSchema.find(
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

  private async insert(payload: MeetingRoomModelInterface): Promise<any> {
    try {
      this.dbDocument = new MeetingRoomSchema({
        ...payload,
        createdDate: Date.now(),
      });

      const result = await this.dbDocument.save({
        validateBeforeSave: true,
      });

      return {
        actionPerformed: 'dataCreation',
        result: result._id,
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(
        'Error creating the new meeting room',
        MeetingRoomSchema.name,
        DataBaseActions.insert
      );
    }
  }

  private async update(
    payload: MeetingRoomDocumentInterface,
    newObj: MeetingRoomModelInterface
  ): Promise<any> {
    try {
      payload.name = newObj.name || payload.name;
      payload.location = newObj.location || payload.location;
      payload.chairs = newObj.chairs || payload.chairs;
      payload.schedule = newObj.schedule || payload.schedule;
      payload.isActive = newObj.isActive;
      payload.lastModificationUser = newObj.lastModificationUser || payload.lastModificationUser;
      payload.lastModificationDate = Date.now();
      payload.markModified(MeetingRoomSchema.modelName);

      const result = await payload.save();

      return {
        actionPerformed: 'dataModification',
        result: result._id,
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(
        'Error modifying meeting room data',
        MeetingRoomSchema.name,
        DataBaseActions.update
      );
    }
  }
}
