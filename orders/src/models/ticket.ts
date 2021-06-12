import { OrderStatus } from '@yd-ticketing-app/common';
import mongoose from 'mongoose';
import { Order } from './order';

// This interface describe the properties needed to create a Ticket
interface TicketAttrs {
	title: string;
	price: number;
}

//This interface will describe the properties that a Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
}

// This interface describes the properties that a Ticket Document has
export interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
	isReserved(): Promise<boolean>;
}

const ticketSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function () {
	const isTicketReserved = await Order.findOne({
		ticket: this.id,
		status: { $ne: OrderStatus.CANCELLED },
	});

	return isTicketReserved ? true : false;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>(
	'Ticket',
	ticketSchema
);

export { Ticket };
