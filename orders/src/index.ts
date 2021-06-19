import mongoose from 'mongoose';
import { app } from './app';
import { TicketCreatedListener } from './events/listeners/ticket-created.listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated.listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
	if (
		!process.env.JWT_KEY ||
		!process.env.MONGO_URI ||
		!process.env.NATS_URI ||
		!process.env.NATS_CLUSTER_ID ||
		!process.env.NATS_CLIENT_ID
	) {
		throw new Error('Env variable not defined');
	}

	try {
		await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID,
			process.env.NATS_CLIENT_ID,
			process.env.NATS_URI
		);

		natsWrapper.client.on('close', () => {
			console.log('NATS connection closed...');
			process.exit();
		});

		process.on('SIGINT', () => natsWrapper.client.close());
		process.on('SIGTERM', () => natsWrapper.client.close());

		new TicketCreatedListener(natsWrapper.client).listen();
		new TicketUpdatedListener(natsWrapper.client).listen();

		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		});
		console.log('Connected to DB...');
	} catch (error) {
		console.error(error);
	}
	app.listen(3000, () => {
		console.log('Listening on port 3000...');
	});
};

start();
