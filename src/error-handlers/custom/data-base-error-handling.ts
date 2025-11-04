import { BaseError } from './base-error';
import { EmailSenderService } from '../notification-sender/email-sender.service';

class DataBaseErrorHandling extends BaseError {
    constructor(message: string, dbModel: string, dbActionPerformed?: string) {
        super(
            'DB ERROR',
            JSON.stringify({
                dbModel,
                dbActionPerformed,
                detail: message
            })
        );
        Error.captureStackTrace(this, this.constructor);
    }
}

class DataBaseActions {
    public static delete = 'delete';
    public static find = 'find';
    public static findById = 'findById';
    public static findOne = 'findOne';
    public static insert = 'insert';
    public static update = 'update';
}

export { DataBaseActions, DataBaseErrorHandling };
