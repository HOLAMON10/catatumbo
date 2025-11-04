import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import {
  MeetingRoomReservationModelInterface,
} from '../interfaces/models';
import { ObjectId } from 'mongodb';

export interface MeetingRoomReservationDocumentInterface
  extends MeetingRoomReservationModelInterface,
    Document {
  _id: string;
  meetingRoom: any;
  reservationDate: string;
  reservationStartingHour: string;
  reservationEndingHour: string;
  stakeHolder?: any;
  description: string;
  status?: any;
  createdBy?: any;
  creationTimestamp: number;
  lastModificationBy?: any;
  lastModificationTimestamp?: number;
}

const schema = new Schema({
  meetingRoom: {
    type: ObjectId,
    ref: 'MeetingRoom',
    required: true,
  },
  reservationDate: {
    type: String,
    required: true,
  },
  reservationStartingHour: {
    type: String,
    required: true,
  },
  reservationEndingHour: {
    type: String,
    required: true,
  },
  stakeHolder: {
    type: ObjectId,
    ref: 'Agent',
    required: false,
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    ref: 'MeetingRoomReservationStatus',
    required: false
  },
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: false,
  },
  creationTimestamp: {
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
    type: Number,
    required: false,
  },
});
schema.set('autoIndex', false);

export const MeetingRoomsReservationSchema: Model<MeetingRoomReservationDocumentInterface> =
  mongoose.model<MeetingRoomReservationDocumentInterface>(
    'MeetingRoomReservation',
    schema
  );

export default MeetingRoomsReservationSchema;
