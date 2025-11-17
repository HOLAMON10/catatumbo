import * as CryptoJS from 'crypto-js';
import * as jwt from 'jsonwebtoken';
import * as Moment from 'moment';
import * as mongodb from 'mongodb';
import { PrintColorType } from '../enums/print-color-type.enum';
import { Response } from 'express';

const ObjectID = mongodb.ObjectID;

import * as Chalk from 'chalk';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import moment = require('moment');

export class CommonFunctions {
    public constructor() {}

    public static PrintConsoleColor(message: any, messageType: PrintColorType, setEmptyLineAfter: boolean = false): void {
        if (messageType !== null) {
            switch (messageType) {
                case PrintColorType.info:
                    console.log(Chalk.blueBright(message));
                    break;
                case PrintColorType.error:
                    console.log(Chalk.redBright(message));
                    break;
                case PrintColorType.success:
                    console.log(Chalk.green(message));
                    break;
                case PrintColorType.warning:
                    console.log(Chalk.cyan(message));
                    break;
                case PrintColorType.white:
                    console.log(Chalk.white(message));
                    break;
                case PrintColorType.grey:
                    console.log(Chalk.grey(message));
                    break;
                case PrintColorType.yellow:
                    console.log(Chalk.yellow(message));
                    break;
                default:
                    console.log(Chalk.grey(message));
                    break;
            }
        } else {
            console.log(message);
        }
        if (setEmptyLineAfter) {
            console.log();
        }
    }

    // create the params list to make a search by proximity
    // params:
    //  - params: array of paramaters to use
    // returns:
    // - json params list
    public static buildQueryParams(params: any): {} {
        try {
            let paramObject: {} = new Object();
            if (params) {
                let keys = Object.keys(params);
                for (let i in keys) {
                    if (ObjectID.isValid(params[keys[i]])) {
                        paramObject[keys[i]] = params[keys[i]];
                    } else {
                        switch (typeof params[keys[i]]) {
                            case 'boolean':
                                paramObject[keys[i]] = Boolean(params[keys[i]]);
                                break;
                            case 'number': {
                                paramObject[keys[i]] = Number(new RegExp(params[keys[i]]));
                                break;
                            }
                            case 'string': {
                                paramObject[keys[i]] = { $regex: params[keys[i]], $options: 'i' };
                                break;
                            }
                            case 'object': {
                                let filters: Array<any> = [];
                                for (let index: number = 0; index < params[keys[i]].length; index++) {
                                    filters.push(params[keys[i]][index]);
                                }
                                paramObject[keys[i]] = { $in: filters };
                                break;
                            }
                            default: {
                                if (params[keys[i]] instanceof Date) {
                                    paramObject[keys[i]] = new Date(new RegExp(params[keys[i]]).toString());
                                    break;
                                }
                                paramObject[keys[i]] = new RegExp(params[keys[i]]);
                                break;
                            }
                        }
                    }
                }
            }
            return paramObject;
        } catch (ex) {
            throw Error(ex.message);
        }
    }

    // generate a UUID (universally unique identifier)
    // params:
    //  - useDash: boolean value to indicate if must use a dash ("-") inside the UUID
    // returns:
    // - UUID string
    public static generateUUID(useDash: boolean): string {
        var date = new Date().getTime();
        var uuid = useDash
            ? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            : 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                  var r = (date + Math.random() * 16) % 16 | 0;
                  date = Math.floor(date / 16);
                  return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
              });
        return uuid;
    }
    public static generateToken(payload: any, secretKey?: string, durationTimeIn_ms?: number) {
        try {
            const sKey = secretKey ? secretKey : process.env.AUTH_SECRET_KEY;
            if (durationTimeIn_ms) {
                return jwt.sign(payload, sKey, {
                    expiresIn: durationTimeIn_ms.toString(),
                });
            }
            return jwt.sign(payload, sKey);
        } catch (ex) {
            return ex.message;
        }
    }

    // transforms a word"s first letter into a uppercase letter
    // params:
    //  - word: string to transform
    // returns:
    // - string
    public static setCapitalLetter(word: string): string {
        return word[0].toUpperCase() + word.substring(1, word.length);
    }

    // converts a date/time string into milisecods using moment js
    // params:
    //  - dateTimeString: date/time string
    //	-	dateTimeType: type of data string
    //		*	date
    //		* time
    //		*	dateTime
    // returns:
    // - number
    public static convertTimeToMilliseconds(dateTimeString: string, dateTimeType: string): number {
        let momentObj: any;
        switch (dateTimeType) {
            case 'date':
                momentObj = Moment(dateTimeString, 'YYYY-MM-DD');
                break;
            case 'time':
                if (dateTimeString.length === 5) {
                    dateTimeString += ':00';
                }
                momentObj = Moment(dateTimeString, 'HH:mm:ss');
                break;
            case 'dateTime':
                momentObj = Moment(dateTimeString, 'YYYY-MM-DD HH-mm Z');
                break;
        }
        return Number(momentObj.format('x'));
    }

    // converts a millisecods into date/time object using moment js
    // params:
    //  - mls: milliseconds number
    //	-	dateFormat: type of data string
    // returns:
    // - string
    public static convertMillisecondsToTime(mls: number, dateFormat: string) {
        return Moment(mls).format(dateFormat);
    }

    public static processEndpointException(res: Response, ex: any) {
        const processedError: Error = ex,
            errorType: string = processedError.stack
                ? JSON.stringify(processedError.stack).split(':')[1].toLowerCase().trim()
                : '';
        return res.status(errorType === 'validationerror' ? 400 : 500).send({
            code: 'error',
            detail: ex.code ? ex.detail : ex.message,
        });
    }

    public static isValidJSON(payload: string): boolean {
        try {
            JSON.parse(payload);
            return true;
        } catch (ex) {
            return false;
        }
    }

    public static printConsoleColor(
        message: any,
        messageType: PrintColorType = null,
        setEmptyLineAfter: boolean = false
    ): void {
        if (messageType !== null) {
            switch (messageType) {
                case PrintColorType.info:
                    console.log(Chalk.blueBright(message));
                    break;
                case PrintColorType.error:
                    console.log(Chalk.redBright(message));
                    break;
                case PrintColorType.success:
                    console.log(Chalk.green(message));
                    break;
                case PrintColorType.warning:
                    console.log(Chalk.cyan(message));
                    break;
                case PrintColorType.white:
                    console.log(Chalk.white(message));
                    break;
                case PrintColorType.grey:
                    console.log(Chalk.grey(message));
                    break;
                case PrintColorType.yellow:
                    console.log(Chalk.yellow(message));
                    break;
                default:
                    console.log(Chalk.grey(message));
                    break;
            }
        } else {
            console.log(message);
        }
        if (setEmptyLineAfter) {
            console.log();
        }
    }

    public static substractMonths(date: Date, months: number) {
        const newDate = moment(date).add(months * -1, 'months');
        return newDate;
    }


    public static createHashData(payload: any): string {
        try {
            return CryptoJS.SHA256(JSON.stringify(payload)).toString();
        } catch (error) {
            throw error;
        }
    }

    public static createEncKey(): string {
        const crypto = require('crypto');
        return crypto.randomBytes(16).toString('hex');
    }

    public static encryptAesHashData(payload: any): string {
        try {
            const key = CommonFunctions.createEncKey();
            const iv = CommonFunctions.createEncKey();
            const encrypted = CryptoJS.AES.encrypt(payload, CryptoJS.enc.Utf8.parse(key), {
                iv: CryptoJS.enc.Utf8.parse(iv),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            });
            return `${key}${iv}${encrypted.toString()}`;
        } catch (ex) {
            throw ex;
        }
    }

    public static decryptAesHashData(encryptedData: string): any {
        try {
            const decrypted = CryptoJS.AES.decrypt(
                encryptedData.substring(64),
                CryptoJS.enc.Utf8.parse(encryptedData.substring(0, 32)),
                {
                    iv: CryptoJS.enc.Utf8.parse(encryptedData.substring(32, 64)),
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7,
                }
            );
            return decrypted.toString(CryptoJS.enc.Utf8) as any;
        } catch (ex) {
            throw ex;
        }
    }
}
