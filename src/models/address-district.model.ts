import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { AddressDistrictModelInterface } from '../interfaces/models';

import { ObjectId } from 'mongodb';

export interface AddressDistrictDocumentInterface extends AddressDistrictModelInterface, Document {
  _id: string;
  county: any;
  name: string;
  score: number;
  isActive: boolean;
  createdBy?: any;
  createdTimestamp?: number;
  lastModificationBy?: any;
  lastModificationTimestamp?: number;
}

const schema = new Schema({
  _id: {
    type: String,
    required: true
  },
  county: {
    type: String,
    required: true,
    ref: 'AddressCounty'
  },
  name: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    required: false
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
  }
});
schema.set('autoIndex', false);

export const AddressDistrictSchema: Model<AddressDistrictDocumentInterface> = mongoose.model<AddressDistrictDocumentInterface>('AddressDistrict', schema);

export default AddressDistrictSchema;
