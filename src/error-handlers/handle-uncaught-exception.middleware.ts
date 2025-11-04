
import { NextFunction, Request, Response } from 'express';
import { EmailSenderService } from './notification-sender';

export function handleUncaughtExceptionMiddleware(req: Request, res: Response, next: NextFunction) {
    process.once('uncaughtException', async (err) => {
        if (!process.env.DEV_ENVIRONMENT) {
            await new EmailSenderService()
                .SendException(
                    `Not handle exception - [UDC.CONSUMER]`,
                    `${err.name} - ${err.message}`
                );
        }
        res.status(500).send(err);
        return process.exit(0);
    });
    next();
};
