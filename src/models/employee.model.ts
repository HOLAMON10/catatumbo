import { Schema, model } from 'mongoose';

const EmployeeSchemaDef = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },

    area: { type: String, trim: true },
    status: { type: String, default: 'active' },
    isActive: { type: Boolean, default: true },

    creationTimestamp: { type: Number, default: () => Date.now() },
    lastModificationTimestamp: { type: Number },

    modificationHistory: [
      {
        modifiedBy: { type: Schema.Types.Mixed },
        modifiedAt: { type: Number },
        changes: { type: Schema.Types.Mixed },
      },
    ],
  },
  {
    versionKey: false,
  },
);

export const EmployeeSchema = model('Employee', EmployeeSchemaDef, 'employees');
