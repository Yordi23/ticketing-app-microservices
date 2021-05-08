import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
	if (!process.env.JWT_KEY || !process.env.MONGO_URI) {
		throw new Error('Env variable not defined');
	}

	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('Connected to DB...');
	} catch (error) {
		console.error(error);
	}
	app.listen(3000, () => {
		console.log('Listening on port 3000');
	});
};

start();
