import {
	Listener,
	Subjects,
	OrderCreatedEvent,
} from '@yd-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.ORDER_CREATED;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		msg.ack();
	}
}
