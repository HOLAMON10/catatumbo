import { injectable } from 'inversify';

import { AgentSchema, EmployeeAssistanceDocumentInterface, EmployeeAssistanceSchema, EmployeeTeamSchema } from '../models';
import { EmployeeAssistanceModelInterface } from '../interfaces/models';
import { EmployeeAssistancesServiceInterface } from '../interfaces/services';
import {
    DataBaseActions,
    DataBaseErrorHandling,
    NotFoundDataHandling,
    RecordAlreadyCreatedHandling,
    ValidationError,
} from '../error-handlers';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { ObjectId } from 'mongodb';
import moment = require('moment');

@injectable()
export class EmployeeAssistancesService implements EmployeeAssistancesServiceInterface {
    //#region Public Properties

    public CreateRecord = this.createRecord;
    public ModifyRecord = this.modifyRecord;
    public Search = this.search;

    //#endregion

    private dbDocument: EmployeeAssistanceDocumentInterface;

    public constructor() {}

    //#region Private Functions

    private async createRecord(payload: EmployeeAssistanceModelInterface): Promise<ServiceResultInterface> {
        try {
            let dbResult = await EmployeeAssistanceSchema.findOne({employee:payload.employee, assistanceDate:payload.assistanceDate});
            let result : any;
            if (dbResult) {
                result = await this.update(dbResult,payload)
            }
            else {result = await this.insert(payload);}

            return {
                code: 'success',
                detail: result,
            };
        } catch (ex) {
            throw ex;
        }
    }

    private async modifyRecord(payload: EmployeeAssistanceModelInterface): Promise<ServiceResultInterface> {
        try {
            let dbResult = await EmployeeAssistanceSchema.findOne({employee:payload.employee, assistanceDate:payload.assistanceDate});
            if (!dbResult) {
                throw new NotFoundDataHandling(`employee attendance with _id ${payload.employee} was not found`);
            }
            return {
                code: 'success',
                detail: await this.update(dbResult, payload),
            };
        } catch (ex) {
            throw ex;
        }
    }

    private async search(params: any, fieldsToRetreive: string[], populateAll: boolean): Promise<ServiceResultInterface> {
        try {
            // validating dates filters
            let newFilters: any = {};
            // creating assistance dates filters
            if (params) {
                // assistanceDateFrom
                if (params.assistanceDate) {
                    newFilters['assistanceDate'] = params.assistanceDate;
                } else {
                    if (params?.assistanceDateFrom && !moment(params?.assistanceDateFrom).isValid()) {
                        params.assistanceDateFrom = null;
                    }
                    // startingDateTo
                    if (params?.assistanceDateTo && !moment(params?.assistanceDateTo).isValid()) {
                        params.assistanceDateTo = null;
                    }
                    if (params?.assistanceDateFrom && params?.assistanceDateTo) {
                        newFilters.assistanceDate = {
                            $gte: params.assistanceDateFrom,
                            $lte: params.assistanceDateTo,
                        };
                    } else {
                        if (params?.assistanceDateFrom && !params?.assistanceDateTo) {
                            newFilters.assistanceDate = {
                                $gte: params?.assistanceDateFrom,
                            };
                        } else if (!params?.assistanceDateFrom && params?.assistanceDateTo) {
                            newFilters.assistanceDate = { $lte: params.assistanceDateTo };
                        }
                    }
                    delete params.assistanceDateFrom;
                    delete params.assistanceDateTo;
                }
                if (params._id) {
                    newFilters._id = new ObjectId(params._id);
                }
                if (params.employee) {
                    newFilters.employee = new ObjectId(params.employee);
                }
                if (params.assistanceType) {
                    newFilters.assistanceType = params.assistanceType;
                }
            }
            let dbResult: EmployeeAssistanceDocumentInterface[] = [];
            if (populateAll) {
                dbResult = await EmployeeAssistanceSchema.find(newFilters)
                    .populate('assistanceType', ['_id', 'name'], 'EmployeeAssistanceType')
                    .populate(
                        'employee',
                        [
                            'email',
                            'firstName',
                            'lastName',
                            'userName',
                            'alias',
                            'extensionNumber',
                            'monthlySalary',
                            'applySocialSecurityPercentage',
                            'status',
                            'assistanceHighlights',
                        ],
                        'Agent'
                    )
                    .populate('adminChecker', ['email', 'firstName', 'lastName', 'isActive'], 'User')
                    .populate('checkedBy', ['email', 'firstName', 'lastName', 'status'], 'Agent')
                    .populate({
                        path: 'assistantTypeStatusTracker.previousType',
                        select: ['_id', 'name'],
                        model: 'EmployeeAssistanceType',
                        strictPopulate: false,
                    })
                    .populate({
                        path: 'assistantTypeStatusTracker.adminChecker',
                        select: ['email', 'firstName', 'lastName', 'isActive'],
                        model: 'User',
                        strictPopulate: false,
                    })
                    .populate({
                        path: 'assistantTypeStatusTracker.checkedBy',
                        select: ['email', 'firstName', 'lastName', 'status'],
                        model: 'Agent',
                        strictPopulate: false,
                    })
                    .populate('lastModificationBy', ['email', 'firstName', 'lastName', 'status'], 'Agent')
                    .sort({ assistanceDate: 1 });
            } else {
                dbResult = await EmployeeAssistanceSchema.find(newFilters).sort({ assistanceDate: 1 });
            }
            if (!dbResult) {
                return {
                    code: 'notDataFound',
                    detail: 'Data not found',
                };
            }
            return {
                code: 'success',
                detail: dbResult.length ? dbResult.map((result) => this.formatReturningData(result)) : [],
            };
        } catch (ex) {
            throw ex;
        }
    }

    private async insert(payload: EmployeeAssistanceModelInterface): Promise<any> {
        try {
            this.dbDocument = new EmployeeAssistanceSchema({
                ...payload,
            });
            const result = await this.dbDocument.save({ validateBeforeSave: true });
            return {
                actionPerformed: 'dataCreation',
                result: result._id,
            };
        } catch (ex) {
            throw new DataBaseErrorHandling(ex, EmployeeAssistanceSchema.name, DataBaseActions.insert);
        }
    }

    private async update(
        payload: EmployeeAssistanceDocumentInterface,
        newObject: EmployeeAssistanceModelInterface
    ): Promise<any> {
        try {
            payload.assistanceType = newObject.assistanceType;
            payload.adminChecker = newObject.adminChecker;
            payload.checkedBy = newObject.checkedBy;
            payload.comments = newObject.comments;
            payload.assistantTypeStatusTracker = newObject.assistantTypeStatusTracker;
            payload.uploadedFile = newObject.uploadedFile;
            payload.lastModificationTimestamp = Date.now();
            payload.markModified(EmployeeAssistanceSchema.modelName);
            const result = await payload.save();
            return {
                actionPerformed: 'dataModification',
                result: result._id,
            };
        } catch (ex) {
            throw new DataBaseErrorHandling(ex, EmployeeAssistanceSchema.name, DataBaseActions.update);
        }
    }

    private formatReturningData(data: EmployeeAssistanceDocumentInterface): EmployeeAssistanceModelInterface {
        return {
            _id: data._id,
            assistanceDate: data.assistanceDate,
            assistanceType: data.assistanceType,
            employee: data.employee,
            adminChecker: data.adminChecker,
            checkedBy: data.checkedBy,
            comments: data.comments,
            assistantTypeStatusTracker: data.assistantTypeStatusTracker,
            uploadedFile: data.uploadedFile,
            creationTimestamp: data.creationTimestamp,
            lastModificationBy: data.lastModificationBy,
            lastModificationTimestamp: data.lastModificationTimestamp,
        } as EmployeeAssistanceModelInterface;
    }
}
