import { BaseError } from './base-error';

export class ValidationError extends BaseError {
   constructor(message) {
      super('VALIDATION ERROR', message);
      Error.captureStackTrace(this, this.constructor);
   }
}
