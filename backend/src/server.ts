import express, { Express } from 'express';

import cors from 'cors';

import { authMiddleware, errorMiddleware } from '~/middlewares';

import router from './router';

export function createServer(): Express {
  const server = express();

  server.use(cors());

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.use(authMiddleware);

  server.use('/', router);

  server.use(errorMiddleware);

  return server;
}
