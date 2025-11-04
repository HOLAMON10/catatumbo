import { MoriartyBaseError } from './moriarty-base-error';

class MoriartyValidationErrorHandling extends MoriartyBaseError {
    constructor(message: string) {
        super('MORIARTY VALIDATION ERROR',
            message
        );
        Error.captureStackTrace(this, this.constructor);
    }
}

export {
    MoriartyValidationErrorHandling
};
