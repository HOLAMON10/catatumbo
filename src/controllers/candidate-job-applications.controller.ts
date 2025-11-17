import * as Validator from 'params-verifier';
import { controller, interfaces, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { CandidateJobApplicationModelInterface } from '../interfaces/models';
import { CandidateJobApplicationsService } from '../services';
import { ApiTypes } from '../apiTypes';
import { ConstantValues } from '../constantValues';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { handleErrorResponse, ValidationError } from '../error-handlers';

@controller(ConstantValues.candidatejobapplications)
export class CandidateJobApplicationsController implements interfaces.Controller {
    private dataSrv: CandidateJobApplicationsService;

    public constructor(
        @inject(ApiTypes.candidateJobApplicationsService)
        dataSrv: CandidateJobApplicationsService
    ) {
        this.dataSrv = dataSrv;
    }

    @httpPost('/')
    public async Create(req: Request, res: Response): Promise<void> {
        try {
            let serviceResult: ServiceResultInterface = await this.dataSrv.CreateRecord(
                this.validateWorkingObject(req.body, false)
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
    public async GetAll(req: Request, res: Response): Promise<void> {
        try {
            let serviceResult: ServiceResultInterface = await this.dataSrv.GetAll();
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

    @httpPost('/search')
    public async Search(req: Request, res: Response): Promise<void> {
        try {
            let serviceResult: ServiceResultInterface = await this.dataSrv.Search(
                req.body.workingObject,
                req.body.populateAll
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

    private validateWorkingObject(workingObj: any, updatingRecord: boolean): CandidateJobApplicationModelInterface {
        try {
            if (!workingObj) {
                throw 'body is required';
            }
            const paramValidator = new Validator(workingObj, 'object', {
                required: true,
                stringNoEmpty: true,
            });

            if (updatingRecord) {
                paramValidator.field('_id', 'string', {
                    required: true,
                    validatorErrMsg: '_id is required',
                    typeErrMsg: 'wrong value type on field _id',
                });
                if (!ObjectId.isValid(workingObj._id)) {
                    throw 'field _id is not a valid  ObjecId';
                }
                // validating recruiter comments
                if (!workingObj.recruiterComments) {
                    if (!Array.isArray(workingObj.recruiterComments)) {
                        throw 'recruitersComments is not an array';
                    }
                }
                (workingObj.recruiterComments as any[]).forEach((c) => {
                    this.validateRecruitmentComments(c);
                });
            } else {
                paramValidator.field('candidate', 'string', {
                    required: true,
                    validatorErrMsg: 'candidate is required',
                    typeErrMsg: 'wrong value type on field candidate',
                });
                if (!ObjectId.isValid(workingObj.candidate)) {
                    throw 'field candidate is not a valid  ObjecId';
                }
            }
            paramValidator.field('status', 'string', {
                required: true,
                validatorErrMsg: 'status is required',
                typeErrMsg: 'wrong value type on field status',
            });

            if (workingObj.notCompletationNotification) {
                this.validateNotCompletedNotification(workingObj.notCompletionNotification);
            }
            return {
                _id: workingObj._id,
                jobPosition: workingObj?.jobPosition || null,
                candidate: workingObj.candidate,
                applicationDate: new Date(),
                hiringProcessDetails: workingObj.hiringProcessDetails,
                endingApplicationToken: workingObj.endingApplicationToken,
                language: workingObj?.language,
                notCompletionNotification: workingObj.notCompletionNotification,
                status: workingObj.status,
            };
        } catch (ex) {
            throw new ValidationError(ex ? ex : ex);
        }
    }

    private validateRecruitmentComments(payload: any) {
        try {
            if (payload) {
                const answerValidator = new Validator(payload, 'object', {
                    required: true,
                    stringNoEmpty: true,
                });
                answerValidator
                    .field('comment', 'string', {
                        required: true,
                        validatorErrMsg: 'comment is required',
                        typeErrMsg: 'wrong value type on field comment',
                    })
                    .field('recruiter', 'string', {
                        required: true,
                        validatorErrMsg: 'recruiter is required',
                        typeErrMsg: 'wrong value type on field recruiter',
                    })
                    .field('creationTimestamp', 'number', {
                        required: true,
                        validatorErrMsg: 'creationTimestamp is required',
                        typeErrMsg: 'wrong value type on field creationTimestamp',
                    });
            }
        } catch (ex) {
            throw ex;
        }
    }

    private validateNotCompletedNotification(payload: any) {
        try {
            if (payload) {
                if (payload.whatsappSendingTimestamp !== null || payload.whatsappSendingTimestamp !== undefined) {
                    if (typeof payload.whatsapp !== 'number') {
                        throw 'notCompletionNotification.whatsappSendingTimestamp is not a boolean value';
                    }
                }
                if (payload.email) {
                    const answerValidator = new Validator(payload, 'object', {
                        required: true,
                        stringNoEmpty: true,
                    });
                    answerValidator
                        .field('sent', 'boolean', {
                            required: true,
                            validatorErrMsg: 'notCompletionNotification.sent is required',
                            typeErrMsg: 'wrong value type on field notCompletionNotification.sent',
                        })
                        .field('errorDetail', 'string', {
                            required: true,
                            validatorErrMsg: 'notCompletionNotification.errorDetail is required',
                            typeErrMsg: 'wrong value type on field notCompletionNotification.errorDetail',
                        });
                }
            }
        } catch (ex) {
            throw ex;
        }
    }
}
