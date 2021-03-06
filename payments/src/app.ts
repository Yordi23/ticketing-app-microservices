import 'express-async-errors';
import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import {
	currentUser,
	errorHandler,
	NotFoundError,
} from '@yd-ticketing-app/common';

const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
	})
);
app.use(currentUser);

app.all('*', () => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
