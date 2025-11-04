import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { DepartmentCategoryInterface, DepartmentModelInterface } from '../interfaces/models';

import { ObjectId } from 'mongodb';

export interface DepartmentDocumentInterface extends DepartmentModelInterface, Document {
	_id: string;
	refCode: string;
	name: string;
	description?: string;
	manager?: any;
	// categories?: DepartmentCategoryInterface[];
	isActive: boolean;
	createdBy?: any;
	createdTimestamp?: number;
	lastModificationBy?: any;
	lastModificationTimestamp?: number;
}

const schema = new Schema({
	refCode: {
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
	manager: {
		type: ObjectId,
		ref: 'User',
		required: false,
	},
	// categories: {
	// 	type: [],
	// 	require: false
	// },
	isActive: {
		type: Boolean,
		required: false,
	},
	createdBy: {
		type: ObjectId,
		ref: 'User',
		required: false,
	},
	createdTimestamp: {
		type: Number,
		required: true,
		default: Date.now(),
	},
	lastModificationBy: {
		type: ObjectId,
		ref: 'User',
		required: false,
	},
	lastModificationTimestamp: {
		required: false,
		type: Number,
	},
});
schema.set('autoIndex', false);

export const DepartmentSchema: Model<DepartmentDocumentInterface> = mongoose.model<DepartmentDocumentInterface>('Department', schema);

export default DepartmentSchema;
