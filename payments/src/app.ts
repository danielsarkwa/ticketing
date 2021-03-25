import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

// routers
import { createChargeRouter } from './routes/new';

// error handlers
import { errorHandler, NotFoundError, currentUser } from '@team-ticketing/common';

const app = express();
// this makes the express app know the proxy from the ingress 
//  service in the kubernetes is true
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.Node_ENV !== 'test'
    secure: false
  })
);
// extract user payload from cookie into req.currentUser
app.use(currentUser);
app.use(createChargeRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
