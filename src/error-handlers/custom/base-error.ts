// processing error message
const processErrorMsg = (message: any): string => {
    if (typeof message === 'object') {
        return JSON.stringify(message);
    } else {
        if (typeof message !== 'string') {
            return message.tostring();
        }
    }
    return message;
};

export class BaseError extends Error {
    constructor(
        name: string,
        message: any,
    ) {
        super(processErrorMsg(message));
        this.name = name || this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}