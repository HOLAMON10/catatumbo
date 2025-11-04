import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { JobApplicationStatusModelInterface } from '../interfaces/models';

export interface JobApplicationStatusDocumentInterface extends JobApplicationStatusModelInterface, Document {
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

export const JobApplicationStatusSchema: Model<JobApplicationStatusDocumentInterface> = mongoose.model<JobApplicationStatusDocumentInterface>('JobApplicationStatus', schema);

export default JobApplicationStatusSchema;
