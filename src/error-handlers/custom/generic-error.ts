import { BaseError } from './base-error';

export class GenericError extends BaseError {
    constructor(message: string,) {
        super('GENERIC ERROR',
            message
        );
        Error.captureStackTrace(this, this.constructor);
    }
}
