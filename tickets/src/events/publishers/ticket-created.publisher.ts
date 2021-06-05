import {
	Publisher,
	Subjects,
	TicketCreatedEvent,
} from '@yd-ticketing-app/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TICKET_CREATED;
}
