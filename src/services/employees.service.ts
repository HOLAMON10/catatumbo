import { injectable } from 'inversify';
import { EmployeeSchema } from '../models/employee.model';
import { EmployeeModelInterface } from '../interfaces/models/employee.model.interface';

@injectable()
export class EmployeesService {
  async createRecord(payload: EmployeeModelInterface): Promise<any> {
    try {
      const existing = await EmployeeSchema.findOne({ email: payload.email });

      if (existing) {
        return { code: 'error', detail: 'Employee already exists' };
      }

      const now = Date.now();

      const doc = new EmployeeSchema({
        ...payload,
        status: payload.status ?? 'active',
        isActive:
          payload.isActive == null ? true : payload.isActive,
        creationTimestamp: now,
        lastModificationTimestamp: now,
      });

      const saved = await doc.save();
      return { code: 'success', detail: saved };
    } catch (err) {
      return { code: 'error', detail: err };
    }
  }

  async modifyRecord(
    id: string,
    payload: Partial<EmployeeModelInterface>,
  ): Promise<any> {
    try {
      const now = Date.now();

      const updateSet: any = {
        ...payload,
        lastModificationTimestamp: now,
      };

      const update = {
        $set: updateSet,
        $push: {
          modificationHistory: {
            modifiedAt: now,
            changes: payload,
          },
        },
      };

      const updated = await EmployeeSchema.findByIdAndUpdate(
        id,
        update,
        { new: true },
      );

      if (!updated) {
        return { code: 'error', detail: 'Employee not found' };
      }

      return { code: 'success', detail: updated };
    } catch (err) {
      return { code: 'error', detail: err };
    }
  }

  async getAll(filters: any = {}): Promise<any> {
    try {
      const conditions: any = {};

      if (filters.area) {
        conditions.area = filters.area;
      }
      if (filters.status) {
        conditions.status = filters.status;
      }

      const data = await EmployeeSchema.find(conditions);
      return { code: 'success', detail: data };
    } catch (err) {
      return { code: 'error', detail: err };
    }
  }

  async getByID(id: string): Promise<any> {
    try {
      const record = await EmployeeSchema.findById(id);

      if (!record) {
        return { code: 'error', detail: 'Employee not found' };
      }

      return { code: 'success', detail: record };
    } catch (err) {
      return { code: 'error', detail: err };
    }
  }

  async search(filters: any = {}): Promise<any> {
    try {
      const data = await EmployeeSchema.find(filters);
      return { code: 'success', detail: data };
    } catch (err) {
      return { code: 'error', detail: err };
    }
  }

  async exportCSV(filters: any = {}): Promise<any> {
    const res = await this.search(filters);

    if (res.code !== 'success') {
      return res;
    }

    const docs = res.detail as any[];
    if (!docs || docs.length === 0) {
      return { code: 'success', detail: '' };
    }

    const plain = docs.map((doc) => (doc.toObject ? doc.toObject() : doc));
    const headers = Object.keys(plain[0]);

    const rows = plain.map((item) =>
      headers
        .map((h) => {
          const val = (item as any)[h];
          return `"${val ?? ''}"`;
        })
        .join(','),
    );

    const csv = `${headers.join(',')}
${rows.join('\n')}`;
    return { code: 'success', detail: csv };
  }

  async exportPDF(filters: any = {}): Promise<any> {
    const res = await this.search(filters);
    if (res.code !== 'success') {
      return res;
    }

    const docs = res.detail as any[];

    const lines = docs.map((doc) => {
      const obj = doc.toObject ? doc.toObject() : doc;
      return `${obj.firstName ?? ''} ${obj.lastName ?? ''} | ${
        obj.email ?? ''
      } | ${obj.status ?? ''}`;
    });

    const text = lines.join('\n');
    return { code: 'success', detail: text };
  }

  async getHistory(id: string): Promise<any> {
    try {
      const record = await EmployeeSchema.findById(
        id,
        'modificationHistory',
      );

      if (!record) {
        return { code: 'error', detail: 'Employee not found' };
      }

      return {
        code: 'success',
        detail: (record as any).modificationHistory || [],
      };
    } catch (err) {
      return { code: 'error', detail: err };
    }
  }

  async deactivate(id: string): Promise<any> {
    try {
      const now = Date.now();

      const update = {
        $set: {
          isActive: false,
          status: 'inactive',
          lastModificationTimestamp: now,
        },
        $push: {
          modificationHistory: {
            modifiedAt: now,
            changes: { isActive: false, status: 'inactive' },
          },
        },
      };

      const updated = await EmployeeSchema.findByIdAndUpdate(
        id,
        update,
        { new: true },
      );

      if (!updated) {
        return { code: 'error', detail: 'Employee not found' };
      }

      return { code: 'success', detail: updated };
    } catch (err) {
      return { code: 'error', detail: err };
    }
  }
}
