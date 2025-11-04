export interface PlatformConfigModelInterface {
	_id?: string;
	companyName: string;
	companyDescriptionForCandidates: {
		language: string;
		description: string;
	}[];
	whatsappNumber: string;
	whatsappMessage: string;
	socialSecurityPercentage: number;
	maxQuantityOfInterviewsPerHour: number;
	environment?: string; // cannot change this value
	mainPlatformLogo: string;
	footerPlatformLogo: string;
	favIco?: string;
	appTitle?: string;
	marketingEmailSenderBotLogo?: string;
	marketingEmailSenderBotTemplate?: string;
	marketingEmailSenderBotFromAddress?: string;
	marketingEmailSenderBotSubject?: string;
	accumulatedVacationDaysNotificationThreshold: number;
	hiringProcessEmailTemplates?: {
		language: any;
		templates: {
			type: any;
			emailDescription: string;
			emailSubject: string;
			emailBody: string;
		}[];
	}[];
	employeeTerminationActions?: {
		recipientEmail: string;
		scriptList: string[];
		ccList: string[];
	}[];
	hiringProcessCcEmails?: string[];
	agentEditionTemplateUrl?: string;
	candidateEditionTemplateUrl?: string;
	minimumMonthsToReapply?: number;
	quantityOfDaysPerMonth: number;
	holidays?: {
		month: number;
		date: number;
		description: string;
		isPaid: boolean;
		isActive: boolean;
	}[];
	vacationRequestPolicy: number;
	vacationIncrementPerMonthWorked: number;
	autoRejectVacation: boolean;
	// workingDays: number[];
	usingUDC?: boolean;
	publicApiKey?: string;
	createdBy?: any;
	creationTimestamp?: number;
	lastModificationBy?: any;
	lastModificationTimestamp?: number;
}
