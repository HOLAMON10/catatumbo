import { injectable } from 'inversify';

import { AgentSchema, EmployeeTeamDocumentInterface, EmployeeTeamSchema } from '../models';
import { EmployeeTeamModelInterface } from '../interfaces/models';
import { EmployeeTeamsServiceInterface } from '../interfaces/services';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { Model } from 'mongoose';
import {
    DataBaseActions,
    DataBaseErrorHandling,
    NotFoundDataHandling,
    RecordAlreadyCreatedHandling,
} from '../error-handlers';

@injectable()
export class EmployeeTeamsService implements EmployeeTeamsServiceInterface {
    public CreateRecord = this.createRecord;
    public ModifyRecord = this.modifyRecord;
    public GetAll = this.getAll;
    public GetByID = this.getByID;
    public Search = this.search;

    private dbDocument: EmployeeTeamDocumentInterface;

    public constructor() {}

    private async createRecord(workingObj: EmployeeTeamModelInterface): Promise<ServiceResultInterface> {
        try {
            const dbResult = await EmployeeTeamSchema.findOne({
                refCode: workingObj.refCode.trim(),
            });
            let result: any;
            if (dbResult) {
                throw new RecordAlreadyCreatedHandling(`agentTeam with refCode ${workingObj.refCode} is already created.`);
            } else {
                result = await this.insert(workingObj);
            }
            return {
                code: 'success',
                detail: result,
            };
        } catch (ex) {
            throw ex;
        }
    }

    private async modifyRecord(workingObj: EmployeeTeamModelInterface): Promise<ServiceResultInterface> {
        try {
            let dbResult = await EmployeeTeamSchema.findById(workingObj._id);
            if (!dbResult) {
                throw new NotFoundDataHandling(`agentTeam with code ${workingObj._id} was not found`);
            }
            return {
                code: 'success',
                detail: await this.update(dbResult, workingObj),
            };
        } catch (ex) {
            throw ex;
        }
    }

    private async getAll(): Promise<ServiceResultInterface> {
        try {
            let dbResult: EmployeeTeamDocumentInterface[] = await EmployeeTeamSchema.find();
            return {
                code: 'success',
                detail: dbResult,
            };
        } catch (ex) {
            throw ex;
        }
    }

    private async getByID(id: string): Promise<ServiceResultInterface> {
        try {
            let dbResult: EmployeeTeamDocumentInterface = await EmployeeTeamSchema.findById(id).populate({
                path: 'teamLeader',
                select: ['_id', 'firstName', 'lastName'],
                model: 'User',
            });
            return {
                code: 'success',
                detail: dbResult,
            };
        } catch (ex) {
            throw ex;
        }
    }

    // private async search(
    //   params: any,
    //   fieldsToRetreive: string[],
    //   populateAll?: boolean
    // ): Promise<ServiceResultInterface> {
    //   try {
    //     let dbResult: EmployeeTeamDocumentInterface[] = null;
    //     if (!populateAll) {
    //       dbResult = await EmployeeTeamSchema.find(params).select(
    //         fieldsToRetreive
    //       );
    //     } else {
    //       dbResult = await EmployeeTeamSchema.find(params)
    //         .populate({
    //           path: 'department',
    //           select: ['_id', 'refCode', 'name', 'categories'],
    //           model: 'Department',
    //         })
    //         .populate({
    //           path: 'teamLeader',
    //           select: ['_id', 'firstName', 'lastName', 'alias'],
    //           model: 'User',
    //         })
    //         .select(fieldsToRetreive);
    //     }
    //     let returnValue: any[] = [];
    //     dbResult.forEach((res) => {
    //       let deptCategoryForTeam: any;
    //       // if (res.department.categories) {
    //       // 	(res.department.categories as any[]).forEach((cat) => {
    //       // 		if (cat.id === res.departmentCategory) {
    //       // 			deptCategoryForTeam = {
    //       // 				id: cat.id,
    //       // 				name: cat.name,
    //       // 			};
    //       // 			return;
    //       // 		}
    //       // 	});
    //       // }
    //       returnValue.push({
    //         _id: res._id,
    //         refCode: res.refCode,
    //         name: res.name,
    //         department: {
    //           _id: res.department._id,
    //           refCode: res.department.refCode,
    //           name: res.department.name,
    //         },
    //         // departmentCategory: populateAll? deptCategoryForTeam : res.departmentCategory,
    //         teamLeader: res.teamLeader,
    //         description: res.description,
    //         isActive: res.isActive,
    //         createdBy: res.createdBy,
    //         createdTimestamp: res.createdTimestamp,
    //         lastModificationBy: res.lastModificationBy,
    //         lastModificationTimestamp: res.lastModificationTimestamp,
    //       });
    //     });
    //     return {
    //       code: 'success',
    //       detail: returnValue,
    //     };
    //   } catch (ex) {
    //     throw ex;
    //   }
    // }

    private async search(params: any, fieldsToRetreive: string[], populateAll?: boolean): Promise<ServiceResultInterface> {
        try {
            if (!params) {
                params = {};
            }

            // normalize params for certain keys
            const keyParams = ['_id', 'teamLeader', 'department'];
            Object.keys(params).forEach((key) => {
                if (keyParams.includes(key)) {
                    params[key] = new Object(params[key]);
                }
            });

            // base aggregation pipeline
            let pipeline: any[] = [
                {
                    $lookup: {
                        from: 'agents',
                        localField: '_id',
                        foreignField: 'team',
                        as: 'teamMembers',
                    },
                },
                { $match: { ...params } },
            ];

            // if fieldsToRetreive provided, add projection
            if (fieldsToRetreive && fieldsToRetreive.length > 0) {
                const projection: any = {};
                fieldsToRetreive.forEach((field) => (projection[field] = 1));
                pipeline.push({ $project: projection });
            }

            let dbResult: any[] = await EmployeeTeamSchema.aggregate(pipeline);

            // populate relations if requested
            if (populateAll) {
                dbResult = await EmployeeTeamSchema.populate(dbResult, [
                    {
                        path: 'department',
                        select: ['_id', 'refCode', 'name', 'categories'],
                        model: 'Department',
                    },
                    {
                        path: 'teamLeader',
                        select: ['_id', 'firstName', 'lastName'],
                        model: 'User',
                    },
                ]);
            }
            const returnValue: any[] = dbResult.map((res) => {
                let shaped: any = {};

                if (fieldsToRetreive && fieldsToRetreive.length > 0) {
                    fieldsToRetreive.forEach((field) => {
                        if (field === 'departmentCategory' && populateAll && res.department?.categories) {
                            let deptCategoryForTeam: any;
                            (res.department.categories as any[]).forEach((cat) => {
                                if (cat.id === res.departmentCategory) {
                                    deptCategoryForTeam = { id: cat.id, name: cat.name };
                                    return;
                                }
                            });
                            shaped[field] = deptCategoryForTeam ?? res.departmentCategory;
                        } else {
                            shaped[field] = res[field];
                        }
                    });
                } else {
                    shaped = res;
                }

                return shaped;
            });

            return {
                code: 'success',
                detail: returnValue,
            };
        } catch (ex) {
            console.log('ex :>> ', ex);
            throw new DataBaseErrorHandling(ex.message || ex, EmployeeTeamSchema.name, DataBaseActions.find);
        }
    }

    private async insert(workingObj: EmployeeTeamModelInterface): Promise<any> {
        try {
            this.dbDocument = new EmployeeTeamSchema({
                ...workingObj,
                creationTimestamp: Date.now(),
            });
            const result = await this.dbDocument.save({ validateBeforeSave: true });
            // setting teamLeader as part of the team
            // await this.addingTeamLeaderToTeam(workingObj.teamLeader, result._id);
            return {
                actionPerformed: 'dataCreation',
                result: result._id,
            };
        } catch (ex) {
            throw new DataBaseErrorHandling(ex, EmployeeTeamSchema.name, DataBaseActions.insert);
        }
    }

    private async update(workingObject: EmployeeTeamDocumentInterface, newObject: EmployeeTeamModelInterface): Promise<any> {
        try {
            workingObject.refCode = newObject.refCode || workingObject.refCode;
            workingObject.name = newObject.name || workingObject.name;
            workingObject.description = newObject.description || workingObject.description;
            workingObject.department = newObject.department || workingObject.department;
            // workingObject.departmentCategory =
            // 	newObject.departmentCategory || workingObject.departmentCategory;
            workingObject.teamLeader = newObject.teamLeader;
            workingObject.isActive = newObject.isActive;
            workingObject.lastModificationTimestamp = Date.now();
            workingObject.markModified(EmployeeTeamSchema.modelName);
            const result = await workingObject.save();
            // setting teamLeader as part of the team
            //   if (
            //     workingObject.teamLeader &&
            //     workingObject.teamLeader !== newObject.teamLeader
            //   ) {
            //     await this.addingTeamLeaderToTeam(
            //       workingObject.teamLeader,
            //       workingObject._id
            //     );
            //   }

            return {
                actionPerformed: 'dataModification',
                result: result._id,
            };
        } catch (ex) {
            throw new DataBaseErrorHandling(ex, EmployeeTeamSchema.name, DataBaseActions.update);
        }
    }

    //   private async addingTeamLeaderToTeam(
    //     teamLeaderId: string,
    //     agentTeamId: string
    //   ): Promise<void> {
    //     try {
    //       const teamLeaderInfo = await AgentSchema.findById(teamLeaderId);
    //       teamLeaderInfo.team = agentTeamId;
    //       await teamLeaderInfo.save();
    //     } catch (ex) {
    //       throw ex;
    //     }
    //   }
}
