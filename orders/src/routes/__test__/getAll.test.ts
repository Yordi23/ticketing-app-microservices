import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Types } from 'mongoose';

const createTicket = async () => {
	const ticket = Ticket.build({
		_id: Types.ObjectId().toHexString(),
		title: 'concert',
		price: 25,
	});

	return ticket.save();
};
it('returns all orders related to the current user', async () => {
	const ticket1 = await createTicket();
	const ticket2 = await createTicket();
	const ticket3 = await createTicket();

	const user1 = global.signin();
	const user2 = global.signin();

	await request(app)
		.post('/api/orders')
		.set('Cookie', user1)
		.send({
			ticketId: ticket1.id,
		})
		.expect(201);

	const { body: order1 } = await request(app)
		.post('/api/orders')
		.set('Cookie', user2)
		.send({
			ticketId: ticket2.id,
		})

		.expect(201);

	const { body: order2 } = await request(app)
		.post('/api/orders')
		.set('Cookie', user2)
		.send({
			ticketId: ticket3.id,
		})
		.expect(201);

	const response = await request(app)
		.get('/api/orders')
		.set('Cookie', user2)
		.expect(200);

	expect(response.body.length).toBe(2);
	expect(response.body[0].id).toEqual(order1.id);
	expect(response.body[1].id).toEqual(order2.id);
});
