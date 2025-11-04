import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { MenuOptionModelInterface } from '../interfaces/models';

export interface MenuOptionDocumentInterface extends MenuOptionModelInterface, Document {
  _id: string;
  code: string;
  name: string;
  url: string;
  isActive: boolean;
}

const schema = new Schema({
  _id: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: false
  }
});
schema.set('autoIndex', false);

export const MenuOptionSchema: Model<MenuOptionDocumentInterface> = mongoose.model<MenuOptionDocumentInterface>('MenuOption', schema);

export default MenuOptionSchema;