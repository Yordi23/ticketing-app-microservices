import {
	Listener,
	Subjects,
	OrderCreatedEvent,
} from '@yd-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.ORDER_CREATED;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		await expirationQueue.add({ orderId: data.id });

		msg.ack();
	}
}
