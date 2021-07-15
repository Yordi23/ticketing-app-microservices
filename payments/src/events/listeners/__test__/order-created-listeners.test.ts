import {
	OrderCreatedEvent,
	OrderStatus,
} from '@yd-ticketing-app/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created.listener';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client);

	const data: OrderCreatedEvent['data'] = {
		id: Types.ObjectId().toHexString(),
		status: OrderStatus.CREATED,
		ticket: {
			id: Types.ObjectId().toHexString(),
			price: 25,
		},
		userId: Types.ObjectId().toHexString(),
		expiresAt: 'randomdate',
		version: 0,
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg };
};

it('creates a new order entity', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	const newOrder = await Order.findById(data.id);

	expect(newOrder.toObject().price).toMatchObject(data.ticket.price);
});

it('acknowledges the message', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
