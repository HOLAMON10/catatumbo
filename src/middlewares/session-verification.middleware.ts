import * as jwt from 'jsonwebtoken';
import { jwtDecode } from "jwt-decode";

import { NextFunction, Request, Response } from 'express';

const freeAccessPaths = [
	'/health',
	'/auth/verifycredentials',
	'/auth/verifytoken',
	'/auth/changepassword',
	'/auth/createrecoverypasswordtoken',
];

const verifyToken = (token: string): boolean => {
	try {
		jwt.verify(token, global.gearInfo.secret);
		return true;
	} catch (ex) {
		throw ex;
	}
};

const verifyAuthorizationCode = (req: Request, res: Response, next: NextFunction) => {
	try {
		for (const path of freeAccessPaths) {
			if (req.path.startsWith(path)) {
				return next();
			}
		}
		if (!req.headers['authorization']) {
			return res.status(401).send({
				code: 'unauthorized',
				detail: 'not authorized',
			});
		}


		if (verifyToken(req.headers['authorization'])) {
			const sessionToken =
				(jwtDecode(req.headers['authorization']) as any).token ||
				(jwtDecode(req.headers['authorization']) as any).user;
							console.log('here',sessionToken)

			if (!sessionToken) {
				return res.status(401).send({
					code: 'unauthorized',
					detail: 'not authorized',
				});
			}

			if (sessionToken !== global.gearInfo.token) {
				return res.status(403).send({
					code: 'forbidden',
					detail: 'the authorization code is not valid',
				});
			}

			return next();
		}

		return res.status(403).send({
			code: 'forbidden',
			detail: 'the authorization code is not valid',
		});
	} catch (ex) {
		return res.status(403).send({
			code: 'forbidden',
			detail: 'the authorization code is not valid',
		});
	}
};

export default verifyAuthorizationCode;
