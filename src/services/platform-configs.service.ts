import { injectable } from "inversify";

import { DataBaseActions, DataBaseErrorHandling } from "../error-handlers";
import { PlatformConfigDocumentInterface, PlatformConfigSchema } from "../models";
import { PlatformConfigModelInterface } from "../interfaces/models";
import { PlatformConfigsServiceInterface } from "../interfaces/services";
import { ServiceResultInterface } from "../interfaces/service-result.interface";

@injectable()
export class PlatformConfigsService implements PlatformConfigsServiceInterface {
	public ModifyRecord = this.modifyRecord;
	public GetAll = this.getAll;
	public GetByID = this.getByID;
	public Search = this.search;

	private dbDocument: PlatformConfigDocumentInterface;

	public constructor() {}

	private async modifyRecord(workingObj: PlatformConfigModelInterface): Promise<ServiceResultInterface> {
		try {
			await this.validateEmailTemplates(workingObj);
			let actionResult: any = {};
			let dbResult = await PlatformConfigSchema.findOne();
			if (!dbResult) {
				const createdBy = workingObj.lastModificationBy;
				workingObj.lastModificationBy = null;
				actionResult = await this.insert(workingObj);
			} else {
				actionResult = await this.update(dbResult, workingObj);
			}
			return {
				code: "success",
				detail: actionResult,
			};
		} catch (ex) {
			throw ex;
		}
	}

	private async getAll(): Promise<ServiceResultInterface> {
		try {
			let dbResult: PlatformConfigDocumentInterface[] = await PlatformConfigSchema.find().populate([
				{
					path: "hiringProcessEmailTemplates.language",
					select: ["_id", "name"],
					model: "AllowedPlatformLanguage",
					strictPopulate: false,
				},
				{
					path: "hiringProcessEmailTemplates.templates.type",
					select: ["_id", "name"],
					model: "HiringProcessEmailType",
					strictPopulate: false,
				},
			]);
			return {
				code: "success",
				detail: dbResult.map((result) => this.formatReturningObject(result)),
			};
		} catch (ex) {
			throw ex;
		}
	}

	private async getByID(id: string): Promise<ServiceResultInterface> {
		try {
			let dbResult: PlatformConfigDocumentInterface = await PlatformConfigSchema.findById(id);
			return {
				code: "success",
				detail: this.formatReturningObject(dbResult),
			};
		} catch (ex) {
			throw ex;
		}
	}

	private async search(params: any, fieldsToRetreive: string[]): Promise<ServiceResultInterface> {
		try {
			let dbResult: PlatformConfigDocumentInterface[] = await PlatformConfigSchema.find(params)
				.select(fieldsToRetreive)
				.populate([
					{
						path: "hiringProcessEmailTemplates.language",
						select: ["_id", "name"],
						model: "AllowedPlatformLanguage",
						strictPopulate: false,
					},
					{
						path: "hiringProcessEmailTemplates.templates.type",
						select: ["_id", "name"],
						model: "HiringProcessEmailType",
						strictPopulate: false,
					},
				]);
			return {
				code: "success",
				detail: dbResult.map((result) => this.formatReturningObject(result)),
			};
		} catch (ex) {
			throw ex;
		}
	}

	private async insert(workingObj: PlatformConfigModelInterface): Promise<any> {
		try {
			this.dbDocument = new PlatformConfigSchema({
				...workingObj,
				creationTimestamp: Date.now(),
			});
			const result = await this.dbDocument.save({ validateBeforeSave: true });
			return {
				actionPerformed: "dataCreation",
				result: result._id,
			};
		} catch (ex) {
			throw new DataBaseErrorHandling(ex, PlatformConfigSchema.name, DataBaseActions.insert);
		}
	}

	private async update(
		workingObject: PlatformConfigDocumentInterface,
		newObject: PlatformConfigModelInterface
	): Promise<any> {
		try {
			// workingObject.smsMarketingCampaignMessage =
			//   newObject.smsMarketingCampaignMessage;
			// workingObject.smsMarketingCampaignPhoneNumber =
			//   newObject.smsMarketingCampaignPhoneNumber;
			workingObject.companyName = newObject.companyName;
			workingObject.companyDescriptionForCandidates = newObject.companyDescriptionForCandidates;
			workingObject.whatsappNumber = newObject.whatsappNumber;
			workingObject.whatsappMessage = newObject.whatsappMessage;
			workingObject.socialSecurityPercentage = newObject.socialSecurityPercentage;
			workingObject.maxQuantityOfInterviewsPerHour = newObject.maxQuantityOfInterviewsPerHour;
			workingObject.mainPlatformLogo = newObject.mainPlatformLogo || workingObject.mainPlatformLogo;
			workingObject.footerPlatformLogo = newObject.footerPlatformLogo || workingObject.footerPlatformLogo;
			workingObject.hiringProcessEmailTemplates = newObject.hiringProcessEmailTemplates;
			workingObject.favIco = newObject.favIco || workingObject.favIco;
			workingObject.employeeTerminationActions = newObject.employeeTerminationActions;
			workingObject.quantityOfDaysPerMonth =
				newObject.quantityOfDaysPerMonth || workingObject.quantityOfDaysPerMonth;
			workingObject.holidays = newObject.holidays;
			// workingObject.workingDays = newObject.workingDays || workingObject.workingDays;
			workingObject.hiringProcessCcEmails = newObject.hiringProcessCcEmails;
			workingObject.agentEditionTemplateUrl =
				newObject.agentEditionTemplateUrl || workingObject.agentEditionTemplateUrl;
			workingObject.candidateEditionTemplateUrl =
				newObject.candidateEditionTemplateUrl || workingObject.agentEditionTemplateUrl;
			workingObject.minimumMonthsToReapply = newObject.minimumMonthsToReapply;
			workingObject.vacationRequestPolicy = newObject.vacationRequestPolicy;
			workingObject.vacationIncrementPerMonthWorked = newObject.vacationIncrementPerMonthWorked;
			workingObject.accumulatedVacationDaysNotificationThreshold =
				newObject.accumulatedVacationDaysNotificationThreshold;
			workingObject.autoRejectVacation = newObject.autoRejectVacation;
			workingObject.publicApiKey = newObject.publicApiKey;
			workingObject.lastModificationBy = newObject.lastModificationBy;
			workingObject.lastModificationTimestamp = Date.now();

			workingObject.markModified(PlatformConfigSchema.modelName);
			const result = await workingObject.save();
			return {
				actionPerformed: "dataModification",
			};
		} catch (ex) {
			throw new DataBaseErrorHandling(ex, PlatformConfigSchema.name, DataBaseActions.update);
		}
	}

	private async validateEmailTemplates(newObject: PlatformConfigModelInterface): Promise<void> {
		let dbResult = await PlatformConfigSchema.findOne();

		if (!dbResult || !dbResult.hiringProcessEmailTemplates) {
			throw new Error("No email templates were found in the database.");
		}

		newObject.hiringProcessEmailTemplates.forEach((newTemplate) => {
			const { language, templates } = newTemplate;

			let languageTemplate = dbResult.hiringProcessEmailTemplates.find(
				(template) => template.language === language
			);

			if (!languageTemplate) {
				languageTemplate = { language, templates: [] };
				dbResult.hiringProcessEmailTemplates.push(languageTemplate);
			}

			templates.forEach((template) => {
				const { type } = template;

				let existingTemplate = languageTemplate.templates.find((t) => t.type === type);

				if (!existingTemplate) {
					languageTemplate.templates.push(template);
				}
			});
		});
	}

	private formatReturningObject(payload: PlatformConfigDocumentInterface): PlatformConfigModelInterface {
		return {
			_id: payload._id,
			companyName: payload.companyName,
			companyDescriptionForCandidates: payload.companyDescriptionForCandidates,
			whatsappNumber: payload.whatsappNumber,
			whatsappMessage: payload.whatsappMessage,
			socialSecurityPercentage: payload.socialSecurityPercentage,
			maxQuantityOfInterviewsPerHour: payload.maxQuantityOfInterviewsPerHour,
			environment: payload.environment,
			mainPlatformLogo: payload.mainPlatformLogo,
			footerPlatformLogo: payload.footerPlatformLogo,
			favIco: payload.favIco,
			appTitle: payload.appTitle,
			marketingEmailSenderBotLogo: payload.marketingEmailSenderBotLogo,
			marketingEmailSenderBotTemplate: payload.marketingEmailSenderBotTemplate,
			marketingEmailSenderBotFromAddress: payload.marketingEmailSenderBotFromAddress,
			marketingEmailSenderBotSubject: payload.marketingEmailSenderBotSubject,
			accumulatedVacationDaysNotificationThreshold: payload.accumulatedVacationDaysNotificationThreshold,
			hiringProcessEmailTemplates: payload.hiringProcessEmailTemplates,
			employeeTerminationActions: payload.employeeTerminationActions,
			hiringProcessCcEmails: payload.hiringProcessCcEmails,
			agentEditionTemplateUrl: payload.agentEditionTemplateUrl,
			candidateEditionTemplateUrl: payload.candidateEditionTemplateUrl,
			minimumMonthsToReapply: payload.minimumMonthsToReapply,
			quantityOfDaysPerMonth: payload.quantityOfDaysPerMonth,
			holidays: payload.holidays,
			autoRejectVacation: payload.autoRejectVacation,
			vacationRequestPolicy: payload.vacationRequestPolicy,
			vacationIncrementPerMonthWorked: payload.vacationIncrementPerMonthWorked,
			usingUDC: payload.usingUDC,
			publicApiKey: payload.publicApiKey,
			createdBy: payload.createdBy,
			creationTimestamp: payload.creationTimestamp,
			lastModificationBy: payload.lastModificationBy,
			lastModificationTimestamp: payload.lastModificationTimestamp,
		};
	}
}
