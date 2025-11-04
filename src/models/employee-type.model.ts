import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { EmployeeTypeModelInterface } from '../interfaces/models';

export interface EmployeeTypeDocumentInterface extends EmployeeTypeModelInterface, Document {
  _id: string;
  name: string;
  isActive: boolean;
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
  isActive: {
    type: Boolean,
    required: false
  }
});
schema.set('autoIndex', false);

export const EmployeeTypeSchema: Model<EmployeeTypeDocumentInterface> = mongoose.model<EmployeeTypeDocumentInterface>('EmployeeType', schema);

export default EmployeeTypeSchema;
