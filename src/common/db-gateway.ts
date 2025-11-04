import * as _ from 'lodash';
import * as mongoose from 'mongoose';

import { CommonFunctions } from './common-functions';
import { PrintColorType } from '../enums/print-color-type.enum';

export class DBGateway {
	public static async testDBConnection() {
		try {
			CommonFunctions.PrintConsoleColor(' • connecting to DB ...', PrintColorType.grey);
			mongoose.connect(process.env.MONGODB_URL, (value: any) => {
				if (value) {
					CommonFunctions.PrintConsoleColor(
						` ~ error connecting to database ${
							process.env.MONGODB_URL.split('/')[
								process.env.MONGODB_URL.split('/').length - 1
							]
						}`,
						PrintColorType.error
					);
					return;
				}
				CommonFunctions.PrintConsoleColor(
					` • connected to database ${
						process.env.MONGODB_URL.split('/')[
							process.env.MONGODB_URL.split('/').length - 1
						]
					}`,
					PrintColorType.success
				);
				mongoose.disconnect();
			});
			// .catch((reason: any) => {
			// 	CommonFunctions.PrintConsoleColor(
			// 		' ~ database ...',
			// 		PrintColorType.error
			// 	);
			// 	CommonFunctions.PrintConsoleColor(`   -> ${reason}`, PrintColorType.grey);
			// });
		} catch (ex) {
			CommonFunctions.PrintConsoleColor(
				` ~ error connecting to database ${
					process.env.MONGODB_URL.split('/')[
						process.env.MONGODB_URL.split('/').length - 1
					]
				}`,
				PrintColorType.error
			);
			CommonFunctions.PrintConsoleColor(`   -> ${ex}`, PrintColorType.grey);
		}
	}

	public static connect() {
		try {
			CommonFunctions.PrintConsoleColor(' • connecting to DB ...', PrintColorType.grey);
			mongoose.connect(process.env.MONGODB_URL, (value: any) => {
				if (value) {
					console.log('value :>> ', value);
					CommonFunctions.PrintConsoleColor(
						` ~ error connecting to database ${
							process.env.MONGODB_URL.split('/')[
								process.env.MONGODB_URL.split('/').length - 1
							]
						}`,
						PrintColorType.error
					);
					return;
				}
				CommonFunctions.PrintConsoleColor(
					` • connected to database ${
						process.env.MONGODB_URL.split('/')[
							process.env.MONGODB_URL.split('/').length - 1
						]
					}`,
					PrintColorType.success
				);
			});
			// .catch((reason: any) => {
			// 	CommonFunctions.PrintConsoleColor(
			// 		' ~ database ...',
			// 		PrintColorType.error
			// 	);
			// 	CommonFunctions.PrintConsoleColor(`   -> ${reason}`, PrintColorType.grey);
			// });
		} catch (ex) {
			console.log('ex :>> ', ex);
			CommonFunctions.PrintConsoleColor(
				` ~ error connecting to database ${
					process.env.MONGODB_URL.split('/')[
						process.env.MONGODB_URL.split('/').length - 1
					]
				}`,
				PrintColorType.error
			);
			CommonFunctions.PrintConsoleColor(`   -> ${ex}`, PrintColorType.grey);
		}
	}

	public static async disconnect(): Promise<void> {
		try {
			mongoose.disconnect();
		} catch (ex) {
			CommonFunctions.PrintConsoleColor(
				' ~ error disconnecting DB connection...',
				PrintColorType.error
			);
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
