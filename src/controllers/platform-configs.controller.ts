import * as Validator from "params-verifier";
import { controller, httpGet, httpPost, httpPut, interfaces } from "inversify-express-utils";
import { inject } from "inversify";
import { ObjectId } from "mongodb";
import { Request, Response } from "express";

import { ApiTypes } from "../apiTypes";
import { ConstantValues } from "../constantValues";
import { handleErrorResponse, ValidationError } from "../error-handlers";
import { PlatformConfigModelInterface } from "../interfaces/models";
import { PlatformConfigsService } from "../services";
import { ServiceResultInterface } from "../interfaces/service-result.interface";

@controller(ConstantValues.platformconfigs)
export class PlatformConfigsController implements interfaces.Controller {
	private dataSrv: PlatformConfigsService;

	public constructor(@inject(ApiTypes.platformConfigsService) dataSrv: PlatformConfigsService) {
		this.dataSrv = dataSrv;
	}

	@httpPut("/")
	public async Modify(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.ModifyRecord(
				this.validateWorkingObject(req.body, true)
			);
			if (!serviceResult) {
				res.status(400).send({
					code: "requestNotProcessed",
					detail: "Any data was saved",
				});
			} else {
				res.status(200).send(serviceResult);
			}
		} catch (ex) {
			handleErrorResponse(ex, res);
		}
	}

	@httpGet("/")
	public async getAll(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.GetAll();
			if (serviceResult.code === "error") {
				res.status(500).send(serviceResult);
				return;
			}
			res.send(serviceResult);
		} catch (ex) {
			handleErrorResponse(ex, res);
		}
	}

	@httpGet("/:id")
	public async getByID(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.GetByID(req.params.id);
			if (serviceResult.code === "error") {
				res.status(500).send(serviceResult);
				return;
			}
			res.send(serviceResult);
		} catch (ex) {
			handleErrorResponse(ex, res);
		}
	}

	@httpPost("/search")
	public async Search(req: Request, res: Response): Promise<void> {
		try {
			let serviceResult: ServiceResultInterface = await this.dataSrv.Search(
				req.body.workingObject,
				req.body.fieldsToRetreive
			);
			if (serviceResult.code === "error") {
				res.status(500).send(serviceResult);
				return;
			}
			res.send(serviceResult);
		} catch (ex) {
			handleErrorResponse(ex, res);
		}
	}

	private validateWorkingObject(payload: any, updatingRecord: boolean): PlatformConfigModelInterface {
		try {
			if (!payload) {
				throw "body is required";
			}

			const paramValidator = new Validator(payload, "object", {
				required: true,
				stringNoEmpty: true,
			});

			if (updatingRecord) {
				paramValidator.field("lastModificationBy", "string", {
					required: true,
					validatorErrMsg: "lastModificationBy is required",
					typeErrMsg: "wrong value type on field lastModificationBy",
				});
				if (!ObjectId.isValid(payload.lastModificationBy)) {
					throw "field lastModificationBy is not a valid  ObjecId";
				}
			}

			paramValidator
				// .field('smsMarketingCampaignMessage', 'string', {
				//   required: true,
				//   validatorErrMsg: 'smsMarketingCampaignMessage is required',
				//   typeErrMsg: 'wrong value type on field smsMarketingCampaignMessage',
				// })
				// .field('smsMarketingCampaignPhoneNumber', 'string', {
				//   required: true,
				//   validatorErrMsg: 'smsMarketingCampaignPhoneNumber is required',
				//   typeErrMsg:
				//     'wrong value type on field smsMarketingCampaignPhoneNumber',
				// })
				.field("companyName", "string", {
					validatorErrMsg: "companyName is required",
					typeErrMsg: "wrong value type on field companyName",
				})
				.field("whatsappNumber", "string", {
					validatorErrMsg: "whatsappNumber is required",
					typeErrMsg: "wrong value type on field whatsappNumber",
				})
				.field("whatsappMessage", "string", {
					required: true,
					validatorErrMsg: "whatsappMessage is required",
					typeErrMsg: "wrong value type on field whatsappMessage",
				})
				.field("maxQuantityOfInterviewsPerHour", "number", {
					required: true,
					validatorErrMsg: "maxQuantityOfInterviewsPerHour is required",
					typeErrMsg: "wrong value type on field maxQuantityOfInterviewsPerHour",
				})
				.field("mainPlatformLogo", "string", {
					required: true,
					validatorErrMsg: "mainPlatformLogo is required",
					typeErrMsg: "wrong value type on field mainPlatformLogo",
				})
				.field("footerPlatformLogo", "string", {
					required: true,
					validatorErrMsg: "footerPlatformLogo is required",
					typeErrMsg: "wrong value type on field footerPlatformLogo",
				})
				.field("favIco", "string", {
					required: true,
					validatorErrMsg: "favIco is required",
					typeErrMsg: "wrong value type on field favIco",
				})
				.field("quantityOfDaysPerMonth", "number", {
					required: true,
					validatorErrMsg: "quantityOfDaysPerMonth is required",
					typeErrMsg: "wrong value type on field quantityOfDaysPerMonth",
				})
				.field("agentEditionTemplateUrl", "string", {
					required: false,
					validatorErrMsg: "agentEditionTemplateUrl is required",
					typeErrMsg: "wrong value type on field agentEditionTemplateUrl",
				})
				.field("candidateEditionTemplateUrl", "string", {
					required: false,
					validatorErrMsg: "candidateEditionTemplateUrl is required",
					typeErrMsg: "wrong value type on field candidateEditionTemplateUrl",
				})
				.field("minimumMonthsToReapply", "number", {
					required: true,
					validatorErrMsg: "minimumMonthsToReapply is required",
					typeErrMsg: "wrong value type on field minimumMonthsToReapply",
				})
				.field("vacationRequestPolicy", "number", {
					required: false,
					validatorErrMsg: "vacationRequestPolicy is required",
					typeErrMsg: "wrong value type on field vacationRequestPolicy",
				})
				.field("autoRejectVacation", "boolean", {
					required: true,
					validatorErrMsg: "minimumMonthsToReapply is required",
					typeErrMsg: "wrong value type on field minimumMonthsToReapply",
				})
				.field("accumulatedVacationDaysNotificationThreshold", "number", {
					required: true,
					validatorErrMsg: "accumulatedVacationDaysNotificationThreshold is required",
					typeErrMsg: "wrong value type on field accumulatedVacationDaysNotificationThreshold",
				})
				.field("vacationIncrementPerMonthWorked", "number", {
					required: true,
					validatorErrMsg: "vacationIncrementPerMonthWorked is required",
					typeErrMsg: "wrong value type on field vacationIncrementPerMonthWorked",
				});

			// validate if hiringProcessEmailTemplates is an array
			if (!Array.isArray(payload.hiringProcessEmailTemplates)) {
				throw "hiringProcessEmailTemplates is not an array";
			}

			// validate language in hiringProcessEmailTemplates
			payload.hiringProcessEmailTemplates.forEach((template) => {
				if (typeof template.language !== "string") {
					throw "wrong value type in language on field hiringProcessEmailTemplates";
				}

				// validate that template is an array
				if (!Array.isArray(template.templates)) {
					throw "wrong value type in templates in hiringProcessEmailTemplates";
				}

				// Validate items in templates
				template.templates.forEach((emailTemplate) => {
					if (typeof emailTemplate.type !== "string") {
						throw "wrong value type in templates";
					}
					if (typeof emailTemplate.emailDescription !== "string") {
						throw "wrong value emailDescription in templates";
					}
					if (typeof emailTemplate.emailSubject !== "string") {
						throw "wrong value emailSubject in templates";
					}
					if (typeof emailTemplate.emailBody !== "string") {
						throw "wrong value emailBody in templates";
					}
				});
			});

			// validate if employeeTerminationActions is an array
			if (!Array.isArray(payload.employeeTerminationActions)) {
				throw "employeeTerminationActions is not an array";
			}

			// validate each item in employeeTerminationActions
			payload.employeeTerminationActions.forEach((actions) => {
				if (actions.recipientEmail && typeof actions.recipientEmail !== "string") {
					throw new ValidationError("recipientEmail is not valid");
				}

				if (!Array.isArray(actions.scriptList)) {
					throw "scriptList is not an array";
				}

				if (!Array.isArray(actions.ccList)) {
					throw "ccList is not an array";
				}
			});

			// validate if hiringProcessCcEmails is an array
			if (!Array.isArray(payload.hiringProcessCcEmails)) {
				throw "hiringProcessCcEmails is not an array";
			}

			// validate each item in hiringProcessCcEmails is a valid string
			payload.hiringProcessCcEmails.forEach((email) => {
				if (typeof email !== "string") {
					throw "one or more items of hiringProcessCcEmails are not a valid string";
				}
			});
			// validation holidays
			if (payload.holidays && !Array.isArray(payload.holidays)) {
				throw "holidays is not a valid array";
			}
			payload.holidays = (payload.holidays as any[]).map((holiday: any, index: number) =>
				this.validateHoliday(holiday, index)
			);
			// publicApiKey
			if (payload.publicApiKey && typeof payload.publicApiKey !== "string") {
				throw "publicApiKey is not a valid string";
			}

			return {
				_id: payload._id,
				// smsMarketingCampaignMessage: payload.smsMarketingCampaignMessage,
				// smsMarketingCampaignPhoneNumber:
				//   payload.smsMarketingCampaignPhoneNumber,
				companyName: payload.companyName,
				companyDescriptionForCandidates: (payload.companyDescriptionForCandidates as any[]).map((item) => ({
					language: item.language,
					description: item.description,
				})),
				whatsappNumber: payload.whatsappNumber,
				whatsappMessage: payload.whatsappMessage,
				socialSecurityPercentage: payload.socialSecurityPercentage,
				maxQuantityOfInterviewsPerHour: payload.maxQuantityOfInterviewsPerHour,
				mainPlatformLogo: payload.mainPlatformLogo,
				footerPlatformLogo: payload.footerPlatformLogo,
				favIco: payload.favIco,
				hiringProcessEmailTemplates: payload.hiringProcessEmailTemplates,
				employeeTerminationActions: payload.employeeTerminationActions,
				hiringProcessCcEmails: payload.hiringProcessCcEmails,
				quantityOfDaysPerMonth: payload.quantityOfDaysPerMonth,
				agentEditionTemplateUrl: payload.agentEditionTemplateUrl,
				accumulatedVacationDaysNotificationThreshold: payload.accumulatedVacationDaysNotificationThreshold,
				candidateEditionTemplateUrl: payload.candidateEditionTemplateUrl,
				minimumMonthsToReapply: payload.minimumMonthsToReapply,
				holidays: payload.holidays,
				vacationRequestPolicy: payload.vacationRequestPolicy,
				vacationIncrementPerMonthWorked: payload.vacationIncrementPerMonthWorked,
				autoRejectVacation: payload.autoRejectVacation,
				// workingDays: payload.workingDays,
				publicApiKey: payload.publicApiKey,
				createdBy: payload.creationBy,
				lastModificationBy: payload.lastModificationBy,
			};
		} catch (ex) {
			throw new ValidationError(ex.message ? ex.message : ex);
		}
	}

	private validateHoliday(payload: any, index: number): any {
		try {
			new Validator(payload, "object", {
				required: true,
				stringNoEmpty: true,
			})
				.field("month", "number", {
					required: true,
					validatorErrMsg: `month in index ${index} is required`,
					typeErrMsg: `wrong value type on field month in index ${index}`,
				})
				.field("date", "number", {
					required: true,
					validatorErrMsg: `date in index ${index} is required`,
					typeErrMsg: `wrong value type on field date in index ${index}`,
				})
				.field("description", "string", {
					required: true,
					validatorErrMsg: `description in index ${index} is required`,
					typeErrMsg: `wrong value type on field description in index ${index}`,
				})
				.field("isPaid", "boolean", {
					required: true,
					validatorErrMsg: `isPaid in index ${index} is required`,
					typeErrMsg: `wrong value type on field isPaid in index ${index}`,
				})
				.field("isActive", "boolean", {
					required: true,
					validatorErrMsg: `isActive in index ${index} is required`,
					typeErrMsg: `wrong value type on field isActive in index ${index}`,
				});
			return {
				month: payload.month,
				date: payload.date,
				description: payload.description,
				isPaid: payload.isPaid,
				isActive: payload.isActive,
			};
		} catch (ex) {
			throw ex;
		}
	}
}
