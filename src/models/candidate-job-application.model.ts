import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import {
	CandidateJobApplicationModelInterface,
	EmailResponseInterface,
	HiringProcessDetail,

} from '../interfaces/models';
import { ObjectId } from 'mongodb';

export interface CandidateJobApplicationDocumentInterface
	extends CandidateJobApplicationModelInterface,
		Document {
	_id: string;
	candidate: any;
	jobPosition?: any;
	whatsappOpened?: boolean;
	hiringProcessDetails?: HiringProcessDetail[];
	endingApplicationToken?: string;
	language?: string;
	notCompletionNotification?: {
		email?: EmailResponseInterface;
		whatsappSendingTimestamp?: number;
	};
	status: any;
	applicationDate: Date;
	createdBy?: any;
}

const schema = new Schema({
	candidate: {
		type: ObjectId,
		ref: 'Candidate',
		required: true,
	},
	jobPosition: {
		type: ObjectId,
		ref: 'jobPosition',
		required: false,
	},
	chatbotAnswers: {
		type: [],
		required: false,
	},
	whatsappOpened: {
		type: Boolean,
		default: false,
		required: false,
	},
	recruiterComments: {
		type: [],
		required: true,
	},
	hiringProcessDetails: {
		type: [],
		required: true,
	},
	endingApplicationToken: {
		type: String,
		required: false,
	},
	language: {
		type: String,
		required: false,
		ref: 'AllowedPlatformLanguage',
	},
	notCompletionNotification: {
		type: {},
		required: false,
	},
	status: {
		type: String,
		required: true,
	},
	applicationDate: {
		type: Date,
		require: true,
	},
	createdBy: {
		type: ObjectId,
		ref: 'User',
		required: false,
	},
});
schema.set('autoIndex', false);

export const CandidateJobApplicationSchema: Model<CandidateJobApplicationDocumentInterface> =
	mongoose.model<CandidateJobApplicationDocumentInterface>('CandidateJobApplication', schema);

export default CandidateJobApplicationSchema;
