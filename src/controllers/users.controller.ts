import Validator from 'params-verifier';
import {
	controller,
	interfaces,
	httpGet,
	httpPost,
	httpPut,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';

import { ApiTypes } from '../apiTypes';
import { ConstantValues } from '../constantValues';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { UserModelInterface } from '../interfaces/models';
import { UsersService } from '../services';
import { handleErrorResponse, ValidationError } from '../error-handlers';

@controller(ConstantValues.users)
export class UsersController implements interfaces.Controller {
	private userSrv: UsersService;

	public constructor(@inject(ApiTypes.usersService) userSrv: UsersService) {
		this.userSrv = userSrv;
	}

	@httpPost('/')
	public async CreateRecord(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface =
				await this.userSrv.CreateRecord(
					this.validateWorkingObject(req.body, false)
				);
			if (!serviceResult) {
				res.status(200).send({
					code: 'requestNotProcessed',
					detail: 'Any data was saved',
				});
			} else {
				let statusCode: number = 500;
				if (serviceResult.code !== 'error') {
					statusCode = 200;
				}
				res.status(statusCode).send(serviceResult);
			}
		} catch (ex) {
			handleErrorResponse(ex, res);
		}
	}

	@httpPut('/')
	public async Modify(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface =
				await this.userSrv.ModifyRecord(
					this.validateWorkingObject(req.body, true)
				);
			if (!serviceResult) {
				res.status(200).send({
					code: 'requestNotProcessed',
					detail: 'Any data was saved',
				});
			} else {
				let statusCode: number = 500;
				if (serviceResult.code !== 'error') {
					statusCode = 200;
				}
				res.status(statusCode).send(serviceResult);
			}
		} catch (ex) {
			handleErrorResponse(ex, res);
		}
	}

	@httpGet('/')
	public async GetAll(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface =
				await this.userSrv.GetAll();
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
			let serviceResult: ServiceResultInterface =
				await this.userSrv.GetById(req.params.id);
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
			let serviceResult: ServiceResultInterface =
				await this.userSrv.Search(
					req.body.workingObject,
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
	): UserModelInterface {
		try {
			if (!workingObj) {
				throw 'body is required';
			}

			const paramValidator = new Validator(workingObj, 'object', {
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
					.field('lastModificationUser', 'string', {
						required: true,
						validatorErrMsg: 'lastModificationUser is required',
						typeErrMsg:
							'wrong value type on field lastModificationUser',
					});
				if (!ObjectId.isValid(workingObj._id)) {
					throw 'field _id is not a valid  ObjecId';
				}
			}

			paramValidator
				.field('firstName', 'string', {
					required: true,
					validatorErrMsg: "firstName it's required",
					typeErrMsg: 'wrong value type on field firstName',
				})
				.field('lastName', 'string', {
					required: true,
					validatorErrMsg: "lastName it's required",
					typeErrMsg: 'wrong value type on field lastName',
				})
				.field('email', 'string', {
					required: true,
					validatorErrMsg: "email it's required",
					typeErrMsg: 'wrong value type on field email',
				})
				.field('accessProfile', 'string', {
					required: true,
					validatorErrMsg: "accessProfile it's required",
					typeErrMsg: 'wrong value type on field accessProfile',
				})
				.field('userType', 'string', {
					required: true,
					validatorErrMsg: "userType it's required",
					typeErrMsg: 'wrong value type on field userType',
				})
				.field('isActive', 'boolean', {
					required: false,
					validatorErrMsg: "isActive it's required",
				});

			// validate if dashboard is a valid string
			if (workingObj.dashboardId) {
				if (typeof workingObj.dashboardId !== 'string') {
					throw 'wrong value type on field dashboardId';
				}
			}

			// validate if dashboard is a valid string
			if (workingObj.dashboardType) {
				if (typeof workingObj.dashboardType !== 'string') {
					throw 'wrong value type on field dashboardType';
				}
			}

			// validate if dashboard is a valid string
			if (workingObj.dashboardUrl) {
				if (typeof workingObj.dashboardUrl !== 'string') {
					throw 'wrong value type on field dashboardUrl';
				}
			}

			// validate if allowedPermissions is an array
			if (!Array.isArray(workingObj.allowedPermissions)) {
				throw 'allowedPermissions is not an array';
			}

			// validate if allowedPermissions items are strings
			workingObj.allowedPermissions.forEach((permissionsItem) => {
				if (typeof permissionsItem !== 'string') {
					throw 'one or more items of allowedPermissions are not a valid string';
				}
			});

			// validate if dashboardsList is an array
			if (!Array.isArray(workingObj.dashboardsList)) {
				throw 'dashboardsList is not an array';
			}

			// validate each item inside dashboardsList
			workingObj.dashboardsList.forEach((item) => {
				if (item.dsahboardId && typeof item.dashboardId !== 'string') {
					throw 'wrong value type on field dashboardId';
				}

				if (
					item.dashboardName &&
					typeof item.dashboardName !== 'string'
				) {
					throw 'wrong value type on field dashboardName';
				}
				if (
					item.dashboardUrl &&
					typeof item.dashboardUrl !== 'string'
				) {
					throw 'wrong value type on field dashboardUrl';
				}
			});

			return {
				_id: workingObj._id,
				email: workingObj.email,
				firstName: workingObj.firstName,
				lastName: workingObj.lastName,
				accessProfile: workingObj.accessProfile,
				allowedPermissions: workingObj.allowedPermissions,
				dashboardId: workingObj.dashboardId,
				dashboardType: workingObj.dashboardType,
				dashboardUrl: workingObj.dashboardUrl,
				dashboardsList: workingObj.dashboardsList,
				userType: workingObj.userType,
				isActive: workingObj.isActive,
				createdBy: workingObj.createdBy,
				lastModificationUser: workingObj.lastModificationUser,
			};
		} catch (ex) {
			throw new ValidationError(ex.message ? ex.message : ex);
		}
	}
}
