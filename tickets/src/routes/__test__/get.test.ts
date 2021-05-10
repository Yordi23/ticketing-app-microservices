import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the ticket is not found', async () => {
	const id = mongoose.Types.ObjectId().toHexString();

	const response = await request(app)
		.post(`/api/tickets/${id}`)
		.send();

	expect(response.status).toBe(404);
});

it('returns the ticket if provided an id of an existing ticket', async () => {
	const createTicketInput = {
		title: 'test',
		price: 20,
	};

	const createTicketResponse = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send(createTicketInput)
		.expect(201);

	const response = await request(app)
		.get(`/api/tickets/${createTicketResponse.body.id}`)
		.send();

	expect(response.status).toBe(200);
	expect(response.body).toMatchObject(createTicketInput);
});
