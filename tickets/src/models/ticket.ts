import mongoose from 'mongoose';

// This interface describe the properties needed to create a Ticket
interface TicketAttrs {
	title: string;
	price: number;
	userId: string;
}

//This interface will describe the properties that a Ticket model has
interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
}

// This interface describes the properties that a Ticket Document has
interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
	userId: string;
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
		},
		userId: {
			type: String,
			required: true,
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

const Ticket = mongoose.model<TicketDoc, TicketModel>(
	'Ticket',
	ticketSchema
);

export { Ticket };