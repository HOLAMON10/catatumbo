import { ServiceResultInterface } from '../service-result.interface';
import { CandidateModelInterface } from '../models/candidate.model.interface';

export interface CandidatesServiceInterface {
  CreateRecord(
    workingObj: CandidateModelInterface
  ): Promise<ServiceResultInterface>;
  ModifyRecord(
    workingObj: CandidateModelInterface
  ): Promise<ServiceResultInterface>;
  GetAll(): Promise<ServiceResultInterface>;
  GetById(id: string): Promise<ServiceResultInterface>;
  Search(
    workingObject: any,
    populateAll?: boolean
  ): Promise<ServiceResultInterface>;
  SearchCandidateInfo(
    params: any,
    populateAll?: boolean
  ): Promise<ServiceResultInterface>;
}
