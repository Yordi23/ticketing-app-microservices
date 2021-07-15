import {
	Listener,
	NotFoundError,
	OrderExpiredEvent,
	OrderStatus,
	Subjects,
} from '@yd-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled.publisher';
import { queueGroupName } from './queue-group-name';

export class OrderExpiredListener extends Listener<OrderExpiredEvent> {
	readonly subject = Subjects.ORDER_EXPIRED;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderExpiredEvent['data'], msg: Message) {
		const order = await Order.findById(data.orderId);

		if (!order) {
			throw new NotFoundError();
		}

		if (order.status === OrderStatus.COMPLETED) return msg.ack();

		order.set({
			status: OrderStatus.CANCELLED,
		});

		await order.save();

		new OrderCancelledPublisher(this.client).publish({
			id: order.id,
			version: order.version,
			ticket: {
				// @ts-ignore
				id: order.ticket,
			},
		});

		msg.ack();
	}
}
