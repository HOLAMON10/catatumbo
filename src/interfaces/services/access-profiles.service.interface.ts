import { ServiceResultInterface } from '../service-result.interface';
import { AccessProfileModelInterface } from '../models/access-profile.model.interface';

export interface AccessProfilesServiceInterface {
	CreateRecord(workingObj: AccessProfileModelInterface): Promise<ServiceResultInterface>;
	ModifyRecord(workingObj: AccessProfileModelInterface): Promise<ServiceResultInterface>;
	GetAll(): Promise<ServiceResultInterface>;
	Search(
		workingObject: any,
		fieldsToRetreive: string[],
		populateAll: boolean
	): Promise<ServiceResultInterface>;
}
