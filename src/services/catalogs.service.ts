import { injectable } from 'inversify';

import { CatalogsServiceInterface } from '../interfaces/services';
import { CatalogsValues } from '../enums';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { ValidationError } from '../error-handlers';

@injectable()
export class CatalogsService implements CatalogsServiceInterface {
    public GetAll = this.getAll;
    public GetByID = this.getByID;
    public GetCatalogsByNames = this.getCatalogsByNames;
    public Search = this.search;

    public constructor() {}

    private async getAll(catalogName: string): Promise<ServiceResultInterface> {
        try {
            const dbResult = await this.getSchema(catalogName, true).find();
            return {
                code: 'success',
                detail: dbResult,
            };
        } catch (ex) {
            throw ex;
        }
    }

    private async getByID(catalogName: string, id: string): Promise<ServiceResultInterface> {
        try {
            const dbResult = await this.getSchema(catalogName, true).findById(id);
            return {
                code: 'success',
                detail: dbResult,
            };
        } catch (ex) {
            throw ex;
        }
    }

    private async getCatalogsByNames(catalogNames: string[]): Promise<ServiceResultInterface> {
        try {
            let returnObject: any = {};
            await Promise.all(
                catalogNames.map(async (name: string) => {
                    const catalogSchema = this.getSchema(name, false);
                    if (catalogSchema) {
                        returnObject[name] = await catalogSchema.find({ isActive: true });
                    }
                })
            );
            return {
                code: 'success',
                detail: returnObject,
            };
        } catch (ex) {
            throw ex;
        }
    }

    private async search(catalogName: string, params: any, fieldsToRetreive: string[]): Promise<ServiceResultInterface> {
        try {
            let dbResult: any[] = await this.getSchema(catalogName, true).find(params).select(fieldsToRetreive);
            return {
                code: 'success',
                detail: dbResult,
            };
        } catch (ex) {
            throw ex;
        }
    }

    private getSchema(catalogName: string, throwError: boolean): any {
        let schema: any;
        switch (catalogName) {
            case CatalogsValues.allowedplatformlanguages:
                schema = require('../models/allowed-platform-language.model').default;
                break;
            case CatalogsValues.agentstatuses:
                schema = require('../models/agent-status.model').default;
                break;
            case CatalogsValues.callendedreasons:
                schema = require('../models/call-ended-reason.model').default;
                break;
            case CatalogsValues.chatbotquestiontypes:
                schema = require('../models/chatbot-question-type.model').default;
                break;
            case CatalogsValues.dashboardtypes:
                schema = require('../models/dashboard-type.model').default;
                break;
            case CatalogsValues.dashboardfiltertypes:
                schema = require('../models/dashboard-filter-types.model').default;
                break;
            case CatalogsValues.employeeassistancetypes:
                schema = require('../models/employee-assistance-type.model').default;
                break;
            case CatalogsValues.employeetypes:
                schema = require('../models/employee-type.model').default;
                break;
            case CatalogsValues.forthlistcontactstages:
                schema = require('../models/forth-list-contact-stages.model').default;
                break;
            case CatalogsValues.hermesallowedvariables:
                schema = require('../models/hermes-allowed-variable.model').default;
                break;
            case CatalogsValues.hermesbehaviortypes:
                schema = require('../models/hermes-behavior-type.model').default;
                break;
            case CatalogsValues.hermescommunicationdirectiontypes:
                schema = require('../models/hermes-communication-direction-type.model').default;
                break;
            case CatalogsValues.hermescommunicationdirectiontypes:
                schema = require('../models/hermes-communication-provider.model').default;
                break;
            case CatalogsValues.hermescommunicationresulttypes:
                schema = require('../models/hermes-communication-result-type.model').default;
                break;
            case CatalogsValues.hermescommunicationtypes:
                schema = require('../models/hermes-communication-type.model').default;
                break;
            case CatalogsValues.hiringprocessemailtypes:
                schema = require('../models/hiring-process-email-type.model').default;
                break;
            case CatalogsValues.hiringprocessemailvariables:
                schema = require('../models/hiring-process-email-variable.model').default;
                break;
            case CatalogsValues.interviewstatuses:
                schema = require('../models/interview-status.model').default;
                break;
            case CatalogsValues.interviewtypes:
                schema = require('../models/interview-type.model').default;
                break;
            case CatalogsValues.jobapplicationstatuses:
                schema = require('../models/job-application-status.model').default;
                break;
            case CatalogsValues.menuoptions:
                schema = require('../models/menu-option.model').default;
                break;
            case CatalogsValues.objecttypesforconfigurations:
                schema = require('../models/object-types-for-configuration.model').default;
                break;
            case CatalogsValues.timeoffrequeststatuses:
                schema = require('../models/time-off-request-type.model').default;
                break;
            case CatalogsValues.userpermissions:
                schema = require('../models/user-permission.model').default;
                break;
            case CatalogsValues.usertypes:
                schema = require('../models/user-type.model').default;
                break;
            default:
                if (throwError) {
                    throw new ValidationError(`the catalog ${catalogName} was not found in the schema collection`);
                } else {
                    schema = null;
                }
        }
        return schema;
    }
}
