import * as mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { Schema, Document, Model } from 'mongoose';
import {
  AgentChangingStatusDetailInterface,
  AgentModelInterface,
  EmailResponseInterface,
} from '../interfaces/models';

export interface AgentDocumentInterface extends AgentModelInterface, Document {
  _id?: string;
  team?: any;
  candidateId?: any;
  imageUrl?: string;
  idNumber: string;
  email?: string;
  personalEmail: string;
  firstName: string;
  lastName: string;
  secondLastName?: string;
  alias?: string;
  extensionNumber: number;
  cellPhoneNumber?: string;
  dateOfBirth?: Date;
  dashboardUrl?: string;
  monthlySalary?: number;
  applySocialSecurityPercentage?: boolean;
  addressProvice?: string;
  addressCounty?: string;
  addressDistrict?: string;
  userName?: string;
  department?: any;
  // departmentCategory?: any;
  employeeType?: any;
  startingDate: string;
  udcPK?: string;
  careerDetail?: {
    generalComments?: {
      id: string;
      managementCommenter?: any;
      agentCommenter?: any;
      comments: string;
      commentedAt: number;
    }[];
  };
  status?: any;
  changingStatusDetail?: AgentChangingStatusDetailInterface[];
  isConfirmed?: boolean;
  verificationToken?: string;
  emailSendingDetail?: EmailResponseInterface;
  password?: string;
  createdTimestamp: number;
  createdBy?: any;
  lastModificationBy?: any;
  lastModificationTimestamp?: number;
}

const schema = new Schema({
  team: {
    type: ObjectId,
    ref: 'AgentTeam',
    required: false,
  },
  candidateId: {
    type: ObjectId,
    ref: 'Candidate',
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  idNumber: {
    type: String,
    required: true,
  },
  personalEmail: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  secondLastName: {
    type: String,
    required: false,
  },
  alias: {
    type: String,
    required: false,
  },
  extensionNumber: {
    type: Number,
    required: false,
  },
  cellPhoneNumber: {
    type: String,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    require: false,
  },
  dashboardUrl: {
    type: String,
    require: false,
  },
  monthlySalary: {
    type: Number,
    require: false,
  },
  applySocialSecurityPercentage: {
    type: Boolean,
    require: false,
  },
  addressProvince: {
    type: String,
    required: false,
    ref: 'AddressProvince',
  },
  addressCounty: {
    type: String,
    required: false,
    ref: 'AddressCounty',
  },
  addressDistrict: {
    type: String,
    required: false,
    ref: 'AddressDistrict',
  },
  userName: {
    type: String,
    required: false,
  },
  department: {
    type: ObjectId,
    ref: 'Department',
    required: false,
  },
  // departmentCategory: {
  //   type: String,
  //   required: false
  // },
  employeeType: {
    type: String,
    ref: 'EmployeeType',
    required: false,
  },
  startingDate: {
    type: String,
    required: false,
  },
  verificationToken: {
    type: String,
    require: false,
  },
  emailSendingDetail: {
    type: {},
    require: false,
  },
  isConfirmed: {
    type: Boolean,
    require: false,
  },
  udcPK: {
    type: String,
    require: false,
  },
  careerDetail: {
    type: {},
    require: false,
  },
  password: {
    type: String,
    require: false,
  },
  status: {
    type: String,
    ref: 'AgentStatus',
    required: true,
  },
  changingStatusDetail: {
    type: [],
    require: false,
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

export const AgentSchema: Model<AgentDocumentInterface> =
  mongoose.model<AgentDocumentInterface>('Agent', schema);

export default AgentSchema;
