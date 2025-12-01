export interface CandidateModelInterface {
  _id?: string;
  imageUrl?: string;
  idNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  cellPhoneNumber: string;
  dateOfBirth: Date;
  addressProvince: string;
  addressCounty: string;
  addressDistrict: string;
  createdBy?: any;
  createdDate?: number;
  lastModificationBy?: string;
  lastModificationDate?: number;
}
