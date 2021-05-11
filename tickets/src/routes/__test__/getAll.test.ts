import request from 'supertest';
import { app } from '../../app';

const createTicket = async () => {
	const createTicketInput = {
		title: 'test',
		price: 20,
	};

	const createTicketResponse = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send(createTicketInput);

	return createTicketResponse;
};

it('returns a list of already created tickets', async () => {
	await createTicket();
	await createTicket();
	await createTicket();

	const response = await request(app).get(`/api/tickets`).send();

	expect(response.status).toBe(200);
	expect(response.body.length).toBe(3);
});
