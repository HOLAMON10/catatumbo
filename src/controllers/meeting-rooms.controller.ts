import * as Validator from 'params-verifier';
import { controller, interfaces, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import { ApiTypes } from '../apiTypes';
import { ConstantValues } from '../constantValues';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { MeetingRoomModelInterface } from '../interfaces/models';
import { MeetingRoomsService } from '../services';
import { handleErrorResponse, ValidationError } from '../error-handlers';

@controller(ConstantValues.meetingrooms)
export class MeetingRoomsController implements interfaces.Controller {
	private dataSrv: MeetingRoomsService;

	public constructor(@inject(ApiTypes.meetingRoomsService) dataSrv: MeetingRoomsService) {
		this.dataSrv = dataSrv;
	}

	@httpPost('/')
	public async CreateRecord(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.CreateRecord(
				this.validatepayload(req.body, false)
			);

			if (!serviceResult) {
				res.status(400).send({
					code: 'requestNotProcessed',
					detail: 'Any data was created',
				});
				return;
			} else {
				res.status(200).send(serviceResult);
			}
		} catch (ex) {
			handleErrorResponse(ex, res);
		}
	}

	@httpPut('/')
	public async ModifyRecord(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.ModifyRecord(
				this.validatepayload(req.body, true)
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
	public async GetAll(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.GetAll();

			if (serviceResult.code === 'error') {
				res.status(500).send(serviceResult);
				return;
			}
			res.send(serviceResult);
		} catch (ex) {
			handleErrorResponse(ex, res);
		}
	}

	@httpGet('/:id')
	public async GetById(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.GetById(req.params.id);

			if (serviceResult.code === 'error') {
				res.status(500).send(serviceResult);
				return;
			}
			res.send(serviceResult);
		} catch (ex) {
			handleErrorResponse(ex, res);
		}
	}

	@httpPost('/search')
	public async Search(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.Search(
				req.body.payload,
				req.body.fieldsToRetreive
			);
			if (serviceResult.code === 'error') {
				res.status(500).send(serviceResult);
				return;
			}
			res.send(serviceResult);
		} catch (ex) {
			handleErrorResponse(ex, res);
		}
	}

	private validatepayload(payload: any, updatingRecord: boolean): MeetingRoomModelInterface {
		try {
			if (!payload) {
				throw 'Body is required';
			}

			const paramValidator = new Validator(payload, 'object', {
				required: true,
				stringNoEmpty: true,
			});

			if (!updatingRecord) {
				paramValidator.field('createdBy', 'string', {
					required: true,
					validatorErrMsg: 'createdBy is required',
					typeErrMsg: 'wrong value type on field createdBy',
				});
			} else {
				paramValidator.field('lastModificationUser', 'string', {
					required: true,
					validatorErrMsg: 'lastModificationUser is required',
					typeErrMsg: 'wrong value type on field lastModificationUser',
				});
			}

			paramValidator
				.field('name', 'string', {
					required: true,
					validatorErrMsg: 'name is required',
					typeErrMsg: 'wrong value type on field name',
				})
				.field('location', 'string', {
					required: true,
					validatorErrMsg: 'location is required',
					typeErrMsg: 'wrong value type on field location',
				})
				.field('chairs', 'number', {
					required: true,
					validatorErrMsg: 'chairs is required',
					typeErrMsg: 'wrong value type on field chairs',
				})
				.field('isActive', 'boolean', {
					required: true,
					validatorErrMsg: 'isActive is required',
				});

			if (!payload.schedule || !Array.isArray(payload.schedule)) {
				throw 'schedule is not a valid array';
			}
			(payload.schedule as any[]).map((s) => this.validateSchedule(s));

			return {
				_id: payload._id,
				name: payload.name,
				location: payload.location,
				chairs: payload.chairs,
				schedule: payload.schedule,
				isActive: payload.isActive,
				createdBy: payload.createdBy,
				lastModificationUser: payload.lastModificationUser,
			};
		} catch (ex) {
			throw new ValidationError(ex.message ? ex.message : ex);
		}
	}

	private validateSchedule(payload): any {
		try {
			new Validator(payload, 'object', {
				required: true,
				stringNoEmpty: true,
			})
				.field('day', 'number', {
					required: true,
					validatorErrMsg: 'day is required',
					typeErrMsg: 'wrong value type on field day',
				})
				.field('startingHour', 'string', {
					required: true,
					validatorErrMsg: 'startingHour is required',
					typeErrMsg: 'wrong value type on field startingHour',
				})
				.field('endingHour', 'string', {
					required: true,
					validatorErrMsg: 'endingHour is required',
					typeErrMsg: 'wrong value type on field endingHour',
				});
			return {
				day: payload.day,
				startingHour: payload.startingHour,
				endingHour: payload.endingHour,
			};
		} catch (ex) {
			throw ex;
		}
	}
}
