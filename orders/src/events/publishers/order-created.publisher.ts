import {
	OrderCreatedEvent,
	Publisher,
	Subjects,
} from '@yd-ticketing-app/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	readonly subject = Subjects.ORDER_CREATED;
}
