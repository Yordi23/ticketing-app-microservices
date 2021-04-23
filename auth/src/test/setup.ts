import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoMemoryServer: any;

beforeAll(async () => {
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
