import Axios from 'axios';
import { PrintColorType } from '../enums/print-color-type.enum';
import { CommonFunctions } from '../common';
import {
  MachinaryGearNotFoundErrorHandling,
  MachinaryNotFoundErrorHandling,
  MoriartyConnectionErrorHandling,
  MoriartyValidationErrorHandling
} from './error';


export const getGearAuthInfo = async (): Promise<any> => {
  global.gearInfo = {
    token: process.env.AUTH_TOKEN,
    secret: process.env.SECRET_TOKEN
  }
}

// export const getGearAuthInfo = async (): Promise<any> => {
//   try {
//     global.gearFactory = {};
//     CommonFunctions.printConsoleColor('-> authenticating Gear', PrintColorType.grey, true);
//     //authenticating current gear in moriarty
//     const gearResponse = await (await Axios(
//       {
//         method: 'POST',
//         url: `${process.env.ARCHITECT_URL}machinarygears/auth`,
//         headers: {
//           authorization: CommonFunctions.generateToken(
//             { token: process.env.ARCHITECT_AUTH_CODE },
//             process.env.ARCHITECT_SECRET_KEY,
//             Number(process.env.AUTH_TOKEN_DURATION_MS)
//           ),
//         },
//         data: {
//           publicKey: process.env.GEAR_KEY
//         }
//       }
//     )).data;
//     if (!gearResponse) {
//       throw new MachinaryGearNotFoundErrorHandling('this gear is not register in moriarty')
//     }
//     const rawGearInfo = CommonFunctions.decryptAesHashData(
//       gearResponse
//     )
//     if (!CommonFunctions.isValidJSON(rawGearInfo)) {
//       throw new MachinaryGearNotFoundErrorHandling('architect\'s response is not a valid json')
//     }
//     global.gearInfo = JSON.parse(rawGearInfo);
//     CommonFunctions.printConsoleColor('-> this Gear has been authenticated successfully', PrintColorType.info, true);
//   } catch (ex) {
//     processAbsqueApisErrors(
//       ex.response?.data ?
//         ex.response.data :
//         ex
//     );
//   }
// }

const processAbsqueApisErrors = (exception: any) => {
  switch (exception.code) {
    case 'MACHINARY GEAR NOT FOUND':
      throw new MachinaryGearNotFoundErrorHandling(
        `Machinary Gear not found in Moriarty`);
    case 'MACHINARY NOT FOUND':
      throw new MachinaryNotFoundErrorHandling(
        `Machinary not found to Moriarty`);
    case 'ECONNREFUSED':
      throw new MoriartyConnectionErrorHandling(
        exception.detail || 'gear cannot connect to Moriarty'
      );
    case 'MORIARTY ERROR - MACHINARY NOT FOUND':
      throw new MachinaryNotFoundErrorHandling(
        exception.detail ? exception.detail : `Machinary Gear not in Moriarty`);
    default:
      throw new MoriartyValidationErrorHandling(exception.message)
  }
}

const processAxiosError = (error: any): string => {
  const { code, config, response } = error;
  switch (code) {
    case 'ERR_BAD_REQUEST':
      return JSON.stringify(error.response.data);
    default:
      return `${code} - ${error.message ? error.message + '-' : ''} ${config ? config.url : ''}`;

  }
}
