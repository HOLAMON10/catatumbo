import { ServiceResultInterface } from '../service-result.interface';
import { JobPositionModelInterface } from '../models';

export interface JobPositionsServiceInterface {
  CreateRecord(payload: JobPositionModelInterface): Promise<ServiceResultInterface>;
  ModifyRecord(payload: JobPositionModelInterface): Promise<ServiceResultInterface>;
  GetAll(): Promise<ServiceResultInterface>;
  GetById(meetingRoomId: string): Promise<ServiceResultInterface>;
  Search(filters: any, fieldsToRetreive: string[]): Promise<ServiceResultInterface>;
}
