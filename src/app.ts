import * as express from 'express';
import 'reflect-metadata';
import * as path from 'path';
import { InversifyExpressServer } from 'inversify-express-utils';

import { ApiContainer } from './apiConfig';
import { ConstantValues } from './constantValues';
import { allowCrossDomain, verifyAuthorizationCode } from './middlewares';
import { CommonFunctions, DBGateway } from './common';
import './controllers';
import { getGearAuthInfo } from './moriarty';
import { PlatformConfigsServiceInterface } from './interfaces/services';
import { ApiTypes } from './apiTypes';
import { PrintColorType } from './enums';

require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Create the Inversify Express server
const server = new InversifyExpressServer(ApiContainer, null, {
  rootPath: ConstantValues.root,
});

server.setConfig((app): void => {
  try {
    // Middleware setup
    app.use(allowCrossDomain);
    app.use(verifyAuthorizationCode);
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json({ limit: '250mb' }));

  

    // Authenticate with Moriarty
    (async () => {
      try {
        await getGearAuthInfo();
        CommonFunctions.printConsoleColor(
          'Gear authentication successful',
          PrintColorType.success
        );
      } catch (ex: any) {
        CommonFunctions.printConsoleColor(
          `Gear authentication failed: ${ex.message || ex}`,
          PrintColorType.error
        );
       // process.exit(1);
      }
    })();

    // Initialize Mongo connection
    mongoSetup();
  } catch (ex: any) {
    CommonFunctions.printConsoleColor(
      `Server configuration error: ${ex.message || ex}`,
      PrintColorType.error
    );
  }
});

function mongoSetup(): void {
  try {
    DBGateway.connect();
    CommonFunctions.printConsoleColor(
      'MongoDB connected successfully',
      PrintColorType.success
    );
  } catch (ex: any) {
    CommonFunctions.printConsoleColor(
      `MongoDB connection failed: ${ex.message || ex}`,
      PrintColorType.error
    );
  }
}

export default server.build();
