import { EmailResponseInterface } from "./email-response.interface";
import { HiringProcessInterviewEvaluation } from "./hiring-process-interview-evaluation.interface";
import { TrainingInfoDetail } from "./training-info-detail.interface";
import { ZoomInterviewDetail } from "./zoom-interview-detail.interface";

export interface HiringProcessDetail {
  id: string;
  relatedStatus: any;
  creationComments?: string;
  interviewDate?: string;
  interviewHour?: string;
  interviewStatus?: any;
  interviewEvaluationResults?: HiringProcessInterviewEvaluation;
  previousInterviewsDates?: {
    date: string,
    hour: string,
    comments?: string,
    createdBy: any,
    creationTimestamp: number
  }[],
  comments?: { recruiter: any, comments: string, date: number }[]
  recruiter?: any;
  recruiterNotes?: string;
  emailSendingDetail?: EmailResponseInterface;
  zoomInterviewDetail?: ZoomInterviewDetail;
  trainingInfoDetail?: TrainingInfoDetail,
  createdBy: any;
  creationTimestamp: number;
  lastModificationBy?: any;
  lastModificationTimestamp?: number;
}
