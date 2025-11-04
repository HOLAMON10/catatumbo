import { injectable } from 'inversify';

import {
  CandidateDocumentInterface,
  CandidateJobApplicationSchema,
  CandidateSchema,
} from '../models';
import { CandidateModelInterface } from '../interfaces/models';
import { CandidatesServiceInterface } from '../interfaces/services';
import {
  DataBaseActions,
  DataBaseErrorHandling,
  NotFoundDataHandling,
  RecordAlreadyCreatedHandling,
} from '../error-handlers';
import { InterviewStatusValues, JobApplicationStatusValues } from '../enums';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import moment = require('moment');

@injectable()
export class CandidatesService implements CandidatesServiceInterface {
  //#region Public Properties

  public CreateRecord = this.createRecord;
  public ModifyRecord = this.modifyRecord;
  public GetAll = this.getAll;
  public GetById = this.getById;
  public Search = this.search;
  public SearchCandidateInfo = this.searchCandidateInfo;

  //#endregion

  private dbDocument: CandidateDocumentInterface;

  public constructor() {}

  //#region Private Functions

  private async createRecord(
    workingObj: CandidateModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      const dbResult = await CandidateSchema.findOne({
        idNumber: workingObj.idNumber.trim(),
      });
      let result: any;
      if (dbResult) {
        throw new RecordAlreadyCreatedHandling(
          `candidate with id number ${workingObj.idNumber} is already created.`
        );
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

  private async modifyRecord(
    workingObj: CandidateModelInterface
  ): Promise<ServiceResultInterface> {
    try {
      let dbResult = await CandidateSchema.findById(workingObj._id);
      if (!dbResult) {
        throw new NotFoundDataHandling(
          `candidate with _id ${workingObj._id} was not found`
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
      const _ = require('lodash');
      let dbResult = await this.searchCandidateInfo(null, false);

      let candidates: any[] = [];
      if (dbResult.length) {
        // getting active age score
        await Promise.all(
          dbResult.map(async (result) => {
            let jobApplication: any = await this.searchCandidateJobApplications(
              result._id,
              false
            );
            let chatbotInteractionScore: number = 0;
            // calculating chatbot interaction score
            if (jobApplication) {
              (jobApplication.chatbotAnswers as any[]).forEach((c) => {
                if (c.answers) {
                  (c.answers as any[]).forEach((a) => {
                    if (a.score) {
                      chatbotInteractionScore += a.score;
                    }
                  });
                }
              });
            } else {
              jobApplication = {
                chatbotAnswers: null,
                chatbotInteractionScore: 0,
                whatsappOpened: false,
                status: null,
                applicationDate: null,
              };
            }
            // calculating score per location
            let provinceScore: number = 0,
              countyScore: number = 0,
              districtScore: number = 0;
            if (result.addressProvince) {
              provinceScore = (result.addressProvince as any).score
                ? (result.addressProvince as any).score
                : 0;
            }
            if (result.addressCounty) {
              countyScore = (result.addressCounty as any).score
                ? (result.addressCounty as any).score
                : 0;
            }
            if (result.addressDistrict) {
              districtScore = (result.addressDistrict as any).score
                ? (result.addressDistrict as any).score
                : 0;
            }
            const locationScore = provinceScore + countyScore + districtScore;
            // calculating score per age
            const candidateBirthDate = moment(result.dateOfBirth, 'YYYY-MM-DD');
            const candidateAge = moment(new Date(), 'YYYY-MM-DD').diff(
              candidateBirthDate,
              'years'
            );
           

            candidates.push({
              _id: result._id,
              imageUrl: result.imageUrl,
              idNumber: result.idNumber,
              firstName: result.firstName,
              lastName: result.lastName,
              email: result.email,
              cellPhoneNumber: result.cellPhoneNumber,
              location: {
                addressProvince: result.addressProvince,
                addressCounty: result.addressCounty,
                addressDistrict: result.addressDistrict,
                locationScore,
              },
              dateOfBirth: result.dateOfBirth,
              age: candidateAge,
              udcPK: result.udcPK,
              jobApplication: jobApplication
                ? {
                    id: jobApplication._id,
                    chatbotAnswers: jobApplication?.chatbotAnswers,
                    chatbotInteractionScore,
                    whatsappOpenned: jobApplication?.whatsappOpened,
                    recruiterComments: jobApplication?.recruiterComments
                      ? _.orderBy(
                          jobApplication.recruiterComments,
                          'creationTimestamp',
                          'desc'
                        )
                      : null,
                    hiringProcessDetails: jobApplication.hiringProcessDetails,
                    endingApplicationToken:
                      jobApplication.endingApplicationToken,
                    status: jobApplication?.status,
                    applicationDate: jobApplication?.applicationDate,
                  }
                : null,
            });
          })
        );
      }
      return {
        code: 'success',
        detail: _.orderBy(candidates, 'averageScore', 'desc'),
        // detail: candidates.sort((a, b) => (b.jobApplication.averageScore - a.jobApplication.averageScore))
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async getById(id: string): Promise<ServiceResultInterface> {
    try {
      const dbResult = await CandidateSchema.findById(id);
      return {
        code: 'success',
        detail: dbResult,
      };
    } catch (ex) {
      throw ex;
    }
  }

  private async searchCandidateInfo(
    params: any,
    populateAll: boolean
  ): Promise<any> {
    try {
      if (!populateAll) {
        return await CandidateSchema.find(params);
      }
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
      return await CandidateSchema.find(params).populate(populateOptions);
    } catch (ex) {
      throw ex;
    }
  }

  private async searchCandidateJobApplications(
    params: any,
    populateAll: boolean
  ): Promise<any> {
    try {
      if (!populateAll) {
        return await CandidateJobApplicationSchema.find(params);
      }
      return CandidateJobApplicationSchema.find(params)
        .populate({
          path: 'jobPosition',
          model: 'JobPosition',
          select: ['referenceCode', 'name', 'language', 'isActive'],
          populate: {
            path: 'language',
            model: 'AllowedPlatformLanguage',
            select: ['name'],
          },
          strictPopulate: false,
        })
        .populate({
          path: 'hiringProcessDetails.createdBy',
          select: ['firstName', 'lastName', 'email'],
          model: 'User',
        })
        .populate({
          path: 'hiringProcessDetails.lastModificationBy',
          select: ['firstName', 'lastName', 'email'],
          model: 'User',
        })
        .populate({
          path: 'hiringProcessDetails.relatedStatus',
          select: ['name'],
          model: 'JobApplicationStatus',
        })
        .populate({
          path: 'hiringProcessDetails.previousInterviewsDates.createdBy',
          select: ['firstName', 'lastName', 'email'],
          model: 'User',
        })
        .populate({
          path: 'hiringProcessDetails.comments.recruiter',
          select: ['firstName', 'lastName', 'email'],
          model: 'User',
        })
        .populate({
          path: 'hiringProcessDetails.interviewEvaluationResults.evaluatedBy',
          select: ['firstName', 'lastName', 'email'],
          model: 'User',
        })
        .populate({
          path: 'recruiterComments.recruiter',
          select: ['firstName', 'lastName', 'email'],
          model: 'User',
        })
        .populate({
          path: 'status',
          select: ['name'],
          model: 'JobApplicationStatus',
        });
    } catch (ex) {
      throw ex;
    }
  }

  private async search(
    params: any,
    populateAll: boolean,
    filterCandidatesSection?: boolean
  ): Promise<ServiceResultInterface> {
    try {
      const _ = require('lodash');
      let candidateResult = await this.searchCandidateInfo(params, populateAll);

      let candidates: any[] = [];
      if (candidateResult.length) {
        // getting active age score
        const jobApplications = await this.searchCandidateJobApplications(
          {
            candidate: { $in: (candidateResult as any[]).map((c) => c._id) },
          },
          true
        );

        candidateResult.forEach((candidate: any) => {
          let candJobApplication: any,
            chatbotInteractionScore: number = 0;
          jobApplications.forEach((jobApplication: any) => {
            if (
              candidate._id.toString() === jobApplication.candidate.toString()
            ) {
              // calculating score by age
              if (jobApplication.chatbotAnswers) {
                (jobApplication.chatbotAnswers as any[]).forEach((c) => {
                  if (c.answers) {
                    (c.answers as any[]).forEach((a) => {
                      if (a.score) {
                        chatbotInteractionScore += a.score;
                      }
                    });
                  }
                });
              }
              candJobApplication = jobApplication;
              return;
            }
          });
          let provinceScore: number = 0,
            countyScore: number = 0,
            districtScore: number = 0;
          if (candidate.addressProvince) {
            provinceScore = (candidate.addressProvince as any).score
              ? (candidate.addressProvince as any).score
              : 0;
          }
          if (candidate.addressCounty) {
            countyScore = (candidate.addressCounty as any).score
              ? (candidate.addressCounty as any).score
              : 0;
          }
          if (candidate.addressDistrict) {
            districtScore = (candidate.addressDistrict as any).score
              ? (candidate.addressDistrict as any).score
              : 0;
          }
          const locationScore = provinceScore + countyScore + districtScore;
          // calculating score per age
          const candidateBirthDate = moment(
            candidate.dateOfBirth,
            'YYYY-MM-DD'
          );
          const candidateAge = moment(new Date(), 'YYYY-MM-DD').diff(
            candidateBirthDate,
            'years'
          );
          
          let interviewsScores: any = {};
          if (candJobApplication?.hiringProcessDetails) {
            (candJobApplication?.hiringProcessDetails as any[]).forEach(
              (item) => {
                if (item.relatedStatus) {
                  if (
                    item.relatedStatus._id ===
                      JobApplicationStatusValues.scheduledInterview1 &&
                    item.interviewStatus === InterviewStatusValues.done
                  ) {
                    interviewsScores.interview1Score =
                      item.interviewEvaluationResults.interviewObtainedScore;
                  }
                  if (
                    item.relatedStatus._id ===
                      JobApplicationStatusValues.scheduledInterview2 &&
                    item?.interviewEvaluationResults &&
                    item?.interviewStatus === InterviewStatusValues.done
                  ) {
                    interviewsScores.interview2Score =
                      item.interviewEvaluationResults.interviewObtainedScore;
                  }
                }
              }
            );
          }
          candidates.push({
            _id: candidate._id,
            imageUrl: candidate.imageUrl,
            idNumber: candidate.idNumber,
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            cellPhoneNumber: candidate.cellPhoneNumber,
            location: {
              addressProvince: candidate.addressProvince,
              addressCounty: candidate.addressCounty,
              addressDistrict: candidate.addressDistrict,
              locationScore,
            },
            dateOfBirth: candidate.dateOfBirth,
            age: candidateAge,
            interviewsScores,
            jobApplication: candJobApplication
              ? {
                  id: candJobApplication._id,
                  jobPosition: candJobApplication.jobPosition,
                  chatbotAnswers: candJobApplication?.chatbotAnswers,
                  chatbotInteractionScore,
                  whatsappOpenned: candJobApplication?.whatsappOpened,
                  recruiterComments: candJobApplication?.recruiterComments
                    ? _.orderBy(
                        candJobApplication.recruiterComments,
                        'creationTimestamp',
                        'desc'
                      )
                    : null,
                  hiringProcessDetails: candJobApplication.hiringProcessDetails,
                  endingApplicationToken:
                    candJobApplication.endingApplicationToken,
                  language: candJobApplication.language || 'en',
                  status: candJobApplication?.status,
                  applicationDate: candJobApplication?.applicationDate,
                  notCompletionNotification:
                    candJobApplication?.notCompletionNotification,
                }
              : null,
            udcPK: candJobApplication.udcPK,
          });
        });
      }
      if (filterCandidatesSection) {
        candidates = candidates.filter((candidate) => {
          if (!candidate.jobApplication) {
            return candidate;
          }
          if (
            candidate.jobApplication?.status?._id ===
              JobApplicationStatusValues.applied ||
            candidate.jobApplication?.status?._id ===
              JobApplicationStatusValues.contacted ||
            candidate.jobApplication?.status?._id ===
              JobApplicationStatusValues.scheduledInterview1 ||
            candidate.jobApplication?.status?._id ===
              JobApplicationStatusValues.rejected ||
            candidate.jobApplication?.status?._id ===
              JobApplicationStatusValues.forFutureConsideration ||
            candidate.jobApplication?.status?._id ===
              JobApplicationStatusValues.notCompleted
          ) {
            return candidate;
          }
        });
      }
      return {
        code: 'success',
        detail: _.orderBy(candidates, 'averageScore', 'desc'),
        // detail: candidates.sort((a, b) => (b.jobApplication.averageScore - a.jobApplication.averageScore))
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(
        ex.message ? ex.message : ex,
        CandidateSchema.modelName,
        DataBaseActions.find
      );
    }
  }

  private async insert(workingObj: CandidateModelInterface): Promise<any> {
    try {
      this.dbDocument = new CandidateSchema({
        ...workingObj,
        email: workingObj.email.toLowerCase(),
        createdDate: Date.now(),
      });
      const result = await this.dbDocument.save({ validateBeforeSave: true });
      return {
        actionPerformed: 'dataCreation',
        result: result._id,
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(
        ex,
        CandidateSchema.name,
        DataBaseActions.insert
      );
    }
  }

  private async update(
    workingObject: CandidateDocumentInterface,
    newObject: CandidateModelInterface
  ): Promise<any> {
    try {
      workingObject.idNumber = newObject.idNumber
        ? newObject.idNumber
        : workingObject.idNumber;
      workingObject.imageUrl = newObject.imageUrl
        ? newObject.imageUrl
        : workingObject.imageUrl;
      workingObject.email = newObject.email
        ? newObject.email.toLowerCase()
        : workingObject.email;
      workingObject.firstName = newObject.firstName
        ? newObject.firstName
        : workingObject.firstName;
      workingObject.lastName = newObject.lastName
        ? newObject.lastName
        : workingObject.lastName;
      workingObject.cellPhoneNumber = newObject.cellPhoneNumber
        ? newObject.cellPhoneNumber
        : workingObject.cellPhoneNumber;
      workingObject.addressCounty = newObject.addressCounty
        ? newObject.addressCounty
        : workingObject.addressCounty;
      workingObject.addressProvince = newObject.addressProvince
        ? newObject.addressProvince
        : workingObject.addressProvince;
      workingObject.addressDistrict = newObject.addressDistrict
        ? newObject.addressDistrict
        : workingObject.addressDistrict;
      const moment = require('moment');
      if (moment(newObject.dateOfBirth).isValid()) {
        workingObject.dateOfBirth = moment(newObject.dateOfBirth);
      }
      workingObject.udcPK = newObject.udcPK
        ? newObject.udcPK
        : workingObject.udcPK;
      workingObject.lastModificationBy = newObject.lastModificationBy;
      workingObject.lastModificationDate = Date.now();
      workingObject.markModified(CandidateSchema.modelName);
      const result = await workingObject.save();
      return {
        actionPerformed: 'dataModification',
        result: result._id,
      };
    } catch (ex) {
      throw new DataBaseErrorHandling(
        ex,
        CandidateSchema.name,
        DataBaseActions.update
      );
    }
  }

  
}
