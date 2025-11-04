import { AgentChangingStatusDetailInterface } from './agent-changing-status-detail.interface';
import { EmailResponseInterface } from './email-response.interface';

export interface AgentModelInterface {
  _id?: string;
  candidateId?: any;
  team?: any;
  imageUrl?: string;
  idNumber: string;
  email?: string;
  personalEmail: string;
  firstName: string;
  lastName: string;
  secondLastName?: string;
  alias?: string;
  extensionNumber: number;
  cellPhoneNumber?: string;
  dateOfBirth?: Date;
  dashboardUrl?: string;
  monthlySalary?: number;
  applySocialSecurityPercentage?: boolean;
  addressProvince?: string;
  addressCounty?: string;
  addressDistrict?: string;
  userName?: string;
  department?: any;
  // departmentCategory?: any;
  employeeType?: any;
  startingDate: string;
  udcPK?: string;
  careerDetail?: {
    generalComments?: {
      id: string;
      managementCommenter?: any;
      agentCommenter?: any;
      comments: string;
      commentedAt: number;
    }[];
  };
  status?: any;
  changingStatusDetail?: AgentChangingStatusDetailInterface[];
  isConfirmed?: boolean;
  verificationToken?: string;
  password?: string;
  emailSendingDetail?: EmailResponseInterface;
  createdTimestamp: number;
  createdBy?: any;
  lastModificationBy?: any;
  lastModificationTimestamp?: number;
}