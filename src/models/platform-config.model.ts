import * as mongoose from "mongoose";
import { Schema, Document, Model } from "mongoose";
import { ObjectId } from "mongodb";

import { PlatformConfigModelInterface } from "../interfaces/models";

export interface PlatformConfigDocumentInterface extends PlatformConfigModelInterface, Document {
	_id: string;
	companyName: string;
	companyDescriptionForCandidates: {
		language: string;
		description: string;
	}[];
	whatsappNumber: string;
	whatsappMessage: string;
	socialSecurityPercentage: number;
	maxQuantityOfInterviewsPerHour: number;
	environment: string;
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
			emailSubject: string;
			emailDescription: string;
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

const schema = new Schema({
	companyName: {
		type: String,
		required: true,
	},
	companyDescriptionForCandidates: {
		type: [],
		required: true,
	},
	whatsappNumber: {
		type: String,
		required: true,
	},
	whatsappMessage: {
		type: String,
		required: true,
	},
	socialSecurityPercentage: {
		type: Number,
		required: false,
	},
	maxQuantityOfInterviewsPerHour: {
		type: Number,
		required: true,
	},
	environment: {
		type: String,
		required: true,
	},
	mainPlatformLogo: {
		type: String,
		required: true,
	},
	favIco: {
		type: String,
		required: false,
	},
	appTitle: {
		type: String,
		required: false,
	},
	footerPlatformLogo: {
		type: String,
		required: true,
	},
	marketingEmailSenderBotLogo: {
		type: String,
		required: false,
	},
	marketingEmailSenderBotTemplate: {
		type: String,
		required: false,
	},
	marketingEmailSenderBotFromAddress: {
		type: String,
		required: false,
	},
	marketingEmailSenderBotSubject: {
		type: String,
		required: false,
	},
	hiringProcessEmailTemplates: {
		type: [],
		required: false,
	},
	accumulatedVacationDaysNotificationThreshold: {
		type: Number,
		default: 12,
	},
	employeeTerminationActions: {
		type: [],
		required: false,
	},
	hiringProcessCcEmails: {
		type: [],
		required: false,
	},
	agentEditionTemplateUrl: {
		type: String,
		required: false,
	},
	candidateEditionTemplateUrl: {
		type: String,
		required: false,
	},
	minimumMonthsToReapply: {
		type: Number,
		required: false,
	},
	quantityOfDaysPerMonth: {
		type: Number,
		required: true,
	},
	holidays: {
		type: [
			{
				_id: false,
				month: {
					type: Number,
					require: true,
				},
				date: {
					type: Number,
					require: true,
				},
				description: {
					type: String,
					require: true,
				},
				isPaid: {
					type: Boolean,
					require: true,
				},
				isActive: {
					type: Boolean,
					require: true,
				},
			},
		],
		require: false,
	},
	// workingDays: {
	// 	type: [Number],
	// 	require: true,
	// },
	vacationRequestPolicy: {
		type: Number,
		required: false,
	},
	vacationIncrementPerMonthWorked: {
		type: Number,
		default: 1,
	},
	autoRejectVacation: {
		type: Boolean,
		required: true,
	},
	usingUDC: {
		type: Boolean,
		required: false,
	},
	publicApiKey: {
		type: String,
		required: false,
	},
	lastModificationBy: {
		type: ObjectId,
		ref: "User",
		required: false,
	},
	lastModificationTimestamp: {
		type: Number,
		required: false,
	},
});
schema.set("autoIndex", false);

export const PlatformConfigSchema: Model<PlatformConfigDocumentInterface> =
	mongoose.model<PlatformConfigDocumentInterface>("PlatformConfig", schema);

export default PlatformConfigSchema;
