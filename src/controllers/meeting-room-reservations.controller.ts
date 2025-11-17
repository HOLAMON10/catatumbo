import * as Validator from 'params-verifier';
import { controller, interfaces, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { MeetingRoomReservationModelInterface } from '../interfaces/models';
import { MeetingRoomReservationsService } from '../services';
import { ApiTypes } from '../apiTypes';
import { ConstantValues } from '../constantValues';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { handleErrorResponse, ValidationError } from '../error-handlers';

@controller(ConstantValues.meetingroomreservations)
export class MeetingRoomsReservationsController implements interfaces.Controller {
	private dataSrv: MeetingRoomReservationsService;

	public constructor(
		@inject(ApiTypes.meetingRoomReservationService)
		dataSrv: MeetingRoomReservationsService
	) {
		this.dataSrv = dataSrv;
	}

	@httpPost('/')
	public async Create(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.CreateRecord(
				this.validatePayload(req.body, false)
			);

			if (!serviceResult) {
				res.status(400).send({
					code: 'requestNotProcessed',
					detail: 'Any data was created',
				});
			} else {
				res.status(200).send(serviceResult);
			}
		} catch (ex) {
			handleErrorResponse(ex, res);
		}
	}

	@httpPut('/')
	public async modify(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.ModifyRecord(
				this.validatePayload(req.body, true)
			);

			if (!serviceResult) {
				res.status(400).send({
					code: 'requestNotProcessed',
					detail: 'Any data was saved',
				});
			} else {
				res.status(200).send(serviceResult);
			}
		} catch (ex) {
			handleErrorResponse(ex, res);
		}
	}

	@httpGet('/')
	public async getAll(req: Request, res: Response): Promise<ServiceResultInterface> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.GetAll();

			if (!serviceResult) {
				res.status(400).send({
					code: 'requestNotProcessed',
					detial: 'Any data was retrieved',
				});
				return;
			}
			res.status(200).send(serviceResult);
		} catch (ex) {
			handleErrorResponse(ex, res);
		}
	}

	@httpGet('/:id')
	public async getById(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.GetById(req.params.id);

			if (serviceResult.code === 'error') {
				res.status(400).send(serviceResult);
				return;
			}
			res.status(200).send(serviceResult);
		} catch (ex) {
			handleErrorResponse(ex, res);
		}
	}

	@httpPost('/search')
	public async search(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.Search(
				req.body.payload,
				req.body.populateAll
			);

			if (!serviceResult) {
				res.status(400).send({
					code: 'requestNotProcessed',
					detail: ' Any data was retrieved',
				});
				return;
			}
			res.status(200).send(serviceResult);
		} catch (ex) {
			handleErrorResponse(ex, res);
		}
	}

	private validatePayload(
		payload: any,
		updatingRecord: boolean
	): MeetingRoomReservationModelInterface {
		try {
			console.log('payload :>> ', payload);
			if (!payload) {
				throw 'Body is required';
			}

			const paramValidator = new Validator(payload, 'object', {
				required: true,
				stringNoEmpty: true,
			});

			if (updatingRecord) {
				paramValidator.field('_id', 'string', {
					required: true,
					validatorErrMsg: '_id is required',
					typeErrMsg: 'wrong value type on field _id',
				});
				paramValidator.field('lastModificationBy', 'string', {
					required: true,
					validatorErrMsg: 'lastModificationBy is required',
					typeErrMsg: 'wrong value type on field lastModificationBy',
				});

				if (!ObjectId.isValid(payload._id)) {
					throw 'field _id is not a valid object';
				}
			} else {
				paramValidator.field('createdBy', 'string', {
					required: true,
					validatorErrMsg: 'createdBy is required',
					typeErrMsg: 'wrong value type on field createdBy',
				});
			}

			paramValidator
				.field('meetingRoom', 'string', {
					required: true,
					validatorErrMsg: 'meetingRoom is required',
					typeErrMsg: 'wrong value type on field meetingRoom',
				})
				.field('reservationDate', 'string', {
					required: true,
					validatorErrMsg: 'reservationDate is required',
					typeErrMsg: 'wrong value type on field reservationDate',
				})
				.field('reservationStartingHour', 'string', {
					required: true,
					validatorErrMsg: 'reservationStartingHour is required',
					typeErrMsg: 'wrong value type on field reservationStartingHour',
				})
				.field('reservationEndingHour', 'string', {
					required: true,
					validatorErrMsg: 'reservationEndingHour is required',
					typeErrMsg: 'wrong value type on field reservationEndingHour',
				})
				.field('description', 'string', {
					required: true,
					validatorErrMsg: 'description is required',
					typeErrMsg: 'wrong value type on field description',
				});

			return {
				_id: payload._id,
				meetingRoom: payload.meetingRoom,
				reservationDate: payload.reservationDate,
				reservationStartingHour: payload.reservationStartingHour,
				reservationEndingHour: payload.reservationEndingHour,
				stakeHolder: payload.stakeHolder,
				description: payload.description,
				status: payload.status,
				createdBy: payload.createdBy,
				creationTimestamp: payload.creationTimestamp,
				lastModificationBy: payload.lastModificationBy,
			};
		} catch (ex) {
			console.log('ex :>> ', ex);
			throw new ValidationError(ex.message ? ex.message : ex);
		}
	}
}
