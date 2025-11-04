import * as mongoose from 'mongoose';
import { Schema, Document, Model } from 'mongoose';
import { EmployeeAssistanceModelInterface } from '../interfaces/models';

import { ObjectId } from 'mongodb';

export interface EmployeeAssistanceDocumentInterface
  extends EmployeeAssistanceModelInterface,
    Document {
  _id: string;
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

const schema = new Schema({
  assistanceDate: {
    type: String,
    required: true,
  },
  assistanceType: {
    type: String,
    ref: 'EmployeeAssistanceType',
    required: true,
  },
  employee: {
    type: ObjectId,
    ref: 'Agent',
    required: true,
  },
  adminChecker: {
    type: ObjectId,
    ref: 'User',
    required: false,
  },
  checkedBy: {
    type: ObjectId,
    ref: 'Agent',
    required: false,
  },
  comments: {
    type: String,
    required: false,
  },
  assistantTypeStatusTracker: {
    type:[{
      _id: false,
      previousType: {
        type: String,
        ref: 'EmployeeAssistanceType',
        required: true
      },
      uploadedFile: {
        type: {
          _id: false,
          documentUrl: {
            type: String,
            required: true
          },
          emissionDate: {
            type: String,
            required: false
          }
        },
        required: false
      },
      comments:  {
        type: String,
        required: false
      },
      adminChecker: {
        type: ObjectId,
        ref: 'User',
        required: false,
      },
      checkedBy:  {
        type: ObjectId,
        ref: 'Agent',
        required: false,
      },
      settedAt: {
        type: Number,
        required: true,
      }
    }],
    required: false
  },
  uploadedFile: {
    type: {
      _id: false,
      documentUrl: {
        type: String,
        required: true
      },
      emissionDate: {
        type: String,
        required: false
      }
    },
    required: false
  },
  creationTimestamp: {
    type: Number,
    required: true,
    default: Date.now(),
  },
  lastModificationBy: {
    type: ObjectId,
    ref: 'Agent',
    required: false,
  },
  lastModificationTimestamp: {
    required: false,
    type: Number,
  },
});
schema.set('autoIndex', false);

export const EmployeeAssistanceSchema: Model<EmployeeAssistanceDocumentInterface> =
  mongoose.model<EmployeeAssistanceDocumentInterface>(
    'EmployeeAssistance',
    schema
  );

export default EmployeeAssistanceSchema;
