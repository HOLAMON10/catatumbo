import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { UserPermissionModelInterface } from '../interfaces/models';

export interface UserPermissionDocumentInterface extends UserPermissionModelInterface, Document {
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

export const UserPermissionSchema: Model<UserPermissionDocumentInterface> = mongoose.model<UserPermissionDocumentInterface>('UserPermission', schema);

export default UserPermissionSchema;
