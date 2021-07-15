import {
	Listener,
	Subjects,
	OrderCreatedEvent,
	OrderCancelledEvent,
	NotFoundError,
	OrderStatus,
} from '@yd-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
	readonly subject = Subjects.ORDER_CANCELLED;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
		const order = await Order.findOne({
			id: data.id,
			version: data.version - 1,
		});

		if (!order) {
			throw new NotFoundError();
		}

		order.set({ status: OrderStatus.CANCELLED });

		await order.save();

		msg.ack();
	}
}
