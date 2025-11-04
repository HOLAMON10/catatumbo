import { injectable } from 'inversify';

import {
	MeetingRoomReservationDocumentInterface,
	MeetingRoomsReservationSchema,
} from '../models/meeting-room-reservation.model';
import { MeetingRoomReservationModelInterface } from '../interfaces/models';
import { MeetingRoomReservationsServiceInterface } from '../interfaces/services';
import {
	DataBaseActions,
	DataBaseErrorHandling,
	NotFoundDataHandling,
	ValidationError,
} from '../error-handlers';
import { ServiceResultInterface } from '../interfaces/service-result.interface';

@injectable()
export class MeetingRoomReservationsService implements MeetingRoomReservationsServiceInterface {
	public CreateRecord = this.createRecord;
	public ModifyRecord = this.modifyRecord;
	public GetAll = this.getAll;
	public GetById = this.getById;
	public Search = this.search;

	private dbDocument: MeetingRoomReservationDocumentInterface;

	public constructor() {}

	private async createRecord(
		payload: MeetingRoomReservationModelInterface
	): Promise<ServiceResultInterface> {
		try {
			const dbResult = await MeetingRoomsReservationSchema.findOne({
				meetingRoom: payload.meetingRoom,
				reservationDate: payload.reservationDate,
				reservationStartingHour: payload.reservationStartingHour,
				reservationEndingHour: payload.reservationStartingHour,
			});

			let result: any;
			if (dbResult) {
				throw new ValidationError(
					`The Meeting Room is already reserved between ${payload.reservationStartingHour} and ${payload.reservationEndingHour}`
				);
			}

			result = await this.insert(payload);

			return {
				code: 'success',
				detail: result,
			};
		} catch (ex) {
			console.log('ex :>> ', ex);
			throw ex;
		}
	}

	private async modifyRecord(
		payload: MeetingRoomReservationModelInterface
	): Promise<ServiceResultInterface> {
		try {
			let dbResult = await MeetingRoomsReservationSchema.findById(payload._id);

			if (!dbResult) {
				throw new NotFoundDataHandling(`Reservation with the _id ${payload._id} was not found`);
			}

			return {
				code: 'success',
				detail: await this.update(dbResult, payload),
			};
		} catch (ex) {
			throw ex;
		}
	}

	private async getAll(): Promise<ServiceResultInterface> {
		try {
			let dbResult: MeetingRoomReservationModelInterface[] =
				await MeetingRoomsReservationSchema.find()
					.populate('meetingRoom', ['name'])
					.populate('status', ['name'])
					.populate('stakeHolder', ['firstName', 'lastName', 'email'])
					.populate('status', ['name'])
					.populate('createdBy', ['firstName', 'lastName', 'email'])
					.populate('lastModificationBy', ['firstName', 'lastName', 'email']);

			return {
				code: 'success',
				detail: dbResult,
			};
		} catch (ex) {
			throw ex;
		}
	}

	private async getById(reservationId: string): Promise<ServiceResultInterface> {
		try {
			const dbResult = await MeetingRoomsReservationSchema.findById(reservationId)
				.populate('status', ['name'])
				.populate('meetingRoom', ['name'])
				.populate('stakeHolder', ['firstName', 'lastName', 'email'])
				.populate('status', ['name'])
				.populate('createdBy', ['firstName', 'lastName', 'email'])
				.populate('lastModificationBy', ['firstName', 'lastName', 'email']);

			return {
				code: 'success',
				detail: dbResult,
			};
		} catch (ex) {
			throw ex;
		}
	}

	private async search(params: any, populateAll: boolean): Promise<ServiceResultInterface> {
		try {
			let dbResult: MeetingRoomReservationDocumentInterface[] =
				await MeetingRoomsReservationSchema.find(params || {});

			if (populateAll) {
				const populateOptions: any[] = [
					{
						path: 'meetingRoom',
						select: ['name'],
						model: 'MeetingRoom',
						strictPopulate: false,
					},
					{
						path: 'stakeHolder',
						select: ['firstName', 'lastName', 'email'],
						model: 'Agent',
						strictPopulate: false,
					},
					{
						path: 'status',
						select: ['name'],
						model: 'MeetingRoomReservationStatus',
						strictPopulate: false,
					},
					{
						path: 'createdBy',
						select: ['firstName', 'lastName', 'email'],
						model: 'User',
						strictPopulate: false,
					},
					{
						path: 'lastModificationBy',
						select: ['firstName', 'lastName', 'email'],
						model: 'User',
						strictPopulate: false,
					},
				];

				dbResult = await MeetingRoomsReservationSchema.populate(dbResult, populateOptions);
			}

			if (!dbResult) {
				return {
					code: 'notDataFound',
					detail: 'Data not found',
				};
			}

			return {
				code: 'success',
				detail: dbResult,
			};
		} catch (ex) {
			console.log('ex :>> ', ex);
			throw ex;
		}
	}

	private async insert(payload: MeetingRoomReservationModelInterface): Promise<any> {
		try {
			this.dbDocument = new MeetingRoomsReservationSchema({
				...payload,
				creationTimestamp: Date.now(),
			});
			const result = await this.dbDocument.save({ validateBeforeSave: true });

			return {
				actionPerformed: 'dataCreation',
				result: result._id,
			};
		} catch (ex) {
			throw new DataBaseErrorHandling(
				ex.message || ex,
				MeetingRoomsReservationSchema.modelName,
				DataBaseActions.insert
			);
		}
	}

	private async update(
		payload: MeetingRoomReservationDocumentInterface,
		newObj: MeetingRoomReservationModelInterface
	): Promise<any> {
		try {
			console.log('object :>> ', newObj.status);
			payload.meetingRoom = newObj.meetingRoom || payload.meetingRoom;
			payload.reservationDate = newObj.reservationDate || payload.reservationDate;
			payload.reservationStartingHour =
				newObj.reservationStartingHour || payload.reservationStartingHour;
			payload.reservationEndingHour =
				newObj.reservationEndingHour || payload.reservationEndingHour;
			payload.stakeHolder = newObj.stakeHolder || payload.stakeHolder;
			payload.description = newObj.description || payload.description;
			payload.status = newObj.status || payload.status;
			payload.lastModificationBy = newObj.lastModificationBy || payload.lastModificationBy;
			payload.lastModificationTimestamp = Date.now();

			payload.markModified('MeetingRoomsReservationSchema');
			const result = await payload.save();

			return {
				actionPerformed: 'dataModification',
				result: result._id,
			};
		} catch(ex) {
			throw new DataBaseErrorHandling(
				ex.message || ex,
				MeetingRoomsReservationSchema.modelName,
				DataBaseActions.update
			);
		}
	}
}
