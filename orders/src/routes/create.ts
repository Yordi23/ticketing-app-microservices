import {
	BadRequestError,
	NotFoundError,
	OrderStatus,
	requireAuth,
	validateRequest,
} from '@yd-ticketing-app/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { OrderCreatedPublisher } from '../events/publishers/order-created.publisher';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
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
		const { ticketId } = req.body;

		const ticket = await Ticket.findById(ticketId);

		if (!ticket) {
			throw new NotFoundError();
		}

		if (await ticket.isReserved()) {
			throw new BadRequestError('Ticket already reserved');
		}

		const expiresAt = new Date();
		expiresAt.setMinutes(expiresAt.getMinutes() * 2);

		const order = Order.build({
			userId: req.currentUser!.id,
			ticket: ticket.id,
			status: OrderStatus.CREATED,
			expiresAt,
		});

		await order.save();

		new OrderCreatedPublisher(natsWrapper.client).publish({
			id: order.id,
			expiresAt: order.expiresAt.toISOString(),
			status: order.status,
			userId: order.userId,
			ticket: {
				id: ticket.id,
				price: ticket.price,
			},
			version: order.version,
		});

		res.status(201).send(order);
	}
);

export { router as createOrderRouter };
