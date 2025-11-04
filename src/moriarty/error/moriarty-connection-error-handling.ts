import { MoriartyBaseError } from './moriarty-base-error';

export class MoriartyConnectionErrorHandling extends MoriartyBaseError {
    constructor(message: string) {
        super('MORIARTY ECONNREFUSED', message);
        Error.captureStackTrace(this, this.constructor);
    }
}
