import * as Validator from 'params-verifier';
import { controller, interfaces, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { CandidateModelInterface } from '../interfaces/models';
import { CandidatesService } from '../services';
import { ApiTypes } from '../apiTypes';
import { ConstantValues } from '../constantValues';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { handleErrorResponse, ValidationError } from '../error-handlers';

@controller(ConstantValues.candidates)
export class CandidatesController implements interfaces.Controller {
    private dataSrv: CandidatesService;

    public constructor(
        @inject(ApiTypes.candidatesService)
        dataSrv: CandidatesService
    ) {
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
                req.body.workingObject,
                req.body.populateAll,
                req.body.filterCandidatesSection
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

    @httpPost('/searchcandidateinfo')
    public async SearchCandidateIndo(req: Request, res: Response): Promise<void> {
        try {
            let serviceResult: ServiceResultInterface = await this.dataSrv.SearchCandidateInfo(
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

    private validateWorkingObject(workingObj: any, updatingRecord: boolean): CandidateModelInterface {
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
                if (workingObj.lastModificationBy) {
                    if (typeof workingObj.lastModificationBy !== 'string') {
                        throw new ValidationError('the type of lastModificationBy is not a valid string');
                    }
                }
                if (!ObjectId.isValid(workingObj._id)) {
                    throw 'field _id is not a valid  ObjecId';
                }
                if (workingObj.imageUrl && typeof workingObj.imageUrl !== 'string') {
                    throw 'the type of imageUrl is not string';
                }
            } else {
                paramValidator
                    .field('idNumber', 'string', {
                        required: true,
                        validatorErrMsg: 'idNumber is required',
                        typeErrMsg: 'wrong value type on field idNumber',
                    })
                    .field('firstName', 'string', {
                        required: true,
                        validatorErrMsg: 'firstName is required',
                        typeErrMsg: 'wrong value type on field firstName',
                    })
                    .field('lastName', 'string', {
                        required: true,
                        validatorErrMsg: 'lastName is required',
                        typeErrMsg: 'wrong value type on field lastName',
                    })
                    .field('email', 'string', {
                        required: true,
                        validatorErrMsg: 'email is required',
                        typeErrMsg: 'wrong value type on field email',
                    })
                    .field('addressProvince', 'string', {
                        required: true,
                        validatorErrMsg: 'addressProvince is required',
                        typeErrMsg: 'wrong value type on field addressProvince',
                    })
                    .field('addressCounty', 'string', {
                        required: true,
                        validatorErrMsg: 'addressCounty is required',
                        typeErrMsg: 'wrong value type on field addressCounty',
                    })
                    .field('addressDistrict', 'string', {
                        required: true,
                        validatorErrMsg: 'addressDistrict is required',
                        typeErrMsg: 'wrong value type on field addressDistrict',
                    })
                    .field('dateOfBirth', 'date', {
                        required: true,
                        validatorErrMsg: 'dateOfBirth is required',
                        typeErrMsg: 'wrong value type on field dateOfBirth',
                    })
                    .field('createdBy', 'string', {
                        required: true,
                        validatorErrMsg: 'createdBy is required',
                        typeErrMsg: 'wrong value type on field createdBy',
                    });

                if (!workingObj.cellPhoneNumber && workingObj.typeof !== 'number') {
                    throw 'cellPhoneNumber is not valid';
                }
            }

            return {
                _id: workingObj._id,
                idNumber: workingObj.idNumber,
                imageUrl: workingObj.imageUrl,
                firstName: workingObj.firstName,
                lastName: workingObj.lastName,
                cellPhoneNumber: workingObj.cellPhoneNumber,
                email: workingObj.email,
                addressCounty: workingObj.addressCounty,
                addressProvince: workingObj.addressProvince,
                addressDistrict: workingObj.addressDistrict,
                dateOfBirth: workingObj.dateOfBirth,
                createdBy: workingObj.createdBy,
                createdDate: 0,
                lastModificationBy: workingObj.lastModidicationBy,
                lastModificationDate: workingObj.lastModificationDate,
            };
        } catch (ex) {
            throw new ValidationError(ex.message ? ex.message : ex);
        }
    }
}
