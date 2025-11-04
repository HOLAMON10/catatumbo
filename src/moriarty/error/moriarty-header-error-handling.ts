import { MoriartyBaseError } from './moriarty-base-error';

class MoriartyHeaderErrorHandling extends MoriartyBaseError {
    constructor(message: string) {
        super('MORIARTY HEADER NOT FOUND',
            message
        );
        Error.captureStackTrace(this, this.constructor);
    }
}

export {
    MoriartyHeaderErrorHandling
};
