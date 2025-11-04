import { ServiceResultInterface } from '../service-result.interface';
import { CandidateJobApplicationModelInterface } from '../models/';

export interface CandidateJobApplicationsServiceInterface {
  CreateRecord(workingObj: CandidateJobApplicationModelInterface): Promise<ServiceResultInterface>;
  ModifyRecord(workingObj: CandidateJobApplicationModelInterface): Promise<ServiceResultInterface>;
  GetAll(): Promise<ServiceResultInterface>;
  Search(
    workingObject: any,
    populateAll: boolean
  ): Promise<ServiceResultInterface>;
}
