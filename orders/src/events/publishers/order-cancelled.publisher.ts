import {
	Publisher,
	Subjects,
	OrderCancelledEvent,
} from '@yd-ticketing-app/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.ORDER_CANCELLED;
}
