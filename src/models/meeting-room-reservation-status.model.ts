import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { MeetingRoomReservationStatusModelInterface } from '../interfaces/models';

export interface MeetingRoomReservationStatusDocumentInterface
	extends MeetingRoomReservationStatusModelInterface,
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
		required: false,
	},
});
schema.set('autoIndex', false);

export const MeetingReservationStatusSchema: Model<MeetingRoomReservationStatusDocumentInterface> =
	mongoose.model<MeetingRoomReservationStatusDocumentInterface>('MeetingRoomReservationStatus', schema);

export default MeetingReservationStatusSchema;
