export interface HiringProcessInterviewEvaluation {
  id: string;
  qualificationGrades: {
    grade: string;
    items: {
      name: string;
      description?: string;
      scoreObtained: number;
      evaluationComments?: string;
    }[]
  }[],
  interviewObtainedScore: number;
  evaluationNotes?: string;
  evaluatedBy: any;
  evaluationTimestamp: number;
}
