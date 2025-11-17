import { injectable } from 'inversify';

import {
	AccessProfileSchema,
	UserDocumentInterface,
	UserPermissionSchema,
	UserSchema,
} from '../models';
import { UserModelInterface } from '../interfaces/models';
import { UsersServiceInterface } from '../interfaces/services';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { CommonFunctions } from '../common/common-functions';
import {
	DataBaseActions,
	DataBaseErrorHandling,
	NotFoundDataHandling,
	RecordAlreadyCreatedHandling,
	ValidationError,
} from '../error-handlers';

@injectable()
export class UsersService implements UsersServiceInterface {
	//#region Public Properties

	public CreateRecord = this.createRecord;
	public ModifyRecord = this.modifyRecord;
	public GetAll = this.getAll;
	public GetById = this.getById;
	public Search = this.search;

	//#endregion

	private dbDocument: UserDocumentInterface;
	private selectableFields = [
		'_id',
		'firstName',
		'lastName',
		'email',
		'accessProfile',
		'allowedPermissions',
		'dashboardId',
		'dashboardType',
		'dashboardUrl',
		'dashboardsList',
		'accessToken',
		'userType',
		'isActive',
		'isConfirmed',
		'createdBy',
		'createdDate',
		'lastModificationUser',
		'lastModificationDate',
	];

	public constructor() {}

	//#region Private Functions

	private async createRecord(
		workingObj: UserModelInterface
	): Promise<ServiceResultInterface> {
		try {
			let result: any;
			// validating if the user has been created previously
			const dbResult: UserDocumentInterface = await UserSchema.findOne({
				email: workingObj.email.trim(),
			});

			// validating if the record is already created
			if (dbResult) {
				throw new RecordAlreadyCreatedHandling(
					`the user with email "${workingObj.email}" is already created`
				);
			}

			// validate if userPermissions items exists and if it's activated
			if (workingObj.allowedPermissions?.length) {
				this.validateUserPermissions(workingObj.allowedPermissions);
			}

			result = await this.insert(workingObj);
			return {
				code: 'success',
				detail: result,
			};
		} catch (ex) {
			throw ex;
		}
	}

	private async modifyRecord(
		workingObj: UserModelInterface
	): Promise<ServiceResultInterface> {
		try {
			let dbResult: UserDocumentInterface = await UserSchema.findById(
				workingObj._id
			);

			// validate if userPermissions items exists and if it's activated
			if (workingObj.allowedPermissions?.length) {
				this.validateUserPermissions(workingObj.allowedPermissions);
			}

			let result: any;
			if (!dbResult) {
				throw new NotFoundDataHandling(
					`User not found for _id ${workingObj._id}`
				);
			}
			return {
				code: 'success',
				detail: await this.update(dbResult, workingObj),
			};
		} catch (ex) {
			throw ex;
		}
	}

	private async getAll(): Promise<ServiceResultInterface> {
		try {
			let dbResult: UserDocumentInterface[] = await UserSchema.find()
				.select(this.selectableFields)
				.populate('accessProfile', ['code', 'name'])
				.populate('userType', ['name'])
				.populate('createdBy', [
					'email',
					'firstName',
					'lastName',
					'isActive',
				])
				.populate('lastModificationUser', [
					'email',
					'firstName',
					'lastName',
					'isActive',
				]);
			return {
				code: 'success',
				detail: dbResult,
			};
		} catch (ex) {
			throw ex;
		}
	}

	private async getById(userId: string): Promise<ServiceResultInterface> {
		try {
			const dbResult: UserModelInterface = await UserSchema.findById(
				userId
			)
				.select([...this.selectableFields, 'verificationToken'])
				.populate('accessProfile', [
					'code',
					'name',
					'menuOptions',
					'allowedTicketTypes',
				])
				.populate('userType', ['name'])
				.populate('createdBy', [
					'email',
					'firstName',
					'lastName',
					'isActive',
				])
				.populate('lastModificationUser', [
					'email',
					'firstName',
					'lastName',
					'isActive',
				]);
			return {
				code: 'success',
				detail: dbResult,
			};
		} catch (ex) {
			throw ex;
		}
	}

	private async search(
		params: any,
		populateAll: boolean
	): Promise<ServiceResultInterface> {
		try {
			let dbResult: UserDocumentInterface[] = [];
			if (populateAll) {
				dbResult = await UserSchema.find(params)
					.select(this.selectableFields)
					.populate('accessProfile', [
						'code',
						'name',
						'menuOptions',
						'allowedTicketTypes',
					])
					.populate('userType', ['name'])
					.populate('createdBy', [
						'email',
						'firstName',
						'lastName',
						'isActive',
					])
					.populate('lastModificationUser', [
						'email',
						'firstName',
						'lastName',
						'isActive',
					]);
			} else {
				dbResult = await UserSchema.find(params).select(
					this.selectableFields
				);
			}
			return {
				code: 'success',
				detail: dbResult,
			};
		} catch (ex) {
			throw ex;
		}
	}

	private async insert(workingObj: UserModelInterface): Promise<any> {
		try {
			const verificationToken = CommonFunctions.generateUUID(false);
			this.dbDocument = new UserSchema({
				...workingObj,
				verificationToken,
			});
			const result = await this.dbDocument.save({
				validateBeforeSave: true,
			});
			return {
				actionPerformed: 'dataCreation',
				result: {
					_id: result._id,
					verificationToken,
				},
			};
		} catch (ex) {
			console.log(ex)
			throw new DataBaseErrorHandling(
				'error creating new user',
				UserSchema.name,
				DataBaseActions.insert
			);
		}
	}

	private async update(
		workingObject: UserDocumentInterface,
		newObject: UserModelInterface
	): Promise<any> {
		try {
			workingObject.firstName =
				newObject.firstName || workingObject.firstName;
			workingObject.lastName =
				newObject.lastName || workingObject.lastName;
			workingObject.email = newObject.email || workingObject.email;
			workingObject.accessProfile = newObject.accessProfile;
			workingObject.allowedPermissions = newObject.allowedPermissions;
			workingObject.dashboardType = newObject.dashboardType || null;
			workingObject.dashboardUrl = newObject.dashboardUrl || null;
			workingObject.dashboardId = newObject.dashboardId ?? null;
			workingObject.dashboardsList =
				newObject.dashboardsList || workingObject.dashboardsList;

			workingObject.userType =
				newObject.userType || workingObject.userType;
			if (
				newObject.isActive !== null &&
				newObject.isActive !== undefined
			) {
				workingObject.isActive = newObject.isActive;
			}
			workingObject.lastModificationUser = newObject.lastModificationUser;
			workingObject.lastModificationDate = Date.now();
			workingObject.markModified(UserSchema.modelName);
			const result = await workingObject.save();
			return {
				actionPerformed: 'dataModification',
				result: result._id,
			};
		} catch (ex) {
			throw new DataBaseErrorHandling(
				'error modifying user data',
				UserSchema.name,
				DataBaseActions.update
			);
		}
	}

	private async validateUserPermissions(allowedPermissions: string[]) {
		try {
			const dbResult = await UserPermissionSchema.find({
				isActive: true,
			}).select(['_id']);

			// Validate if you are getting values
			if (dbResult.length === 0) {
				throw new ValidationError('No user permissions were found');
			}

			allowedPermissions.forEach((permissionItem) => {
				if (
					!dbResult.filter((item) => item._id === permissionItem)
						.length
				) {
					throw new ValidationError(
						`${permissionItem} does not exist or is not active`
					);
				}
			});
		} catch (ex) {
			throw new DataBaseErrorHandling(
				'error validating user permissions',
				UserSchema.name,
				DataBaseActions.find
			);
		}
	}
}
