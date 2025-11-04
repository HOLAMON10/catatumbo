import * as MailService from '@sendgrid/mail';
import { content as mailTemplate } from './unhandle-error.template.html';
import { CommonFunctions } from '../../common';
import { PrintColorType } from '../../enums/print-color-type.enum';

export class EmailSenderService {

  //#region Public Properties

  public SendException = this.sendException;

  //#endregion

  public constructor() { }

  private async sendException(subject: string, errorDescription: string): Promise<void> {
    if (!process.env.DEV_ENVIRONMENT) {
      try {
        const absquesoftEmailTemplate = await this.createMailTemplate(errorDescription);

        MailService.setApiKey(process.env.SENDGRID_API_KEY || '');
        // sending email to absquesoft
        await MailService.send({
          to: process.env.SUPPORT_STAKE_HOLDER_EMAIL_ADDRESS || '',
          from: process.env.SEND_CONTACT_EMAIL_FROM || '',
          subject: subject,
          html: absquesoftEmailTemplate,
        }, false,
          (error: any, result: any) => {
            if (error) {
              return {
                code: 'error',
                detail: 'mail not sended'
              };
            } else {
              return {
                code: 'success',
                detail: 'mail sended'
              };
            }
          });
      } catch (ex) {
        throw new Error(JSON.stringify({
          code: 'error',
          detail: 'mail not sended'
        }));
      }
    } else {
      CommonFunctions.printConsoleColor('--  DEV ENVIRONMENT --', PrintColorType.warning);
      CommonFunctions.printConsoleColor('error email notification', PrintColorType.grey);
      CommonFunctions.printConsoleColor(`subject: ${subject}`, PrintColorType.info);
      CommonFunctions.printConsoleColor(`errorDescription: ${errorDescription}`, PrintColorType.info);
      CommonFunctions.printConsoleColor('-- EO DEV ENVIRONMENT --', PrintColorType.warning);
    }
  }

  //#region Private Functions

  private async createMailTemplate(errorDescription: string): Promise<string> {
    let mailtemplate = mailTemplate;
    //set client data
    return mailtemplate
      .replace('{{errorDate}}', new Date().toUTCString())
      .replace('{{errorDescription}}', errorDescription);
  }

  //#endregion
}
