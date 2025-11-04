import Validator from 'params-verifier';
import { controller, interfaces, httpPost, httpPut } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { EmployeeAssistanceModelInterface } from '../interfaces/models';
import { EmployeeAssistancesService } from '../services';
import { ApiTypes } from '../apiTypes';
import { ConstantValues } from '../constantValues';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { handleErrorResponse, ValidationError } from '../error-handlers';

@controller(ConstantValues.employeeassistances)
export class EmployeeAssistancesController implements interfaces.Controller {
    private dataSrv: EmployeeAssistancesService;

    public constructor(
        @inject(ApiTypes.employeeAssistancesService)
        dataSrv: EmployeeAssistancesService
    ) {
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
                return;
            } else {
                res.status(200).send(serviceResult);
            }
        } catch (ex) {
            handleErrorResponse(ex, res);
        }
    }

    @httpPost('/search')
    public async Search(req: Request, res: Response): Promise<void> {
        try {
            let serviceResult: ServiceResultInterface = await this.dataSrv.Search(
                req.body.workingObject,
                req.body.populateAll,
                req.body.fieldsToRetreive
            );
            if (!serviceResult) {
                res.status(400).send({
                    code: 'requestNotProcessed',
                    detail: 'Any data was retrieved',
                });
                return;
            }
            res.status(200).json(serviceResult);
        } catch (ex) {
            handleErrorResponse(ex, res);
        }
    }

    private validatepayload(payload: any, updatingRecord: boolean): EmployeeAssistanceModelInterface {
        try {
            if (!payload) {
                throw 'body is required';
            }
            const paramValidator = new Validator(payload, 'object', {
                required: true,
                stringNoEmpty: true,
            });

            if (updatingRecord) {
                paramValidator.field('_id', 'string', {
                    required: false,
                    validatorErrMsg: '_id is required',
                    typeErrMsg: 'wrong value type on field _id',
                });
                if (payload._id && !ObjectId.isValid(payload._id)) {
                    throw 'field _id is not a valid  ObjecId';
                }
                if (payload.assistantTypeStatusTracker) {
                    if (Array.isArray(payload.assistantTypeStatusTracker)) {
                        (payload.assistantTypeStatusTracker as any[]).forEach((t) => {
                            this.validateAssistantTypeStatusTracker(t);
                        });
                    }
                }
            }

            paramValidator
                .field('assistanceDate', 'string', {
                    required: true,
                    validatorErrMsg: 'assistanceDate is required',
                    typeErrMsg: 'wrong value type on field assistanceDate',
                })
                .field('assistanceType', 'string', {
                    required: true,
                    validatorErrMsg: 'assistanceType is required',
                    typeErrMsg: 'wrong value type on field assistanceType',
                })
                .field('employee', 'string', {
                    required: true,
                    validatorErrMsg: 'employee is required',
                    typeErrMsg: 'wrong value type on field employee',
                });

            if (payload.adminChecker && !ObjectId.isValid(payload.adminChecker)) {
                throw 'adminChecker is not valid ObjectId';
            }
            if (payload.checkedBy && !ObjectId.isValid(payload.checkedBy)) {
                throw 'checkedBy is not valid ObjectId';
            }
            if (payload.comments && typeof payload.comments !== 'string') {
                throw 'comments is not a valid string';
            }

            if (payload.uploadedFile) {
                if (!payload.uploadedFile['documentUrl'] || typeof payload.uploadedFile['documentUrl'] !== 'string') {
                    throw 'uploadedFile.documentUrl is not valid';
                }
                if (payload.uploadedFile['emissionDate'] && typeof payload.uploadedFile['emissionDate'] !== 'string') {
                    throw 'uploadedFile.emissionDate is not valid';
                }
            }

            return {
                _id: payload._id,
                assistanceDate: payload.assistanceDate,
                assistanceType: payload.assistanceType,
                employee: payload.employee,
                adminChecker: payload.adminChecker,
                checkedBy: payload.checkedBy,
                assistantTypeStatusTracker: payload.assistantTypeStatusTracker,
                uploadedFile: payload.uploadedFile,
                comments: payload.comments,
            };
        } catch (ex) {
            throw new ValidationError(ex.message ? ex.message : ex);
        }
    }

    private validateAssistantTypeStatusTracker(payload: any): any {
        try {
            const paramValidator = new Validator(payload, 'object', {
                required: true,
                stringNoEmpty: true,
            });
            paramValidator
                .field('previousType', 'string', {
                    required: true,
                    validatorErrMsg: 'previousType is required',
                    typeErrMsg: 'wrong value type on field previousType',
                })
                .field('settedAt', 'number', {
                    required: true,
                    validatorErrMsg: 'settedAt is required',
                    typeErrMsg: 'wrong value type on field settedAt',
                });
            if (payload.adminChecker && !ObjectId.isValid(payload.adminChecker)) {
                throw 'adminChecker is not valid ObjectId';
            }
            if (payload.checkedBy && !ObjectId.isValid(payload.checkedBy)) {
                throw 'checkedBy is not valid ObjectId';
            }
            if (payload.comments && typeof payload.comments !== 'string') {
                throw 'comments is not a valid string';
            }
            return {
                previousType: payload.previousType,
                comments: payload.comments,
                adminChecker: payload.adminChecker,
                checkedBy: payload.checkedBy,
                settedAt: payload.settedAt,
            };
        } catch (ex) {
            throw new ValidationError(ex.message ? ex.message : ex);
        }
    }
}
