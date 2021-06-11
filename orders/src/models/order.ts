import { OrderStatus } from '@yd-ticketing-app/common';
import mongoose from 'mongoose';
import { TicketDoc } from './ticket';

// This interface describe the properties needed to create an Order
interface OrderAttrs {
	userId: string;
	status: OrderStatus;
	expiresAt: Date;
	ticket: TicketDoc;
}

//This interface will describe the properties that an Order model has
interface OrderModel extends mongoose.Model<OrderDoc> {
	build(attrs: OrderAttrs): OrderDoc;
}

// This interface describes the properties that an Order Document has
interface OrderDoc extends mongoose.Document {
	userId: string;
	status: OrderStatus;
	expiresAt: Date;
	ticket: TicketDoc;
}

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: Object.values(OrderStatus),
			default: OrderStatus.CREATED,
		},
		expiresAt: {
			type: mongoose.Schema.Types.Date,
		},
		ticket: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Ticket',
		},
	},
	{
		toJSON: {
			//Ret is the object that is going to be returned
			transform(doc, ret) {
				ret.id = ret._id;

				delete ret._id;
				delete ret.__v;
			},
		},
	}
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
	return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>(
	'Order',
	orderSchema
);

export { Order };
