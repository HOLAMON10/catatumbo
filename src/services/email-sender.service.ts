import { injectable } from "inversify";
import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { EmailSenderServiceInterface } from "src/interfaces/services";
@injectable()
export class EmailService implements EmailSenderServiceInterface {
    public Send = this.sendEmail
    private apiInstance: any;

    public constructor() {
        const client = SibApiV3Sdk.ApiClient.instance;
        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.EMAIL_KEY;

        this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    }

    /**
     * Sends an email using Brevo Transactional API
     */
    public async sendEmail(
        to: string,
        subject: string,
        htmlBody: string,
        senderName :string = "Catatumbo",
        senderEmail :string= "jmcardozo.q@gmail.com"
    ): Promise<any> {
        try {
            const email = {
                sender: { name: senderName, email: senderEmail },
                to: [{ email: to }],
                subject: subject,
                htmlContent: htmlBody,
            };

            const result = await this.apiInstance.sendTransacEmail(email);

            return {
                code: "success",
                detail: result,
            };
        } catch (error) {
            return {
                code: "error",
                detail: error,
            };
        }
    }
}
