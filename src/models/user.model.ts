import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { UserModelInterface } from '../interfaces/models';
import { ObjectId } from 'mongodb';

export interface UserDocumentInterface extends UserModelInterface, Document {
	_id: string;
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
	isConfirmed?: boolean;
	keepSessionAlive?: boolean;
	createdBy?: any;
	createdDate?: number;
	lastModificationUser?: any;
	lastModificationDate?: number;
}

const schema = new Schema({
	firstName: {
		type: String,
		required: false,
	},
	lastName: {
		type: String,
		required: false,
	},
	email: {
		type: String,
		required: true,
	},
	accessProfile: {
		type: ObjectId,
		ref: 'AccessProfile',
		required: false,
	},
	allowedPermissions: {
		type: [],
		required: false,
	},
	userType: {
		type: String,
		ref: 'UserType',
		required: true,
	},
	accessToken: {
		type: String,
		required: false,
	},
	password: {
		type: String,
		required: false,
	},
	verificationToken: {
		type: String,
		required: false,
	},
	isActive: {
		type: Boolean,
		required: true,
	},
	isConfirmed: {
		type: Boolean,
		required: false,
		default: false,
	},
	keepSessionAlive: {
		type: Boolean,
		required: false,
		default: false,
	},
});
schema.set('autoIndex', false);

export const UserSchema: Model<UserDocumentInterface> =
	mongoose.model<UserDocumentInterface>('User', schema);

export default UserSchema;
