import { EmployeeModelInterface } from '../models/employee.model.interface';

export interface EmployeesServiceInterface {
  createRecord(payload: EmployeeModelInterface): Promise<any>;
  modifyRecord(
    id: string,
    payload: Partial<EmployeeModelInterface>,
  ): Promise<any>;

  getAll(filters?: any): Promise<any>;
  getByID(id: string): Promise<any>;
  search(filters?: any): Promise<any>;

  exportCSV(filters?: any): Promise<any>;
  exportPDF(filters?: any): Promise<any>;

  getHistory(id: string): Promise<any>;
  deactivate(id: string): Promise<any>;
}
