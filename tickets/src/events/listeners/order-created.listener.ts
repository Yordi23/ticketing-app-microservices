import {
	Listener,
	Subjects,
	OrderCreatedEvent,
	NotFoundError,
} from '@yd-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated.publisher';
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

		await new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			price: ticket.price,
			title: ticket.title,
			userId: ticket.userId,
			version: ticket.version,
			orderId: ticket.orderId,
		});

		msg.ack();
	}
}
