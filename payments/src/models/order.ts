import { OrderStatus } from '@yd-ticketing-app/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// This interface describe the properties needed to create an Order
interface OrderAttrs {
	_id: string;
	version: number;
	userId: string;
	price: number;
	status: OrderStatus;
}

//This interface will describe the properties that an Order model has
interface OrderModel extends mongoose.Model<OrderDoc> {
	build(attrs: OrderAttrs): OrderDoc;
}

// This interface describes the properties that an Order Document has
interface OrderDoc extends mongoose.Document {
	version: number;
	userId: string;
	price: number;
	status: OrderStatus;
}

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: Object.values(OrderStatus),
			default: OrderStatus.CREATED,
		},
	},
	{
		toJSON: {
			//Ret is the object that is going to be returned
			transform(doc, ret) {
				ret.id = ret._id;

				delete ret._id;
			},
		},
	}
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
	return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>(
	'Order',
	orderSchema
);

export { Order };
