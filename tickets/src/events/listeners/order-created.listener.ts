import {
	Listener,
	Subjects,
	OrderCreatedEvent,
	NotFoundError,
} from '@yd-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.ORDER_CREATED;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		const ticket = await Ticket.findById(data.ticket.id);

		if (!ticket) {
			throw new NotFoundError();
		}

		ticket.set({ orderId: data.id });

		await ticket.save();

		msg.ack();
	}
}
