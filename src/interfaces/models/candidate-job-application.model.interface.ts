import { EmailResponseInterface } from './email-response.interface';
import { HiringProcessDetail } from './hiring-process-detail.interface';

export interface CandidateJobApplicationModelInterface {
	_id?: string;
	candidate: any;
	jobPosition?: any;
	whatsappOpened?: boolean;
	hiringProcessDetails?: HiringProcessDetail[];
	endingApplicationToken?: string;
	language?: string;
	status: any;
	notCompletionNotification?: {
		email?: EmailResponseInterface;
		whatsappSendingTimestamp?: number;
	};
	applicationDate: Date;
	createdBy?: any;
}
