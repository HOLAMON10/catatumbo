import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { EmployeeTeamModelInterface } from '../interfaces/models';

import { ObjectId } from 'mongodb';

export interface EmployeeTeamDocumentInterface
  extends EmployeeTeamModelInterface,
    Document {
  _id: string;
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

const schema = new Schema({
  refCode: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  department: {
    type: ObjectId,
    ref: 'Department',
    required: true,
  },
  // departmentCategory: {
  // 	type: String,
  // 	required: true,
  // },
  teamLeader: {
    type: ObjectId,
    ref: 'User',
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
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

export const EmployeeTeamSchema: Model<EmployeeTeamDocumentInterface> =
  mongoose.model<EmployeeTeamDocumentInterface>('EmployeeTeam', schema);

export default EmployeeTeamSchema;
