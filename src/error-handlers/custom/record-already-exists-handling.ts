import { BaseError } from './base-error';

export class RecordAlreadyCreatedHandling extends BaseError {
   constructor(message: string) {
      super('RECORD ALREADY CREATED', message);
      Error.captureStackTrace(this, this.constructor);
   }
}
