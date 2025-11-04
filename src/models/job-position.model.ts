import * as mongoose from 'mongoose';
import { Schema, Document, Model, Types } from 'mongoose';
import { JobPositionModelInterface } from '../interfaces/models';

export interface JobPositionDocumentInterface extends JobPositionModelInterface, Document {
    _id: string;
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

const schema = new Schema({
    referenceCode: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    jobRequirements: {
        type: [],
        required: true,
    },
    language: {
        type: String,
        ref: 'AllowedPlatformLanguage',
        required: true,
    },
    minimunAge: {
        type: Number,
        required: true,
        default: 0,
    },

    isActive: {
        type: Boolean,
        required: false,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
    },
    creationTimestamp: {
        type: Number,
        required: true,
        default: Date.now(),
    },
    lastModificationBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: false,
    },
    lastModificationTimestamp: {
        type: Number,
        required: false,
    },
});
schema.set('autoIndex', false);

export const JobPositionSchema: Model<JobPositionDocumentInterface> = mongoose.model<JobPositionDocumentInterface>(
    'JobPosition',
    schema
);

export default JobPositionSchema;
