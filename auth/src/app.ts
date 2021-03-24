import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

// routes
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

// error handlers
import { errorHandler } from '@team-ticketing/common';
import { NotFoundError } from '@team-ticketing/common';

const app = express();
// this makes the express app know the proxy from the ingress service in the kubernetes is true
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // returns true when the application is not in the test mode -- production / development
    // secure: process.env.Node_ENV !== 'test' 
    secure: false
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

// catches every error that is thown within the application -- returns all errors in a specific format [errors: {message: '', field?: ''}]
app.use(errorHandler);

export { app };
