import { NotFoundError } from '@yd-ticketing-app/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
	'/api/tickets/:id',
	async (req: Request, res: Response) => {
		const ticket = Ticket.findById(req.params.id);

		if (!ticket) {
			throw new NotFoundError();
		}

		res.status(200).send(ticket);
	}
);

export { router as getTicketRouter };