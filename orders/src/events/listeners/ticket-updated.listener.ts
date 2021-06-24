import {
	Listener,
	NotFoundError,
	Subjects,
	TicketUpdatedEvent,
} from '@yd-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	readonly subject = Subjects.TICKET_UPDATED;
	queueGroupName = queueGroupName;

	async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
		const { title, price } = data;

		const ticket = await Ticket.findByEvent(data);

		if (!ticket) {
			throw new NotFoundError();
		}

		ticket.set({
			title,
			price,
		});

		await ticket.save();

		msg.ack();
	}
}
