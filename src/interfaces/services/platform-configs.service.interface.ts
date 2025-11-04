import { PlatformConfigModelInterface } from '../models';
import { ServiceResultInterface } from '../service-result.interface';

export interface PlatformConfigsServiceInterface {
	ModifyRecord(workingObj: PlatformConfigModelInterface): Promise<ServiceResultInterface>;
  GetAll(): Promise<ServiceResultInterface>;
  GetByID(_id: string): Promise<ServiceResultInterface>;
  Search(filters: any, fieldsToRetreive: string[]): Promise<ServiceResultInterface>;
}
