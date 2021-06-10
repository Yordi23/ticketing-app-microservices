import { NotFoundError } from '@yd-ticketing-app/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/orders/:id', async (req: Request, res: Response) => {
	// const ticket = await Ticket.findById(req.params.id);
	// if (!ticket) {
	// 	throw new NotFoundError();
	// }
	// res.status(200).send(ticket);
});

export { router as getOrderRouter };
