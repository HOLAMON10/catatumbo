import { NextFunction, Request, Response } from 'express';

export function handleUncaughtExceptionMiddleware(req: Request, res: Response, next: NextFunction) {
	process.once('uncaughtException', async (err) => {
		res.status(500).send(err);
		return process.exit(0);
	});
	next();
}
