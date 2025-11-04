import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { UserTypeModelInterface } from '../interfaces/models';

export interface UserTypeDocumentInterface extends UserTypeModelInterface, Document {
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

export const UserTypeSchema: Model<UserTypeDocumentInterface> = mongoose.model<UserTypeDocumentInterface>('UserType', schema);

export default UserTypeSchema;
