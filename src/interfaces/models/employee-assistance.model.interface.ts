export interface EmployeeAssistanceModelInterface {
  _id?: string;
  assistanceDate: string;
  assistanceType: any;
  employee: any;
  adminChecker?: any;
  checkedBy?: any;
  comments?: string;
  assistantTypeStatusTracker?: {
    previousType: any;
    uploadedFile?: {
      documentUrl: string;
      emissionDate?: string;
    };
    comments?: string;
    adminChecker?: any;
    checkedBy?: any;
    settedAt: number;
  } [];
  uploadedFile?: {
    documentUrl: string;
    emissionDate?: string;
  };
  creationTimestamp?: number;
  lastModificationBy?: any;
  lastModificationTimestamp?: number;
}
