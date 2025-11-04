export interface AddressDistrictModelInterface {
  _id: string;
  county: any;
  name: string;
  score: number;
  isActive: boolean;
  createdBy?: any;
  createdTimestamp?: number;
  lastModificationBy?: any;
  lastModificationTimestamp?: number;
}
