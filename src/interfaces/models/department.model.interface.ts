import { DepartmentCategoryInterface } from "./department-category.interface";

export interface DepartmentModelInterface {
  _id?: string;
  refCode: string;
  name: string;
  description?: string;
  manager?: any;
  // categories?: DepartmentCategoryInterface[];
  isActive: boolean;
  createdBy?: any;
  createdTimestamp?: number;
  lastModificationBy?: any;
  lastModificationTimestamp?: number;
}
