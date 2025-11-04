import { controller, httpGet, interfaces } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import { ApiTypes } from '../apiTypes';
import { ConstantValues } from '../constantValues';
import { HealthService } from '../services/health.service';

@controller(ConstantValues.root)
export class HealthController implements interfaces.Controller {
	private healthSrv: HealthService;

	public constructor(@inject(ApiTypes.healthService) healthSrv: HealthService) {
		this.healthSrv = healthSrv;
	}

	@httpGet('health')
	public async GetHealth(req: Request, res: Response): Promise<void> {
		res.send(this.healthSrv.GetHealth());
	}
}
