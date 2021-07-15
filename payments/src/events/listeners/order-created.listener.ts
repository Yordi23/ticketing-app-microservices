import {
	Listener,
	Subjects,
	OrderCreatedEvent,
} from '@yd-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.ORDER_CREATED;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		const order = Order.build({
			_id: data.id,
			price: data.ticket.price,
			status: data.status,
			userId: data.userId,
			version: data.version,
		});

		await order.save();

		msg.ack();
	}
}
