import Validator from 'params-verifier';
import {
	controller,
	httpGet,
	httpPost,
	httpPut,
	interfaces,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import { ApiTypes } from '../apiTypes';
import { ConstantValues } from '../constantValues';
import { DepartmentsService } from '../services';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { handleErrorResponse, ValidationError } from '../error-handlers';
import {
	DepartmentCategoryInterface,
	DepartmentModelInterface,
} from '../interfaces/models';

@controller(ConstantValues.departments)
export class DepartmentsController implements interfaces.Controller {
	private dataSrv: DepartmentsService;

	public constructor(@inject(ApiTypes.departmentsService) dataSrv: DepartmentsService) {
		this.dataSrv = dataSrv;
	}

	@httpPost('/')
	public async CreateRecord(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.CreateRecord(
				this.validateWorkingObject(req.body, false)
			);
			if (!serviceResult) {
				res.status(400).send({
					code: 'requestNotProcessed',
					detail: 'Any data was saved',
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
	public async Modify(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.ModifyRecord(
				this.validateWorkingObject(req.body, true)
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
	public async getAll(req: Request, res: Response): Promise<void> {
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
	public async getByID(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.GetByID(
				req.params.id
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

	@httpPost('/search')
	public async Search(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.Search(
				req.body.workingObject,
				req.body.fieldsToRetreive,
				req.body.populateAll
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

	private validateWorkingObject(
		workingObj: any,
		updatingRecord: boolean
	): DepartmentModelInterface {
		try {
			if (!workingObj) {
				throw 'body is required';
			}

			const paramValidator = new Validator(workingObj, 'object', {
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
				paramValidator
					.field('_id', 'string', {
						required: true,
						validatorErrMsg: '_id is required',
						typeErrMsg: 'wrong value type on field _id',
					})
					.field('lastModificationBy', 'string', {
						required: true,
						validatorErrMsg: 'lastModificationBy is required',
						typeErrMsg: 'wrong value type on field lastModificationBy',
					});
			}

			paramValidator
				.field('refCode', 'string', {
					required: true,
					validatorErrMsg: 'refCode is required',
					typeErrMsg: 'wrong value type on field refCode',
				})
				.field('name', 'string', {
					required: true,
					validatorErrMsg: 'name is required',
					typeErrMsg: 'wrong value type on field name',
				})
				.field('isActive', 'boolean', {
					required: true,
					validatorErrMsg: 'isActive is required',
					typeErrMsg: 'wrong value type on field isActive',
				});

			if (workingObj.descripton && typeof workingObj.description !== 'string') {
				throw new ValidationError('description is not a valid string');
			}

			if (workingObj.manager && typeof workingObj.manager !== 'string') {
				throw new ValidationError('manager is not a valid string');
			}

			// if (workingObj.categories) {
			// 	if (!Array.isArray(workingObj.categories)) {
			// 		throw new ValidationError('categories is not a valid array');
			// 	}
			// 	(workingObj.categories as any[]).forEach((category) => {
			// 		this.validateDepartmentCategoryPayload(category);
			// 	});
			// }

			return {
				_id: workingObj._id,
				refCode: workingObj.refCode,
				name: workingObj.name,
				description: workingObj.description,
				manager: workingObj.manager,
				// categories: workingObj.categories,
				isActive: workingObj.isActive,
				createdBy: workingObj.createdBy,
				lastModificationBy: workingObj.lastModificationBy,
			};
		} catch (ex) {
			throw new ValidationError(ex.message ? ex.message : ex);
		}
	}

	private validateDepartmentCategoryPayload(payload: any): DepartmentCategoryInterface {
		try {
			if (!payload) {
				throw 'body is required';
			}

			const paramValidator = new Validator(payload, 'object', {
				required: true,
				stringNoEmpty: true,
			});
			paramValidator
				.field('id', 'string', {
					required: true,
					validatorErrMsg: 'refCode is required',
					typeErrMsg: 'wrong value type on field refCode',
				})
				.field('name', 'string', {
					required: true,
					validatorErrMsg: 'name is required',
					typeErrMsg: 'wrong value type on field name',
				})
				.field('isActive', 'boolean', {
					required: true,
					validatorErrMsg: 'isActive is required',
					typeErrMsg: 'wrong value type on field isActive',
				});

			if (payload.descripton && typeof payload.description !== 'string') {
				throw new ValidationError('description is not a valid string');
			}

			if (
				payload.employeeOnCharge &&
				typeof payload.employeeOnCharge !== 'string'
			) {
				throw new ValidationError('employeeOnCharge is not a valid string');
			}

			return {
				id: payload._id,
				name: payload.name,
				description: payload.description,
				employeeOnCharge: payload.employeeOnCharge,
				isActive: payload.isActive,
			};
		} catch (ex) {
			throw new ValidationError(ex.message ? ex.message : ex);
		}
	}
}
