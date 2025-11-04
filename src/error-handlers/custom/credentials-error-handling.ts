import { BaseError } from './base-error';

class CredentialsErrorHandling extends BaseError {
    constructor(message: string) {
        super('CREDENTIALS ERROR',
            message
        );
        Error.captureStackTrace(this, this.constructor);
    }
}

export {
    CredentialsErrorHandling
};
