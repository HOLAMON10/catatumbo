import { ServiceResultInterface } from '../service-result.interface';

export interface EmailSenderServiceInterface {
  Send( to: string,
        subject: string,
        htmlBody: string,
        senderName:string,
        senderEmail :string): Promise<ServiceResultInterface>;
 
}
