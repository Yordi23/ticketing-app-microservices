import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { deleteOrderRouter } from '../delete';
import { Types } from 'mongoose';

const createTicket = async () => {
	const ticket = Ticket.build({
		_id: Types.ObjectId().toHexString(),
		title: 'concert',
		price: 25,
	});

	return ticket.save();
};

it('returns the order with the provided id', async () => {
	const ticket = await createTicket();

	const user = global.signin();

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({
			ticketId: ticket.id,
		})
		.expect(201);

	const response = await request(app)
		.get('/api/orders/' + order.id)
		.set('Cookie', user)
		.expect(200);

	const expectedValue = {
		...order,
	};

	delete expectedValue.ticket;

	expect(response.body).toMatchObject(expectedValue);
});

it('returns an 404 code error if the provided id does not match any order', async () => {
	const ticket = await createTicket();

	const user = global.signin();

	await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({
			ticketId: ticket.id,
		})
		.expect(201);

	await request(app)
		.get('/api/orders/' + Types.ObjectId().toHexString())
		.set('Cookie', user)
		.expect(404);
});

it('returns an 401 code error if the provided id match an order related to another user', async () => {
	const ticket = await createTicket();

	const user1 = global.signin();
	const user2 = global.signin();

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user2)
		.send({
			ticketId: ticket.id,
		})
		.expect(201);

	await request(app)
		.get('/api/orders/' + order.id)
		.set('Cookie', user1)
		.expect(401);
});
