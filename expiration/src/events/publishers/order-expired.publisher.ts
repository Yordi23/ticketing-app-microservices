import {
	OrderExpiredEvent,
	Publisher,
	Subjects,
} from '@yd-ticketing-app/common';

export class OrderExpiredPublisher extends Publisher<OrderExpiredEvent> {
	readonly subject = Subjects.ORDER_EXPIRED;
}
