import { AddressCountyModelInterface } from '../models';
import { ServiceResultInterface } from '../service-result.interface';

export interface AddressCountiesServiceInterface {
  CreateRecord(workingObj: AddressCountyModelInterface): Promise<ServiceResultInterface>;
  ModifyRecord(workingObj: AddressCountyModelInterface): Promise<ServiceResultInterface>;
  GetAll(): Promise<ServiceResultInterface>;
  GetByID(_id: string): Promise<ServiceResultInterface>;
  Search(filters: any, fieldsToRetreive: string[]): Promise<ServiceResultInterface>;
}
