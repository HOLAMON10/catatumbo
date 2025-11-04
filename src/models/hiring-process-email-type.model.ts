import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { HiringProcessEmailTypeModelInterface } from '../interfaces/models';

export interface HiringProcessEmailTypeDocumentInterface
  extends HiringProcessEmailTypeModelInterface,
    Document {
  _id: string;
  name: string;
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
  isActive: {
    type: Boolean,
    required: true,
  },
});
schema.set('autoIndex', false);

export const HiringProcessEmailTypeSchema: Model<HiringProcessEmailTypeDocumentInterface> =
  mongoose.model<HiringProcessEmailTypeDocumentInterface>(
    'HiringProcessEmailType',
    schema
  );

export default HiringProcessEmailTypeSchema;
