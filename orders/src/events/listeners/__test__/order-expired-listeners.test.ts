import {
	OrderExpiredEvent,
	OrderStatus,
} from '@yd-ticketing-app/common';
import { natsWrapper } from '../../../nats-wrapper';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { OrderExpiredListener } from '../order-expired.listener';
import { Order } from '../../../models/order';

const setup = async () => {
	const listener = new OrderExpiredListener(natsWrapper.client);

	const ticket = Ticket.build({
		_id: Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});

	await ticket.save();

	const order = Order.build({
		status: OrderStatus.CREATED,
		ticket,
		userId: Types.ObjectId().toHexString(),
		expiresAt: new Date(),
	});

	await order.save();

	const data: OrderExpiredEvent['data'] = {
		orderId: order.id,
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg, order, ticket };
};

it('updates and saves a ticket', async () => {
	const { listener, data, msg, order } = await setup();

	await listener.onMessage(data, msg);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder?.status).toEqual(OrderStatus.CANCELLED);
});

it('publish an OrderCancelled event', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('acknowledges the message', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
