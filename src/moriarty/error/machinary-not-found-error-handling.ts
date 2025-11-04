import { MoriartyBaseError } from './moriarty-base-error';

export class MachinaryNotFoundErrorHandling extends MoriartyBaseError {
    constructor(message: string) {
        super('MACHINARY NOT FOUND', message);
        Error.captureStackTrace(this, this.constructor);
    }
}
