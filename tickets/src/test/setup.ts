import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global {
	namespace NodeJS {
		interface Global {
			signin(): string[];
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

global.signin = () => {
	const payload = {
		id: 'sldkfjvnlknf',
		email: 'test@test.com',
	};

	const token = jwt.sign(payload, process.env.JWT_KEY!);

	const session = { jwt: token };

	//This is for simulating the way the browser returns the cookies
	const sessionJSON = JSON.stringify(session);
	const base64Session = Buffer.from(sessionJSON).toString('base64');

	return [`express:sess=${base64Session}`];
};
