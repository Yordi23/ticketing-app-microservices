import { OrderStatus } from '@yd-ticketing-app/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

const createTicket = async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 25,
	});

	return ticket.save();
};

it('updates the order status to cancelled', async () => {
	const ticket = await createTicket();

	const user = global.signin();

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({
			ticketId: ticket.id,
		})
		.expect(201);

	await request(app)
		.delete('/api/orders/' + order.id)
		.set('Cookie', user)
		.send()
		.expect(200);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toBe(OrderStatus.CANCELLED);
});
