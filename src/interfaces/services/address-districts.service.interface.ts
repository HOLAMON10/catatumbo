import { AddressDistrictModelInterface } from '../models';
import { ServiceResultInterface } from '../service-result.interface';

export interface AddressDistrictsServiceInterface {
  CreateRecord(workingObj: AddressDistrictModelInterface): Promise<ServiceResultInterface>;
  ModifyRecord(workingObj: AddressDistrictModelInterface): Promise<ServiceResultInterface>;
  GetAll(): Promise<ServiceResultInterface>;
  GetByID(_id: string): Promise<ServiceResultInterface>;
  Search(filters: any, fieldsToRetreive: string[]): Promise<ServiceResultInterface>;
}
