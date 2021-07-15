import {
	OrderCancelledEvent,
	OrderCreatedEvent,
	OrderStatus,
} from '@yd-ticketing-app/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled.listener';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);

	const order = Order.build({
		id: Types.ObjectId().toHexString(),
		status: OrderStatus.CREATED,
		price: 25,
		userId: Types.ObjectId().toHexString(),
		version: 0,
	});

	await order.save();

	const data: OrderCancelledEvent['data'] = {
		id: order.id,
		ticket: {
			id: Types.ObjectId().toHexString(),
		},
		version: 1,
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg };
};

it('updates the status of the order', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	const updatedOrder = await Order.findById(data.id);

	expect(updatedOrder.toObject().statud).toEqual(
		OrderStatus.CANCELLED
	);
});

it('acknowledges the message', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
