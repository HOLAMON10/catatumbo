import { CommonFunctions } from '../common';
import { HttpStatusCode } from './httpStatusCode';

import { EmailSenderService } from './notification-sender/email-sender.service';

export const handleErrorResponse = async (ex, res) => {
  if (!isHandleError(ex.name) && !process.env.DEV_ENVIRONMENT) {
    new EmailSenderService().SendException(
      `Not handle exception - [UDC.ADMIN db-conn]`,
      ex
    );
  }

  // handling errors types
  let resStatus = 500;
  switch (ex.name) {
    case 'CREDENTIALS ERROR':
      resStatus = HttpStatusCode.UNATHORIZED;
      break;
    case 'DB ERROR':
      resStatus = HttpStatusCode.INTERNAL_SERVER;
      break;
    case 'MACHINARY GEAR NOT FOUND':
    case 'MACHINARY NOT FOUND':
    case 'NOT FOUND DATA':
      resStatus = HttpStatusCode.NOT_FOUND;
      break;
    case 'RECORD ALREADY CREATED':
    case 'VALIDATION ERROR':
      resStatus = HttpStatusCode.BAD_REQUEST;
      break;
    default:
      resStatus = HttpStatusCode.INTERNAL_SERVER;
      break;
  }
  let errorDetails: any | string = ex.message.split(`${ex.name}: `)[0];
  if (CommonFunctions.isValidJSON(errorDetails)) {
    errorDetails = JSON.parse(errorDetails);
  }

  res.status(resStatus).send({ code: ex.name, detail: errorDetails });
  return;
};

const isHandleError = (errorName: string): boolean => {
  switch (errorName) {
    case 'CREDENTIALS ERROR':
    case 'DB ERROR':
    case 'INTERNAL_SERVER':
    case 'MACHINARY GEAR NOT FOUND':
    case 'MACHINARY NOT FOUND':
    case 'MORIARTY ECONNREFUSED':
    case 'NOT FOUND DATA':
    case 'RECORD ALREADY CREATED':
    case 'VALIDATION ERROR':
      return true;
    default:
      return false;
  }
};
