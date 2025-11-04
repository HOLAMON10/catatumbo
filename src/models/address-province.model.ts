import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { AddressProvinceModelInterface } from '../interfaces/models';

import { ObjectId } from 'mongodb';

export interface AddressProvinceDocumentInterface extends AddressProvinceModelInterface, Document {
  _id: string;
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

export const AddressProvinceSchema: Model<AddressProvinceDocumentInterface> = mongoose.model<AddressProvinceDocumentInterface>('AddressProvince', schema);

export default AddressProvinceSchema;
