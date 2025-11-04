declare module 'params-verifier' {
  interface FieldOptions {
    required?: boolean;
    stringNoEmpty?: boolean;
    validatorErrMsg?: string;
    typeErrMsg?: string;
  }

  class Validator {
    constructor(
      workingObject: Record<string, any>,
      type?: string,
      options?: FieldOptions
    );

    field(
      fieldName: string,
      type: string,
      options?: FieldOptions
    ): Validator;

    verify?(): boolean;
    validate?(): boolean;
  }

  export = Validator;
}
