export interface UserModelInterface {
	_id?: string;
	firstName?: string;
	lastName?: string;
	email: string;
	accessProfile?: any;
	allowedPermissions?: string[];
	dashboardId?: string;
	dashboardType?: string;
	dashboardUrl?: string;
	dashboardsList?: {
		dashboardId: string;
		dashboardName: string;
		dashboardUrl?: string;
	}[];
	accessToken?: string;
	userType: any;
	password?: string;
	verificationToken?: string;
	isActive: boolean;
	keepSessionAlive?: boolean;
	isConfirmed?: boolean;
	createdBy?: any;
	createdDate?: number;
	lastModificationUser?: any;
	lastModificationDate?: number;
}
