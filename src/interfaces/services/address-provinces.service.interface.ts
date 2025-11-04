import { AddressProvinceModelInterface } from '../models';
import { ServiceResultInterface } from '../service-result.interface';

export interface AddressProvincesServiceInterface {
  CreateRecord(workingObj: AddressProvinceModelInterface): Promise<ServiceResultInterface>;
  ModifyRecord(workingObj: AddressProvinceModelInterface): Promise<ServiceResultInterface>;
  GetAll(): Promise<ServiceResultInterface>;
  GetByID(_id: string): Promise<ServiceResultInterface>;
  Search(filters: any, fieldsToRetreive: string[]): Promise<ServiceResultInterface>;
}
