import { Ticket } from '../ticket';
import { Error } from 'mongoose';

it('implements optimistc concurrency control', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 5,
		userId: '123',
	});

	await ticket.save();

	const ticket1 = await Ticket.findById(ticket.id);
	const ticket2 = await Ticket.findById(ticket.id);

	ticket1!.price = 10;
	ticket2!.price = 15;

	await ticket1?.save();

	const result = ticket2?.save();

	await expect(result).rejects.toThrow(Error.VersionError);
});

it('increments the entity version number after each update', async () => {
	const ticket = Ticket.build({
		title: 'concert',
		price: 5,
		userId: '123',
	});

	await ticket.save();

	expect(ticket.version).toBe(0);

	await ticket.save();

	expect(ticket.version).toBe(1);

	await ticket.save();

	expect(ticket.version).toBe(2);
});
