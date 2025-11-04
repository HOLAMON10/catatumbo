import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { MeetingRoomModelInterface } from '../interfaces/models';
import { ObjectId } from 'mongodb';

export interface MeetingRoomDocumentInterface
  extends MeetingRoomModelInterface,
    Document {
  _id?: string;
  name: string;
  location: string;
  chairs: number;
  schedule: {
    day: number,
    startingHour: string;
    endingHour: string;
  }[];
  isActive: boolean;
  createdBy?: any;
  createdDate?: number;
  lastModificationUser?: any;
  lastModificationDate?: number;
}

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  chairs: {
    type: Number,
    required: true,
  },
  schedule: {
    type: [{
      _id: false,
      day: Number,
      startingHour: String,
      endingHour: String
    }],
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  createdBy: {
    type: ObjectId,
    ref: 'User',
  },
  createdDate: {
    type: Number,
    required: true,
    default: Date.now(),
  },
  lastModificationUser: {
    type: ObjectId,
    ref: 'User',
    required: false,
  },
  lastModificationDate: {
    type: Number,
    required: false,
  }
});
schema.set('autoIndex', false);

export const MeetingRoomSchema: Model<MeetingRoomDocumentInterface> =
  mongoose.model<MeetingRoomDocumentInterface>('MeetingRoom', schema);

export default MeetingRoomSchema;
