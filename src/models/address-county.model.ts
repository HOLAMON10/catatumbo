import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { AddressCountyModelInterface } from '../interfaces/models';

import { ObjectId } from 'mongodb';

export interface AddressCountyDocumentInterface extends AddressCountyModelInterface, Document {
  _id: string;
  province: any;
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
  province: {
    type: String,
    ref: 'AddressProvince',
    required: true
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
  },
});
schema.set('autoIndex', false);

export const AddressCountySchema: Model<AddressCountyDocumentInterface> = mongoose.model<AddressCountyDocumentInterface>('AddressCounty', schema);

export default AddressCountySchema;
