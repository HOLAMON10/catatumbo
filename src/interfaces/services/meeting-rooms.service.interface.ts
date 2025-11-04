import { ServiceResultInterface } from '../service-result.interface';
import { MeetingRoomModelInterface } from '../models';

export interface MeetingRoomsServiceInterface {
  CreateRecord(payload: MeetingRoomModelInterface): Promise<ServiceResultInterface>;
  ModifyRecord(payload: MeetingRoomModelInterface): Promise<ServiceResultInterface>;
  GetAll(): Promise<ServiceResultInterface>;
  GetById(meetingRoomId: string): Promise<ServiceResultInterface>;
  Search(filters: any, fieldsToRetreive: string[]): Promise<ServiceResultInterface>;
}
