import * as Validator from 'params-verifier';
import {
  controller,
  interfaces,
  httpGet,
  httpPost,
  httpPut,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { AccessProfileModelInterface } from '../interfaces/models';
import { AccessProfilesService } from '../services';
import { ApiTypes } from '../apiTypes';
import { ConstantValues } from '../constantValues';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { handleErrorResponse, ValidationError } from '../error-handlers';

@controller(ConstantValues.accessprofiles)
export class AccessProfilesController implements interfaces.Controller {
  private dataSrv: AccessProfilesService;

  public constructor(
    @inject(ApiTypes.accessProfilesService)
    dataSrv: AccessProfilesService
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
        req.body.fieldsToRetreive,
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

  private validateWorkingObject(
    workingObj: any,
    updatingRecord: boolean
  ): AccessProfileModelInterface {
    try {
      if (!workingObj) {
        throw 'body is required';
      }

      const paramValidator = new Validator(workingObj, 'object', {
        required: true,
        stringNoEmpty: true,
      });

      if (updatingRecord) {
         paramValidator
          .field('_id', 'string', {
            required: true,
            validatorErrMsg: '_id is required',
            typeErrMsg: 'wrong value type on field _id',
          })
          .field('lastModificationUser', 'string', {
            required: true,
            validatorErrMsg: 'lastModificationUser is required',
            typeErrMsg: 'wrong value type on field lastModificationUser',
          });
        if (!ObjectId.isValid(workingObj._id)) {
          throw 'field _id is not a valid  ObjecId';
        }
      } else {
       
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
        .field('description', 'string', {
          typeErrMsg: 'wrong value type on field description',
        })
        .field('isActive', 'boolean', {
          required: true,
          validatorErrMsg: 'isActive is required',
          typeErrMsg: 'wrong value type on field isActive',
        });
      //menuOptions
      if (!workingObj.menuOptions) {
        throw 'menuOptions is require';
      }
      if (!Array.isArray(workingObj.menuOptions)) {
        throw 'menuOptions is not an array';
      }

      return {
        _id: workingObj._id,
        referenceCode: workingObj.referenceCode,
        name: workingObj.name,
        description: workingObj.description,
        menuOptions: workingObj.menuOptions,
        isActive: workingObj.isActive,
        createdBy: workingObj.createdBy,
        lastModificationUser: workingObj.lastModificationUser,
      };
    } catch (ex) {
      throw new ValidationError(ex.message ? ex.message : ex);
    }
  }
}
