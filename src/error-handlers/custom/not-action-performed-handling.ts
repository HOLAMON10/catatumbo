import { BaseError } from './base-error';

export class NotActionPerformedHandling extends BaseError {
    constructor(message: string) {
        super(
            'NO ACTION PERFORMED',
            message
        );
        Error.captureStackTrace(this, this.constructor);
    }
}
