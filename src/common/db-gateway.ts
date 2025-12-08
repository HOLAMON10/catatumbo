import * as _ from 'lodash';
import * as mongoose from 'mongoose';

import { CommonFunctions } from './common-functions';
import { PrintColorType } from '../enums/print-color-type.enum';

export class DBGateway {
	public static async testDBConnection() {
		try {
			CommonFunctions.PrintConsoleColor(' • connecting to DB ...', PrintColorType.grey);

			const dbUrl = process.env.MONGODB_URL as string;
			const dbName = dbUrl.split('/')[dbUrl.split('/').length - 1];

			// Modern Mongoose connect() returns a Promise
			await mongoose
				.connect(dbUrl)
				.then(() => {
					CommonFunctions.PrintConsoleColor(` • connected to database ${dbName}`, PrintColorType.success);
				})
				.catch((err: any) => {
					CommonFunctions.PrintConsoleColor(
						` ~ error connecting to database ${dbName}`,
						PrintColorType.error
					);
					CommonFunctions.PrintConsoleColor(`   -> ${err}`, PrintColorType.grey);
				});

			mongoose.disconnect();
		} catch (ex: any) {
			const dbName = process.env.MONGODB_URL?.split('/')[process.env.MONGODB_URL.split('/').length - 1];

			CommonFunctions.PrintConsoleColor(` ~ error connecting to database ${dbName}`, PrintColorType.error);
			CommonFunctions.PrintConsoleColor(`   -> ${ex}`, PrintColorType.grey);
		}
	}

	public static async connect() {
		try {
			CommonFunctions.PrintConsoleColor(' • connecting to DB ...', PrintColorType.grey);

			const dbUrl = process.env.MONGODB_URL as string;
			const dbName = dbUrl.split('/')[dbUrl.split('/').length - 1];

			await mongoose
				.connect(dbUrl)
				.then(() => {
					CommonFunctions.PrintConsoleColor(` • connected to database ${dbName}`, PrintColorType.success);
				})
				.catch((err: any) => {
					CommonFunctions.PrintConsoleColor(
						` ~ error connecting to database ${dbName}`,
						PrintColorType.error
					);
					console.log('value :>> ', err);
				});
		} catch (ex: any) {
			const dbName = process.env.MONGODB_URL?.split('/')[(process.env.MONGODB_URL || '').split('/').length - 1];

			console.log('ex :>> ', ex);
			CommonFunctions.PrintConsoleColor(` ~ error connecting to database ${dbName}`, PrintColorType.error);
			CommonFunctions.PrintConsoleColor(`   -> ${ex}`, PrintColorType.grey);
		}
	}

	public static async disconnect(): Promise<void> {
		try {
			mongoose.disconnect();
		} catch (ex) {
			CommonFunctions.PrintConsoleColor(' ~ error disconnecting DB connection...', PrintColorType.error);
			CommonFunctions.PrintConsoleColor(`   -> ${ex}`, PrintColorType.grey);
		}
	}

	public static mapMongooseErrorObject(mongooseError: any) {
		try {
			let errorObj = {
				code: 'success',
				detail: {
					errors: [],
				},
			};
			_.forEach(Object.keys(mongooseError), (key) => {
				if (key === 'errors') {
					_.forEach(Object.keys(mongooseError[key]), (keyErrors) => {
						errorObj.detail.errors.push(mongooseError[key][keyErrors].message);
					});
				}
			});
			return errorObj;
		} catch (ex) {
			return {
				code: 'error',
				detail: {
					technicalMessage: ex.message,
				},
			};
		}
	}
}
