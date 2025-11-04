import { injectable } from 'inversify';

import {
  CandidateJobApplicationDocumentInterface,
  CandidateJobApplicationSchema,
  JobApplicationStatusSchema,
} from '../models';
import { CandidateJobApplicationModelInterface } from '../interfaces/models';
import { CandidateJobApplicationsServiceInterface } from '../interfaces/services';
import {
  DataBaseActions,
  DataBaseErrorHandling,
  NotFoundDataHandling,
  ValidationError,
} from '../error-handlers';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { CommonFunctions } from '../common';
import { JobApplicationStatusValues } from '../enums';
import moment = require('moment');

@injectable()
export class CandidateJobApplicationsService
  implements CandidateJobApplicationsServiceInterface
{
  //#region Public Properties

  public CreateRecord = this.createRecord;
  public ModifyRecord = this.modifyRecord;
  public GetAll = this.getAll;
  public Search = this.search;

  //#endregion

  private dbDocument: CandidateJobApplicationDocumentInterface;

  public constructor() {}

  //#region Private Functions

  private async createRecord(
    workingObj: CandidateJobApplicationModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      const dbResult = await CandidateJobApplicationSchema.findOne({
        candidate: workingObj.candidate,
        applicationDate: {
          $gte: CommonFunctions.substractMonths(
            new Date(),
            Number.parseInt(process.env.MONTHS_BEFORE_NEXT_APPLICATION || '0')
          ),
        },
      }).sort({ applicationDate: -1 });
      let result: any;
      if (dbResult) {
        throw new ValidationError(
          `candidate has applied in the last ${process.env.MONTHS_BEFORE_NEXT_APPLICATION} months.`
        );
      } else {
        // deleting data in order to maintain
        // only updated candidate's data in the database
        await CandidateJobApplicationSchema.deleteMany({
          candidate: workingObj.candidate,
        });
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

  private async modifyRecord(
    workingObj: CandidateJobApplicationModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult = await CandidateJobApplicationSchema.findById(
        workingObj._id
      );
      if (!dbResult) {
        throw new NotFoundDataHandling(
          `candidateJobApplication with _id ${workingObj._id} was not found`
        );
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
      let dbResult = await CandidateJobApplicationSchema.find();
      return {
        code: 'success',
        detail: dbResult.length
          ? dbResult.map((result) => this.formatReturningData(result))
          : [],
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async search(
    params: any,
    populateAll: boolean
  ): Promise<ServiceResultInterface> {
    try {
      // creating candidate filters
      let newParams: any = {};
      Object.keys(params).forEach((key) => {
        if (key !== 'applicationDateFrom' && key !== 'applicationDateTo') {
          if (key === 'candidate') {
            Object.keys(params['candidate']).forEach((candidateKey) => {
              newParams[`candidate.${candidateKey}`] = {
                $regex: params.candidate[candidateKey],
                $options: 'i',
              };
            });
          } else {
            newParams[key] = params[key];
          }
        }
      });

      // validating dates filters
      let applicationDateFromTimestamp: Date = null;
      let applicationDateToTimestamp: Date = null;
      // applicationDateFrom
      if (
        params?.applicationDateFrom &&
        moment(params?.applicationDateFrom).isValid()
      ) {
        applicationDateFromTimestamp = new Date(
          moment(params?.applicationDateFrom)
            .add(+1, 'day')
            .format('YYYY-MM-DD')
        );
      }
      // applicationDateTo
      if (
        params?.applicationDateTo &&
        moment(params?.applicationDateTo).isValid()
      ) {
        applicationDateToTimestamp = new Date(
          moment(params?.applicationDateTo).add(+1, 'day').format('YYYY-MM-DD')
        );
      }
      // creating filters
      let datesFilter: any = null;
      if (applicationDateFromTimestamp && applicationDateToTimestamp) {
        newParams.applicationDate = {
          $gte: applicationDateFromTimestamp,
          $lte: applicationDateToTimestamp,
        };
      } else {
        if (applicationDateFromTimestamp && !applicationDateToTimestamp) {
          newParams.applicationDate = {
            $gte: applicationDateFromTimestamp,
          };
        } else if (
          !applicationDateFromTimestamp &&
          applicationDateToTimestamp
        ) {
          newParams.applicationDate = { $lte: applicationDateToTimestamp };
        }
      }

      let dbResult: CandidateJobApplicationDocumentInterface[] = [];
      const jobApplications = await CandidateJobApplicationSchema.aggregate([
        {
          $lookup: {
            from: 'candidates',
            localField: 'candidate',
            foreignField: '_id',
            as: 'candidate',
          },
        },
        {
          $unwind: '$candidate',
        },
        {
          $match: newParams,
        },
      ]);
      if (populateAll) {
        const populateOptions: any[] = [
          {
            path: 'addressProvince',
            select: ['name', 'score'],
            model: 'AddressProvince',
          },
          {
            path: 'addressCounty',
            select: ['name', 'score'],
            model: 'AddressCounty',
          },
        ];
        if (global.serviceEnvironment === 'vsm') {
          populateOptions.push({
            path: 'addressDistrict',
            select: ['name', 'score'],
            model: 'AddressDistrict',
          });
        }
        // dbResult = await CandidateJobApplicationSchema.find(params)
        //   .select(fieldsToRetreive)
        dbResult = await CandidateJobApplicationSchema.populate(
          jobApplications,
          [
            {
              path: 'jobPosition',
              model: 'JobPosition',
              select: ['referenceCode', 'name', 'language', 'isActive'],
              populate: {
                path: 'language',
                model: 'AllowedPlatformLanguage',
                select: ['name'],
              },
              strictPopulate: false,
            },
            {
              path: 'candidate',
              select: [
                'idNumber',
                'firstName',
                'lastName',
                'imageUrl',
                'email',
                'cellPhoneNumber',
                'dateOfBirth',
                'addressProvince',
                'addressCounty',
                'addressDistrict',
                'udcPK',
              ],
              model: 'Candidate',
              populate: populateOptions,
            },
            {
              path: 'hiringProcessDetails.createdBy',
              select: ['firstName', 'lastName', 'email'],
              model: 'User',
            },
            {
              path: 'hiringProcessDetails.lastModificationBy',
              select: ['firstName', 'lastName', 'email'],
              model: 'User',
            },
            {
              path: 'hiringProcessDetails.relatedStatus',
              select: ['name'],
              model: 'JobApplicationStatus',
            },
            {
              path: 'hiringProcessDetails.previousInterviewsDates.createdBy',
              select: ['firstName', 'lastName', 'email'],
              model: 'User',
            },
            {
              path: 'hiringProcessDetails.comments.recruiter',
              select: ['firstName', 'lastName', 'email'],
              model: 'User',
            },
            {
              path: 'hiringProcessDetails.interviewEvaluationResults.evaluatedBy',
              select: ['firstName', 'lastName', 'email'],
              model: 'User',
            },
            {
              path: 'hiringProcessDetails.interviewStatus',
              select: ['name'],
              model: 'InterviewStatus',
            },
            {
              path: 'recruiterComments.recruiter',
              select: ['firstName', 'lastName', 'email'],
              model: 'User',
            },
            {
              path: 'status',
              select: ['name'],
              model: 'JobApplicationStatus',
            },
          ]
        );
      } else {
        dbResult = await CandidateJobApplicationSchema.find(params);
      }
      if (!dbResult) {
        return {
          code: 'notDataFound',
          detail: 'Data not found',
        };
      }
      return {
        code: 'success',
        detail: dbResult.length
          ? dbResult.map((result) => this.formatReturningData(result))
          : [],
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(
        ex,
        JobApplicationStatusSchema.modelName,
        DataBaseActions.find
      );
    }
  }

  // private async search(
  // 	params: any,
  // 	populateAll: boolean,
  // 	skip: number,
  // 	limit: number
  // ): Promise<ServiceResultInterface> {
  // 	try {
  // 		// creating candidate filters
  // 		let newParams: any = {};
  // 		Object.keys(params).forEach((key) => {
  // 			if (key !== 'applicationDateFrom' && key !== 'applicationDateTo') {
  // 				if (key === 'candidate') {
  // 					Object.keys(params['candidate']).forEach((candidateKey) => {
  // 						newParams[`candidate.${candidateKey}`] = {
  // 							$regex: params.candidate[candidateKey],
  // 							$options: 'i',
  // 						};
  // 					});
  // 				} else {
  // 					newParams[key] = params[key];
  // 				}
  // 			}
  // 		});

  // 		// validating dates filters
  // 		let applicationDateFromTimestamp: Date = null;
  // 		let applicationDateToTimestamp: Date = null;
  // 		// applicationDateFrom
  // 		if (
  // 			params?.applicationDateFrom &&
  // 			moment(params?.applicationDateFrom).isValid()
  // 		) {
  // 			applicationDateFromTimestamp = new Date(
  // 				moment(params?.applicationDateFrom)
  // 					.add(+1, 'day')
  // 					.format('YYYY-MM-DD')
  // 			);
  // 		}
  // 		// applicationDateTo
  // 		if (
  // 			params?.applicationDateTo &&
  // 			moment(params?.applicationDateTo).isValid()
  // 		) {
  // 			applicationDateToTimestamp = new Date(
  // 				moment(params?.applicationDateTo)
  // 					.add(+1, 'day')
  // 					.format('YYYY-MM-DD')
  // 			);
  // 		}
  // 		// creating filters
  // 		let datesFilter: any = null;
  // 		if (applicationDateFromTimestamp && applicationDateToTimestamp) {
  // 			newParams.applicationDate = {
  // 				$gte: applicationDateFromTimestamp,
  // 				$lte: applicationDateToTimestamp,
  // 			};
  // 		} else {
  // 			if (applicationDateFromTimestamp && !applicationDateToTimestamp) {
  // 				newParams.applicationDate = {
  // 					$gte: applicationDateFromTimestamp,
  // 				};
  // 			} else if (!applicationDateFromTimestamp && applicationDateToTimestamp) {
  // 				newParams.applicationDate = { $lte: applicationDateToTimestamp };
  // 			}
  // 		}

  // 		let dbResult: CandidateJobApplicationDocumentInterface[] = [];
  // 		const pipeline: any[] = [
  // 			{
  // 				$lookup: {
  // 					from: 'candidates',
  // 					localField: 'candidate',
  // 					foreignField: '_id',
  // 					as: 'candidate',
  // 				},
  // 			},
  // 			{
  // 				$unwind: '$candidate',
  // 			},
  // 			{
  // 				$match: newParams,
  // 			}
  // 		];
  // 		console.log('skip :>> ', skip);
  // 		if(skip) {
  // 			pipeline.push({$skip: skip})
  // 		}
  // 		console.log('limit :>> ', limit);
  // 		if(limit) {
  // 			pipeline.push({$limit: limit})
  // 		}
  // 		const jobApplications = await CandidateJobApplicationSchema.aggregate(pipeline);
  // 		if (populateAll) {
  // 			// dbResult = await CandidateJobApplicationSchema.find(params)
  // 			//   .select(fieldsToRetreive)
  // 			dbResult = await CandidateJobApplicationSchema.populate(jobApplications, [
  // 				{
  // 					path: 'candidate',
  // 					select: [
  // 						'idNumber',
  // 						'firstName',
  // 						'lastName',
  // 						'imageUrl',
  // 						'email',
  // 						'cellPhoneNumber',
  // 						'dateOfBirth',
  // 						'addressProvince',
  // 						'addressCounty',
  // 						'addressDistrict',
  // 						'udcPK',
  // 					],
  // 					model: 'Candidate',
  // 					populate: [
  // 						{
  // 							path: 'addressProvince',
  // 							select: ['name', 'score'],
  // 							model: 'AddressProvince',
  // 						},
  // 						{
  // 							path: 'addressCounty',
  // 							select: ['name', 'score'],
  // 							model: 'AddressCounty',
  // 						},
  // 						{
  // 							path: 'addressDistrict',
  // 							select: ['name', 'score'],
  // 							model: 'AddressDistrict',
  // 						},
  // 					],
  // 				},
  // 				{
  // 					path: 'hiringProcessDetails.createdBy',
  // 					select: ['firstName', 'lastName', 'email'],
  // 					model: 'User',
  // 				},
  // 				{
  // 					path: 'hiringProcessDetails.lastModificationBy',
  // 					select: ['firstName', 'lastName', 'email'],
  // 					model: 'User',
  // 				},
  // 				{
  // 					path: 'hiringProcessDetails.relatedStatus',
  // 					select: ['name'],
  // 					model: 'JobApplicationStatus',
  // 				},
  // 				{
  // 					path: 'hiringProcessDetails.previousInterviewsDates.createdBy',
  // 					select: ['firstName', 'lastName', 'email'],
  // 					model: 'User',
  // 				},
  // 				{
  // 					path: 'hiringProcessDetails.comments.recruiter',
  // 					select: ['firstName', 'lastName', 'email'],
  // 					model: 'User',
  // 				},
  // 				{
  // 					path: 'hiringProcessDetails.interviewEvaluationResults.evaluatedBy',
  // 					select: ['firstName', 'lastName', 'email'],
  // 					model: 'User',
  // 				},
  // 				{
  // 					path: 'hiringProcessDetails.interviewStatus',
  // 					select: ['name'],
  // 					model: 'InterviewStatus',
  // 				},
  // 				{
  // 					path: 'recruiterComments.recruiter',
  // 					select: ['firstName', 'lastName', 'email'],
  // 					model: 'User',
  // 				},
  // 				{
  // 					path: 'status',
  // 					select: ['name'],
  // 					model: 'JobApplicationStatus',
  // 				},
  // 			]);
  // 		} else {
  // 			dbResult = await CandidateJobApplicationSchema.find(params);
  // 		}
  // 		if (!dbResult) {
  // 			return {
  // 				code: 'notDataFound',
  // 				detail: 'Data not found',
  // 			};
  // 		}
  // 		return {
  // 			code: 'success',
  // 			detail: dbResult.length
  // 				? dbResult.map((result) => this.formatReturningData(result))
  // 				: [],
  // 		};
  // 	} catch (ex) {
  // 		console.log('ex :>> ', ex);
  // 		throw new DataBaseErrorHandling(
  // 			ex,
  // 			JobApplicationStatusSchema.modelName,
  // 			DataBaseActions.find
  // 		);
  // 	}
  // }

  private async insert(
    workingObj: CandidateJobApplicationModelInterface
  ): Promise<any> {
    try {
      this.dbDocument = new CandidateJobApplicationSchema({
        ...workingObj,
        applicationDate: Date.now(),
      });
      const result = await this.dbDocument.save({ validateBeforeSave: true });
      return {
        actionPerformed: 'dataCreation',
        result: result._id,
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(
        ex,
        CandidateJobApplicationSchema.modelName,
        DataBaseActions.insert
      );
    }
  }

  private async update(
    workingObject: CandidateJobApplicationDocumentInterface,
    newObject: CandidateJobApplicationModelInterface
  ): Promise<any> {
    try {
      newObject.hiringProcessDetails;
      workingObject.notCompletionNotification =
        newObject.notCompletionNotification
          ? newObject.notCompletionNotification
          : workingObject.notCompletionNotification;
      workingObject.status = newObject.status
        ? newObject.status
        : newObject.status;
      workingObject.endingApplicationToken =
        newObject.status !== JobApplicationStatusValues.notCompleted
          ? null
          : workingObject.endingApplicationToken;

      workingObject.markModified('CandidateJobApplicationSchema');
      const result = await workingObject.save();
      return {
        actionPerformed: 'dataModification',
        result: result._id,
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(
        ex,
        CandidateJobApplicationSchema.name,
        DataBaseActions.update
      );
    }
  }

  private formatReturningData(
    data: CandidateJobApplicationDocumentInterface
  ): CandidateJobApplicationModelInterface {
    return {
      _id: data._id,
      jobPosition: data.jobPosition,
      candidate: data.candidate,
      whatsappOpened: data.whatsappOpened,
      hiringProcessDetails: data.hiringProcessDetails,
      endingApplicationToken: data.endingApplicationToken,
      language: data.language,
      notCompletionNotification: data.notCompletionNotification,
      status: data.status,
      applicationDate: data.applicationDate,
    } as CandidateJobApplicationModelInterface;
  }
}
