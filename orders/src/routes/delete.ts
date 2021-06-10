import { NotFoundError } from '@yd-ticketing-app/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.delete('/api/orders/', async (req: Request, res: Response) => {
	// const tickets = await Ticket.find({});
	// res.status(200).send(tickets);
});

export { router as deleteOrderRouter };
