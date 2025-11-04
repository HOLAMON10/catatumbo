import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CandidateModelInterface } from '../interfaces/models';

export interface CandidateDocumentInterface extends CandidateModelInterface, Document {
  _id: string;
  imageUrl?: string;
  idNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  cellPhoneNumber: string;
  addressProvince: string;
  addressCounty: string;
  addressDistrict: string;
  dateOfBirth: Date;
  udcPK?: string;
  createdBy?: any;
  createdDate?: number;
  lastModificationBy?: string;
  lastModificationDate?: number;
}

const schema = new Schema({
  idNumber: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  cellPhoneNumber: {
    type: String,
    required: true,
  },
  addressProvince: {
    type: String,
    required: true,
    ref: 'addressProvince'
  },
  addressCounty: {
    type: String,
    required: true,
    ref: 'AddressCounty'
  },
  addressDistrict: {
    type: String,
    required: true,
    ref: 'AddressDistrict'
  },
  dateOfBirth: {
    type: Date,
    require: true,
  },
  udcPK: {
    type: String,
    require: false,
  },
  createdBy: {
    type: ObjectId,
    required: false,
    ref: 'User'
  },
  createdDate: {
    type: Number,
    required: false,
    default: Date.now(),
  },
  lastModificationBy: {
    required: false,
    type: ObjectId,
    ref: 'User'
  },
  lastModificationDate: {
    required: false,
    type: Number,
  },
});
schema.set('autoIndex', false);

export const CandidateSchema: Model<CandidateDocumentInterface> =
  mongoose.model<CandidateDocumentInterface>('Candidate', schema);

export default CandidateSchema;
