import 'express-async-errors';
import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import {
	currentUser,
	errorHandler,
	NotFoundError,
} from '@yd-ticketing-app/common';
import { createOrderRouter } from './routes/create';
import { getOrderRouter } from './routes/get';
import { getAllOrdersRouter } from './routes/getAll';
import { deleteOrderRouter } from './routes/delete';

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

app.use(createOrderRouter);
app.use(getOrderRouter);
app.use(getAllOrdersRouter);
app.use(deleteOrderRouter);

app.all('*', () => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
