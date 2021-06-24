import { TicketCreatedEvent } from '@yd-ticketing-app/common';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created.listener';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
	const listener = new TicketCreatedListener(natsWrapper.client);

	const data: TicketCreatedEvent['data'] = {
		id: Types.ObjectId().toHexString(),
		price: 25,
		title: 'concert',
		userId: Types.ObjectId().toHexString(),
		version: 0,
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	const ticket = await Ticket.findById(data.id);

	expect(ticket?.title).toEqual(data.title);
	expect(ticket?.price).toEqual(data.price);
});

it('acknowledges the message', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
