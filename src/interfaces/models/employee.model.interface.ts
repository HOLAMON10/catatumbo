export interface EmployeeModificationHistoryEntryInterface {
  modifiedBy?: any;   
  modifiedAt?: number;
  changes?: any;
}

export interface EmployeeModelInterface {
  firstName: string;
  lastName: string;
  email: string;

  area?: string;
  status?: string;    // 'active' | 'inactive'
  isActive?: boolean;

  creationTimestamp?: number;
  lastModificationTimestamp?: number;

  modificationHistory?: EmployeeModificationHistoryEntryInterface[];
}
