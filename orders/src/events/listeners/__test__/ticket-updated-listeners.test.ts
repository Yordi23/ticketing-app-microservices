import { TicketUpdatedEvent } from '@yd-ticketing-app/common';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated.listener';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
	const listener = new TicketUpdatedListener(natsWrapper.client);

	const ticket = Ticket.build({
		_id: Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});

	await ticket.save();

	const data: TicketUpdatedEvent['data'] = {
		id: ticket.id,
		price: 25,
		title: 'concert2',
		userId: Types.ObjectId().toHexString(),
		version: ticket.version + 1,
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg, ticket };
};

it('updates and saves a ticket', async () => {
	const { listener, data, msg, ticket } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);

	expect(updatedTicket?.title).toEqual(data.title);
	expect(updatedTicket?.price).toEqual(data.price);
	expect(updatedTicket?.version).toEqual(data.version);
});

it('acknowledges the message', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
