import {
	OrderCancelledEvent,
	OrderStatus,
} from '@yd-ticketing-app/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled.listener';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);

	const ticket = Ticket.build({
		title: 'concert',
		price: 20,
		userId: Types.ObjectId().toHexString(),
	});

	ticket.set({ orderId: Types.ObjectId().toHexString() });

	await ticket.save();

	const data: OrderCancelledEvent['data'] = {
		id: Types.ObjectId().toHexString(),
		ticket: {
			id: ticket.id,
		},
		version: 0,
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg, ticket };
};

it('updates the orderId propertie of the ticket', async () => {
	const { listener, data, msg, ticket } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(data.id);

	expect(updatedTicket!.orderId).toEqual(undefined);
});

it('acknowledges the message', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});

it('publishes a TicketUpdated event', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(natsWrapper.client.publish).toHaveBeenCalled();

	// const ticketUpdatedPayloadId = JSON.parse(
	// 	(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	// );
	// expect(ticketUpdatedPayloadId).toEqual(data.id);
});
//TODO: Fix tests that are not working
