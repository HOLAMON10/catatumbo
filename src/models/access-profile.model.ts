import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { AccessProfileModelInterface } from '../interfaces/models';
import { ObjectId } from 'mongodb';

export interface AccessProfileDocumentInterface
	extends AccessProfileModelInterface,
		Document {
	_id: string;
	referenceCode: string;
	name: string;
	description?: string;
	menuOptions: string[];
	isActive: boolean;
	createdBy?: any;
	createdDate?: Date;
	lastModificationDate?: Date;
	lastModificationUser?: any;
}

const schema = new Schema({
	referenceCode: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
	},
	menuOptions: {
		type: [],
		required: true,
	},
	isActive: {
		type: Boolean,
		required: false,
		default: true,
	},
	createdBy: {
		type: ObjectId,
		ref: 'User',
		required: false,
	},
	createdDate: {
		type: Date,
		required: true,
		default: new Date(),
	},
	lastModificationUser: {
		type: ObjectId,
		ref: 'User',
		required: false,
	},
	lastModificationDate: {
		required: false,
		type: Date,
	},
});
schema.set('autoIndex', false);

export const AccessProfileSchema: Model<AccessProfileDocumentInterface> =
	mongoose.model<AccessProfileDocumentInterface>('AccessProfile', schema);

export default AccessProfileSchema;
