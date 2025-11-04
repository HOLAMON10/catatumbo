import { DepartmentModelInterface } from '../models';
import { ServiceResultInterface } from '../service-result.interface';

export interface DepartmentsServiceInterface {
	CreateRecord(workingObj: DepartmentModelInterface): Promise<ServiceResultInterface>;
	ModifyRecord(workingObj: DepartmentModelInterface): Promise<ServiceResultInterface>;
	GetAll(): Promise<ServiceResultInterface>;
	GetByID(_id: string): Promise<ServiceResultInterface>;
	Search(
		filters: any,
		fieldsToRetreive: string[],
		populateAll?: boolean
	): Promise<ServiceResultInterface>;
}
