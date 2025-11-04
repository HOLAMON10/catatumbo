import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { HiringProcessEmailVariableModelInterface } from '../interfaces/models';

export interface HiringProcessEmailVariableDocumentInterface
  extends HiringProcessEmailVariableModelInterface,
    Document {
  _id: string;
  name: string;
  type: string;
  isActive: boolean;
}

const schema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});
schema.set('autoIndex', false);

export const HiringProcessEmailVariableSchema: Model<HiringProcessEmailVariableDocumentInterface> =
  mongoose.model<HiringProcessEmailVariableDocumentInterface>(
    'HiringProcessEmailVariable',
    schema
  );

export default HiringProcessEmailVariableSchema;
