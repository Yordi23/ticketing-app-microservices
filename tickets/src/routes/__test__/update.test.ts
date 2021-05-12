import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the ticket is not found', async () => {
	const id = mongoose.Types.ObjectId().toHexString();

	const response = await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'test',
			price: 20,
		});

	expect(response.status).toBe(404);
});

it('returns a 401 if the user is not authenticated', async () => {
	const id = mongoose.Types.ObjectId().toHexString();

	const response = await request(app).put(`/api/tickets/${id}`).send({
		title: 'test',
		price: 20,
	});

	expect(response.status).toBe(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
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
		.put(`/api/tickets/${createTicketResponse.body.id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'test2',
			price: 5,
		});

	expect(response.status).toBe(401);
});

it('returns a 400 if an invalid title or price is provided', async () => {
	const createTicketInput = {
		title: 'test',
		price: 20,
	};

	const cookie = global.signin();

	const createTicketResponse = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send(createTicketInput)
		.expect(201);

	await request(app)
		.put(`/api/tickets/${createTicketResponse.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: '',
			price: 5,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${createTicketResponse.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'test2',
			price: -5,
		})
		.expect(400);
});

it('updates the ticket provided valid inputs', async () => {
	const createTicketInput = {
		title: 'test',
		price: 20,
	};

	const updateTicketInput = {
		title: 'test2',
		price: 50,
	};

	const cookie = global.signin();

	const createTicketResponse = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send(createTicketInput)
		.expect(201);

	const response = await request(app)
		.put(`/api/tickets/${createTicketResponse.body.id}`)
		.set('Cookie', cookie)
		.send(updateTicketInput);

	const ticket = await Ticket.findById(response.body.id);

	expect(response.status).toBe(200);
	expect(response.body).toMatchObject(updateTicketInput);
	expect(ticket).toMatchObject(updateTicketInput);
});
