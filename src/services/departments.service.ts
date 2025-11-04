import { injectable } from 'inversify';

import { DepartmentDocumentInterface, DepartmentSchema } from '../models';
import { DepartmentModelInterface } from '../interfaces/models';
import { DepartmentsServiceInterface } from '../interfaces/services';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import {
	DataBaseActions,
	DataBaseErrorHandling,
	NotFoundDataHandling,
	RecordAlreadyCreatedHandling,
} from '../error-handlers';

@injectable()
export class DepartmentsService implements DepartmentsServiceInterface {
	public CreateRecord = this.createRecord;
	public ModifyRecord = this.modifyRecord;
	public GetAll = this.getAll;
	public GetByID = this.getByID;
	public Search = this.search;

	private dbDocument: DepartmentDocumentInterface;

	public constructor() {}

	private async createRecord(
		workingObj: DepartmentModelInterface
	): Promise<ServiceResultInterface> {
		try {
			const dbResult = await DepartmentSchema.findOne({
				refCode: workingObj.refCode.trim(),
			});
			let result: any;
			if (dbResult) {
				throw new RecordAlreadyCreatedHandling(
					`department with refCode ${workingObj.refCode} is already created.`
				);
			} else {
				result = await this.insert(workingObj);
			}
			return {
				code: 'success',
				detail: result,
			};
		} catch (ex) {
			throw ex;
		}
	}

	private async modifyRecord(
		workingObj: DepartmentModelInterface
	): Promise<ServiceResultInterface> {
		try {
			let dbResult = await DepartmentSchema.findById(workingObj._id);
			if (!dbResult) {
				throw new NotFoundDataHandling(
					`department with code ${workingObj._id} was not found`
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
			let dbResult: DepartmentDocumentInterface[] = await DepartmentSchema.find();
			return {
				code: 'success',
				detail: dbResult,
			};
		} catch (ex) {
			throw ex;
		}
	}

	private async getByID(id: string): Promise<ServiceResultInterface> {
		try {
			let dbResult: DepartmentDocumentInterface = await DepartmentSchema.findById(
				id
			)
				.populate({
					path: 'manager',
					select: ['firstName', 'lastName', 'email'],
					model: 'User',
					strictPopulate: false,
				})
				// .populate({
				// 	path: 'categories.employeeOnCharge',
				// 	select: ['firstName', 'lastName', 'email'],
				// 	model: 'Agent',
				// 	strictPopulate: false,
				// })
				.populate({
					path: 'createdBy',
					select: ['firstName', 'lastName', 'email'],
					model: 'User',
				})
				.populate({
					path: 'lastModificationBy',
					select: ['firstName', 'lastName', 'email'],
					model: 'User',
				});
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
		fieldsToRetreive: string[],
		populateAll?: boolean
	): Promise<ServiceResultInterface> {
		try {
			let dbResult: DepartmentDocumentInterface[] = await DepartmentSchema.find(
				params
			).select(fieldsToRetreive);
			if (populateAll) {
				dbResult = await DepartmentSchema.populate(dbResult, [
					{
						path: 'manager',
						select: ['firstName', 'lastName', 'email'],
						model: 'User',
						strictPopulate: false,
					},
					// {
					// 	path: 'categories.employeeOnCharge',
					// 	select: ['firstName', 'lastName', 'email'],
					// 	model: 'Agent',
					// 	strictPopulate: false,
					// },
					{
						path: 'createdBy',
						select: ['firstName', 'lastName', 'email'],
						model: 'User',
					},
					{
						path: 'lastModificationBy',
						select: ['firstName', 'lastName', 'email'],
						model: 'User',
					},
				]);
			}

			return {
				code: 'success',
				detail: dbResult,
			};
		} catch (ex) {
			throw ex;
		}
	}

	private async insert(workingObj: DepartmentModelInterface): Promise<any> {
		try {
			this.dbDocument = new DepartmentSchema({
				...workingObj,
				creationTimestamp: Date.now(),
			});
			const result = await this.dbDocument.save({ validateBeforeSave: true });
			return {
				actionPerformed: 'dataCreation',
				result: result._id,
			};
		} catch (ex) {
			throw new DataBaseErrorHandling(
				ex,
				DepartmentSchema.name,
				DataBaseActions.insert
			);
		}
	}

	private async update(
		workingObject: DepartmentDocumentInterface,
		newObject: DepartmentModelInterface
	): Promise<any> {
		try {
			workingObject.refCode = newObject.refCode || workingObject.refCode;
			workingObject.name = newObject.name || workingObject.name;
			workingObject.description =
				newObject.description || workingObject.description;
			// workingObject.categories = newObject.categories || workingObject.categories;
			workingObject.manager = newObject.manager;
			workingObject.isActive = newObject.isActive;
			workingObject.lastModificationTimestamp = Date.now();
			workingObject.markModified(DepartmentSchema.modelName);
			const result = await workingObject.save();
			return {
				actionPerformed: 'dataModification',
				result: result._id,
			};
		} catch (ex) {
			throw new DataBaseErrorHandling(
				ex,
				DepartmentSchema.name,
				DataBaseActions.update
			);
		}
	}
}
