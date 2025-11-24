import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import { ApiTypes } from '../apiTypes';
import { ConstantValues } from '../constantValues';
import { EmailService } from '../services';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { handleErrorResponse } from '../error-handlers';

@controller(ConstantValues.addressprovinces)
export class EmailSenderController implements interfaces.Controller {
  private dataSrv: EmailService;

  public constructor(
    @inject(ApiTypes.addressProvincesService) dataSrv: EmailService
  ) {
    this.dataSrv = dataSrv;
  }

  @httpPost('/')
  public async CreateRecord(req: Request, res: Response): Promise<void> {
    try {
      let serviceResult: ServiceResultInterface =
        await this.dataSrv.Send(
         req.body,
         req.body,
         req.body,
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
}
