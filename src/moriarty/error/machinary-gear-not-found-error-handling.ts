import { MoriartyBaseError } from './moriarty-base-error';

export class MachinaryGearNotFoundErrorHandling extends MoriartyBaseError {
    constructor(message: string) {
        super('MACHINARY GEAR NOT FOUND', message);
        Error.captureStackTrace(this, this.constructor);
    }
}
