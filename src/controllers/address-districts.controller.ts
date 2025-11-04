import Validator from 'params-verifier';
import { controller, httpGet, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import { AddressDistrictModelInterface } from '../interfaces/models';
import { ApiTypes } from '../apiTypes';
import { ConstantValues } from '../constantValues';
import { AddressDistrictsService } from '../services';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { handleErrorResponse, ValidationError } from '../error-handlers';

@controller(ConstantValues.addressdistricts)
export class AddressDistrictsController implements interfaces.Controller {
  private dataSrv: AddressDistrictsService;

  public constructor(
    @inject(ApiTypes.addressDistrictsService) dataSrv: AddressDistrictsService
  ) {
    this.dataSrv = dataSrv;
  }

  @httpPost('/')
  public async CreateRecord(req: Request, res: Response): Promise<void> {
    try {
      let serviceResult: ServiceResultInterface =
        await this.dataSrv.CreateRecord(
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
      let serviceResult: ServiceResultInterface =
        await this.dataSrv.ModifyRecord(
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
        req.body.fieldsToRetreive
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
  ): AddressDistrictModelInterface {
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
          .field('lastModificationBy', 'string', {
            required: true,
            validatorErrMsg: 'lastModificationBy is required',
            typeErrMsg: 'wrong value type on field lastModificationBy',
          });
      }

      paramValidator
        .field('_id', 'string', {
          required: true,
          validatorErrMsg: '_id is required',
          typeErrMsg: 'wrong value type on field _id',
        })
        .field('county', 'string', {
          required: true,
          validatorErrMsg: 'county is required',
          typeErrMsg: 'wrong value type on field county',
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

      // validate score
      if (!/^[0-9]+(\.[0-9]+)?$/.test(workingObj.score)) {
        throw 'the score is not a valid number'
      }


      return {
        _id: workingObj._id,
        county: workingObj.county,
        name: workingObj.name,
        score: Number.parseFloat(workingObj.score),
        isActive: workingObj.isActive,
        createdBy: workingObj.createdBy,
        lastModificationBy: workingObj.lastModificationBy,
      };
    } catch (ex) {
      throw new ValidationError(ex.message ? ex.message : ex);
    }
  }
}
