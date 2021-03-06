import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../__mocks__/nats-wrapper';

it('has a route handler listening to /api/tickets for POST requests', async () => {
	const response = await request(app).post('/api/tickets').send({});

	expect(response.status).not.toBe(404);
});

it('can only be accessed if the user is signed in', async () => {
	const response = await request(app).post('/api/tickets').send({});

	expect(response.status).toBe(401);
});

it('return a status other than 401 if user is signed in', async () => {
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({});

	expect(response.status).not.toBe(401);
});

it('returns an error if invalid title is provided', async () => {
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({ title: '', price: 10 });

	expect(response.status).toBe(400);
});

it('returns an error if an invalid price is provided', async () => {
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({ title: 'title', price: -10 });

	expect(response.status).toBe(400);
});

it('creates a ticket with valid inputs', async () => {
	const ticketInput = { title: 'test', price: 10 };
	let ticket = await Ticket.findOne({ title: 'test' });

	expect(ticket).toEqual(null);

	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send(ticketInput);

	expect(response.status).toBe(201);

	ticket = await Ticket.findOne({ title: 'test' });

	expect(ticket).toMatchObject(ticketInput);
});

it('publishes an event', async () => {
	const ticketInput = { title: 'test', price: 10 };

	await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send(ticketInput);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
