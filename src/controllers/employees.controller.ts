import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  request,
  response,
  requestParam,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import { ApiTypes } from '../apiTypes';
import { ConstantValues } from '../constantValues';

@controller(ConstantValues.employees)
export class EmployeesController {
  constructor(
    @inject(ApiTypes.employeesService)
    private readonly employeesService: any,
  ) {}

  @httpGet('/')
  public async getAll(@request() req: Request, @response() res: Response) {
    const result = await this.employeesService.getAll(req.query);

    if (result.code === 'success') {
      return res.status(200).json(result.detail);
    }

    return res.status(400).json(result.detail ?? result);
  }

  @httpGet('/:id')
  public async getById(
    @requestParam('id') id: string,
    @response() res: Response,
  ) {
    const result = await this.employeesService.getByID(id);

    if (result.code === 'success') {
      return res.status(200).json(result.detail);
    }

    return res.status(404).json(result.detail ?? result);
  }

  @httpPost('/')
  public async create(@request() req: Request, @response() res: Response) {
    const result = await this.employeesService.createRecord(req.body);

    if (result.code === 'success') {
      return res.status(201).json(result.detail);
    }

    return res.status(400).json(result.detail ?? result);
  }

  @httpPut('/:id')
  public async update(
    @requestParam('id') id: string,
    @request() req: Request,
    @response() res: Response,
  ) {
    const result = await this.employeesService.modifyRecord(id, req.body);

    if (result.code === 'success') {
      return res.status(200).json(result.detail);
    }

    return res.status(400).json(result.detail ?? result);
  }

  @httpGet('/export/csv')
  public async exportCsv(@request() req: Request, @response() res: Response) {
    const result = await this.employeesService.exportCSV(req.query);

    if (result.code === 'success') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="employees.csv"',
      );
      return res.status(200).send(result.detail ?? '');
    }

    return res.status(400).json(result.detail ?? result);
  }

  @httpGet('/export/pdf')
  public async exportPdf(@request() req: Request, @response() res: Response) {
    const result = await this.employeesService.exportPDF(req.query);

    if (result.code === 'success') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="employees.pdf"',
      );
      return res.status(200).send(result.detail ?? '');
    }

    return res.status(400).json(result.detail ?? result);
  }

  @httpGet('/:id/history')
  public async history(
    @requestParam('id') id: string,
    @response() res: Response,
  ) {
    const result = await this.employeesService.getHistory(id);

    if (result.code === 'success') {
      return res.status(200).json(result.detail);
    }

    return res.status(400).json(result.detail ?? result);
  }

  @httpPut('/:id/deactivate')
  public async deactivate(
    @requestParam('id') id: string,
    @response() res: Response,
  ) {
    const result = await this.employeesService.deactivate(id);

    if (result.code === 'success') {
      return res.status(200).json(result.detail);
    }

    return res.status(400).json(result.detail ?? result);
  }
}
