export interface AccessProfileModelInterface {
  _id?: string;
  referenceCode: string;
  name: string;
  description?: string;
  menuOptions: string[];
  isActive: boolean;
  createdBy?: any;
  createdDate?: Date;
  lastModificationDate?: Date;
  lastModificationUser?: any;
}
