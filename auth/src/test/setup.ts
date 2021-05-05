import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

declare global {
	namespace NodeJS {
		interface Global {
			signup(): Promise<string[]>;
		}
	}
}

let mongoMemoryServer: any;

beforeAll(async () => {
	process.env.JWT_KEY = 'secret';

	mongoMemoryServer = new MongoMemoryServer();
	const mongoUri = await mongoMemoryServer.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongoMemoryServer.stop();
	await mongoose.connection.close();
});

global.signup = async () => {
	const email = 'test@test.com';
	const password = 'password';

	const response = await request(app)
		.post('/api/users/signup')
		.send({
			email,
			password,
		})
		.expect(201);

	const cookie = response.get('Set-Cookie');

	return cookie;
};