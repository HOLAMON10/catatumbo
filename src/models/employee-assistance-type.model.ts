import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { EmployeeAssistanceTypeModelInterface } from '../interfaces/models';

export interface EmployeeAssistanceTypeDocumentInterface extends EmployeeAssistanceTypeModelInterface, Document {
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

export const EmployeeAssistanceTypeSchema: Model<EmployeeAssistanceTypeDocumentInterface> = mongoose.model<EmployeeAssistanceTypeDocumentInterface>('EmployeeAssistanceType', schema);

export default EmployeeAssistanceTypeSchema;
