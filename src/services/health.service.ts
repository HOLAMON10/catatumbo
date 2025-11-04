import { injectable } from 'inversify';

import { HealthServiceInterface } from '../interfaces/services/';
import { ServiceResultInterface } from '../interfaces/service-result.interface';

@injectable()
export class HealthService implements HealthServiceInterface {
  public GetHealth = this.getHealth;

  private getHealth(): ServiceResultInterface {
    return {
      code: 'success',
      detail: 'admin-plt-db-conn is alive',
    };
  }
}
