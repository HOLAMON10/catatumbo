import { controller, httpGet, httpPost, interfaces } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import { ApiTypes } from '../apiTypes';
import { ConstantValues } from '../constantValues';
import { CatalogsService } from '../services';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { handleErrorResponse, ValidationError } from '../error-handlers';

@controller(ConstantValues.catalogs)
export class CatalogsController implements interfaces.Controller {
  private dataSrv: CatalogsService;

  public constructor(
    @inject(ApiTypes.catalogsService) dataSrv: CatalogsService
  ) {
    this.dataSrv = dataSrv;
  }

  @httpGet('/')
  public async GetCatalogsByNames(req: Request, res: Response): Promise<void> {
    try {
      if(!req.query['catalogs']) {
        throw new ValidationError('query catalogs is required');
      }
      let serviceResult: ServiceResultInterface = await this.dataSrv.GetCatalogsByNames(
        (req.query['catalogs'] as string)
        .split(',')
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
  
  @httpGet('/:catalogName')
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      let serviceResult: ServiceResultInterface = await this.dataSrv.GetAll(req.params.catalogName);
      if (serviceResult.code === 'error') {
        res.status(500).send(serviceResult);
        return;
      }
      res.send(serviceResult);
    } catch (ex) {
      handleErrorResponse(ex, res);
    }
  }

  @httpGet('/:catalogName/:id')
  public async getByID(req: Request, res: Response): Promise<void> {
    try {
      let serviceResult: ServiceResultInterface = await this.dataSrv.GetByID(
        req.params.catalogName,
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

  @httpPost('/:catalogName/search')
  public async Search(req: Request, res: Response): Promise<void> {
    try {
      let serviceResult: ServiceResultInterface = await this.dataSrv.Search(
        req.params.catalogName,
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
}
