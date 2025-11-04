import { ServiceResultInterface } from '../service-result.interface';

export interface HealthServiceInterface {
	GetHealth(): ServiceResultInterface;
}
