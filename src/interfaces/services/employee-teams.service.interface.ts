import { EmployeeTeamModelInterface } from '../models';
import { ServiceResultInterface } from '../service-result.interface';

export interface EmployeeTeamsServiceInterface {
	CreateRecord(workingObj: EmployeeTeamModelInterface): Promise<ServiceResultInterface>;
	ModifyRecord(workingObj: EmployeeTeamModelInterface): Promise<ServiceResultInterface>;
	GetAll(): Promise<ServiceResultInterface>;
	GetByID(_id: string): Promise<ServiceResultInterface>;
	Search(
		filters: any,
		fieldsToRetreive: string[],
		populateAll?: boolean
	): Promise<ServiceResultInterface>;
}
