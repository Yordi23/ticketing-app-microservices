import {
	Publisher,
	Subjects,
	TicketUpdatedEvent,
} from '@yd-ticketing-app/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TICKET_UPDATED;
}
