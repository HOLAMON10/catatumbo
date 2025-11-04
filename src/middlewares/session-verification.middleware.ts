import * as jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';

import { NextFunction, Request, Response } from 'express';

const freeAccessPaths = [
  'health',
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
    if (!req.headers['authorization']) {
      return res.status(401).send({
        code: 'unauthorized',
        detail: 'not authorized',
      });
    }

    if (verifyToken(req.headers['authorization'])) {
      const sessionToken = (jwt_decode(req.headers['authorization']) as any).token;
      if (!sessionToken) {
        return res.status(401).send({
          code: 'unauthorized',
          detail: 'not authorized',
        });
      }

      let notRequireSessionPath = false;
      freeAccessPaths.forEach((path) => {
        if (req.path.includes(path)) {
          notRequireSessionPath = true;
        }
      });
      if (notRequireSessionPath) {
        if (sessionToken !== global.gearInfo.token) {
          throw new Error();
        }
      } else {
        if (sessionToken !== global.gearInfo.token) {
          return res.status(403).send({
            code: 'forbidden',
            detail: 'the authorization code is not valid',
          });
        }
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
