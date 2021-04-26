import request from 'supertest';
import { app } from '../../app';

it('returns user information if valid JWT cookie is provided', async () => {
	const cookie = await global.signup();

	const response = await request(app)
		.get('/api/users/currentuser')
		.set('Cookie', cookie)
		.send()
		.expect(200);

	expect(response.body.currentUser.email).toBe('test@test.com');
});

it('returns null if no JWT cookie is provided', async () => {
	const response = await request(app)
		.get('/api/users/currentuser')
		.send()
		.expect(200);

	expect(response.body.currentUser).toBe(null);
});
