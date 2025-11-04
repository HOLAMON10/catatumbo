import { ServiceResultInterface } from '../service-result.interface';

export interface CatalogsServiceInterface {
  GetAll(catalogName: string): Promise<ServiceResultInterface>;
  GetByID(catalogName: string, _id: string): Promise<ServiceResultInterface>;
  GetCatalogsByNames(catalogNames: string[]): Promise<ServiceResultInterface>;
  Search(catalogName: string, filters: any, fieldsToRetreive: string[]): Promise<ServiceResultInterface>;
}
