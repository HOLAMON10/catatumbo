import { EmployeeAssistanceModelInterface } from '../models';
import { ServiceResultInterface } from '../service-result.interface';

export interface EmployeeAssistancesServiceInterface {
    CreateRecord(payload: EmployeeAssistanceModelInterface): Promise<ServiceResultInterface>;
    ModifyRecord(payload: EmployeeAssistanceModelInterface): Promise<ServiceResultInterface>;
    Search(filters: any, fieldsToRetreive: string[], populateAll?: boolean): Promise<ServiceResultInterface>;
}
