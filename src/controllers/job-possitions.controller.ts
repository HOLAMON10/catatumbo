import Validator from 'params-verifier';
import { controller, interfaces, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import { ApiTypes } from '../apiTypes';
import { ConstantValues } from '../constantValues';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { JobPositionModelInterface, MeetingRoomModelInterface } from '../interfaces/models';
import { JobPositionsService, MeetingRoomsService } from '../services';
import { handleErrorResponse, ValidationError } from '../error-handlers';

@controller(ConstantValues.jobpositions)
export class JobPositionsController implements interfaces.Controller {
    private dataSrv: JobPositionsService;

    public constructor(@inject(ApiTypes.jobPositionsService) dataSrv: JobPositionsService) {
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

    private validatepayload(payload: any, updatingRecord: boolean): JobPositionModelInterface {
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
                paramValidator.field('lastModificationBy', 'string', {
                    required: true,
                    validatorErrMsg: 'lastModificationBy is required',
                    typeErrMsg: 'wrong value type on field lastModificationBy',
                });
            }

            paramValidator
                .field('referenceCode', 'string', {
                    required: true,
                    validatorErrMsg: 'referenceCode is required',
                    typeErrMsg: 'wrong value type on field referenceCode',
                })
                .field('name', 'string', {
                    required: true,
                    validatorErrMsg: 'name is required',
                    typeErrMsg: 'wrong value type on field name',
                })
                .field('jobDescription', 'string', {
                    required: true,
                    validatorErrMsg: 'jobDescription is required',
                    typeErrMsg: 'wrong value type on field jobDescription',
                })
                .field('language', 'string', {
                    required: true,
                    validatorErrMsg: 'language is required',
                    typeErrMsg: 'wrong value type on field language',
                })
                .field('minimunAge', 'number', {
                    required: true,
                    validatorErrMsg: 'minimunAge is required',
                    typeErrMsg: 'wrong value type on field minimunAge',
                })
                .field('isActive', 'boolean', {
                    required: true,
                    validatorErrMsg: 'isActive is required',
                });

            if (!payload.jobRequirements || !Array.isArray(payload.jobRequirements)) {
                throw 'jobRequirements is not a valid array';
            }
            (payload.jobRequirements as any[]).forEach((jobRequirement: any, index: number) => {
                if (!jobRequirement || typeof jobRequirement !== 'string') {
                    throw `jobRequirement in index ${index} is not a valid string`;
                }
            });

            return {
                _id: payload._id,
                referenceCode: payload.referenceCode,
                name: payload.name,
                jobDescription: payload.jobDescription,
                jobRequirements: payload.jobRequirements,
                language: payload.language,
                minimunAge: payload.minimunAge,
                isActive: payload.isActive,
                createdBy: payload.createdBy,
                creationTimestamp: payload.creationTimestamp,
                lastModificationBy: payload.lastModificationBy,
            };
        } catch (ex) {
            throw new ValidationError(ex.message ? ex.message : ex);
        }
    }
}
