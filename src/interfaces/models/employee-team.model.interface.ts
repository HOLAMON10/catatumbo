export interface EmployeeTeamModelInterface {
	_id?: string;
	refCode: string;
	name: string;
	department: any;
	// departmentCategory: any;
	teamLeader?: any;
	description?: string;
	isActive: boolean;
	createdBy?: any;
	createdTimestamp?: number;
	lastModificationBy?: any;
	lastModificationTimestamp?: number;
}
