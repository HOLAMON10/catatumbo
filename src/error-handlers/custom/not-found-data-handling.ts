import { BaseError } from './base-error';

export class NotFoundDataHandling extends BaseError {
    constructor(message) {
        super('NOT FOUND DATA',
            message
        );
        Error.captureStackTrace(this, this.constructor);
    }
}
