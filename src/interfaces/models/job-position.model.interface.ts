export interface JobPositionModelInterface {
    _id?: string;
    referenceCode: string;
    name: string;
    jobDescription: string;
    jobRequirements?: string[];
    language: any;
    minimunAge: number;
    isActive: boolean;
    createdBy?: any;
    creationTimestamp: number;
    lastModificationBy?: any;
    lastModificationTimestamp?: number;
}
