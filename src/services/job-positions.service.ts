import { injectable } from 'inversify';

import { JobPositionDocumentInterface, JobPositionSchema } from '../models';
import { JobPositionModelInterface } from '../interfaces/models';
import { JobPositionsServiceInterface } from '../interfaces/services';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import {
    DataBaseActions,
    DataBaseErrorHandling,
    NotFoundDataHandling,
    RecordAlreadyCreatedHandling,
} from '../error-handlers';

@injectable()
export class JobPositionsService implements JobPositionsServiceInterface {
    public CreateRecord = this.createRecord;
    public ModifyRecord = this.modifyRecord;
    public GetAll = this.getAll;
    public GetById = this.getById;
    public Search = this.search;

    private dbDocument: JobPositionDocumentInterface;

    public constructor() {}

    private async createRecord(payload: JobPositionModelInterface): Promise<ServiceResultInterface> {
        try {
            const dbResult = await JobPositionSchema.findOne({
                referenceCode: payload.referenceCode.trim(),
            });

            let result: any;
            if (dbResult) {
                throw new RecordAlreadyCreatedHandling(
                    `The Job Position with the Reference Code ${payload.referenceCode} is already created`
                );
            }

            result = await this.insert(payload);

            return {
                code: 'success',
                detail: result,
            };
        } catch (ex) {
            throw ex;
        }
    }

    private async modifyRecord(payload: JobPositionModelInterface): Promise<ServiceResultInterface> {
        try {
            let dbResult = await JobPositionSchema.findById(payload._id);

            if (!dbResult) {
                throw new NotFoundDataHandling(`Meeting room with the _id ${payload._id} was not found`);
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
            let dbResult: JobPositionDocumentInterface[] = await JobPositionSchema.find()
                .populate({
                    path: 'language',
                    model: 'AllowedPlatformLanguage',
                    select: ['_id', 'name'],
                })
                .populate({ path: 'createdBy', select: ['email', 'firstName', 'lastName', 'isActive'] })
                .populate({
                    path: 'lastModificationBy',
                    select: ['email', 'firstName', 'lastName', 'isActive'],
                });
            return {
                code: 'success',
                detail: dbResult,
            };
        } catch (ex) {
            throw ex;
        }
    }

    private async getById(jobPositionId: string): Promise<ServiceResultInterface> {
        try {
            const dbResult = await JobPositionSchema.findById(jobPositionId);
            return {
                code: 'success',
                detail: dbResult,
            };
        } catch (ex) {
            throw ex;
        }
    }

    private async search(params: any, fieldsToRetreive: string[], populateAll?: boolean): Promise<ServiceResultInterface> {
        try {
            let dbResult: JobPositionDocumentInterface[] = null;
            if (!populateAll) {
                dbResult = await JobPositionSchema.find(params).select(fieldsToRetreive);
            } else {
                dbResult = await JobPositionSchema.find(params)
                    .select(fieldsToRetreive)
                    .populate({
                        path: 'language',
                        model: 'AllowedPlatformLanguage',
                        select: ['_id', 'name'],
                    })
                    .populate({ path: 'createdBy', select: ['email', 'firstName', 'lastName', 'isActive'] })
                    .populate({
                        path: 'lastModificationBy',
                        select: ['email', 'firstName', 'lastName', 'isActive'],
                    });
            }
            return {
                code: 'success',
                detail: dbResult,
            };
        } catch (ex) {
            throw ex;
        }
    }

    private async insert(payload: JobPositionModelInterface): Promise<any> {
        try {
            this.dbDocument = new JobPositionSchema({
                ...payload,
                createdDate: Date.now(),
            });

            const result = await this.dbDocument.save({
                validateBeforeSave: true,
            });

            return {
                actionPerformed: 'dataCreation',
                result: result._id,
            };
        } catch (ex) {
            console.log('ex :>> ', ex);
            throw new DataBaseErrorHandling(
                'Error creating the new Job Position',
                JobPositionSchema.name,
                DataBaseActions.insert
            );
        }
    }

    private async update(payload: JobPositionDocumentInterface, newObj: JobPositionModelInterface): Promise<any> {
        try {
            payload.name = newObj.name || payload.name;
            payload.jobDescription = newObj.jobDescription || payload.jobDescription;
            payload.jobRequirements = newObj.jobRequirements || payload.jobRequirements;
            payload.language = newObj.language || payload.language;
            payload.minimunAge = newObj.minimunAge || payload.minimunAge;
            payload.isActive = newObj.isActive;
            payload.lastModificationBy = newObj.lastModificationBy || payload.lastModificationBy;
            payload.lastModificationTimestamp = Date.now();
            payload.markModified(JobPositionSchema.modelName);

            const result = await payload.save();

            return {
                actionPerformed: 'dataModification',
                result: result._id,
            };
        } catch (ex) {
            throw new DataBaseErrorHandling(
                'Error modifying Job Position data',
                JobPositionSchema.name,
                DataBaseActions.update
            );
        }
    }
}
