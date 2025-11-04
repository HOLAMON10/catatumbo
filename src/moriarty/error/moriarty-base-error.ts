export class MoriartyBaseError extends Error {
  constructor(
    name: string,
    message: string,
  ) {
    super(message);
    this.name = name || this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
