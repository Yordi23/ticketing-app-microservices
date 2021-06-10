import {
	requireAuth,
	validateRequest,
} from '@yd-ticketing-app/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
	'/api/orders',
	requireAuth,
	[
		body('ticketId')
			.not()
			.isEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage('ticketId is required'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		// const { title, price } = req.body;
		// const ticket = Ticket.build({
		// 	title,
		// 	price,
		// 	userId: req.currentUser!.id,
		// });
		// await ticket.save();
		// new TicketCreatedPublisher(natsWrapper.client).publish({
		// 	id: ticket.id,
		// 	price: ticket.price,
		// 	title: ticket.title,
		// 	userId: ticket.userId,
		// });
		// res.status(201).send(ticket);
	}
);

export { router as createOrderRouter };
