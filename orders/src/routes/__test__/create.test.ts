import { OrderStatus } from '@yd-ticketing-app/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
	const ticketId = mongoose.Types.ObjectId();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({
			ticketId,
		})
		.expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
	const ticket = Ticket.build({
		price: 25,
		title: 'concert',
	});
	await ticket.save();

	const order = Order.build({
		expiresAt: new Date(),
		status: OrderStatus.CREATED,
		ticket: ticket.id,
		userId: mongoose.Types.ObjectId().toHexString(),
	});
	await order.save();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({
			ticketId: ticket.id,
		})
		.expect(400);
});

it('create an order and reserves a ticket', async () => {
	const ticket = Ticket.build({
		price: 25,
		title: 'concert',
	});
	await ticket.save();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({
			ticketId: ticket.id,
		})
		.expect(201);
});

it('publish an OrderCreated event after creating an order', async () => {
	const ticket = Ticket.build({
		price: 25,
		title: 'concert',
	});
	await ticket.save();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({
			ticketId: ticket.id,
		})
		.expect(201);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
