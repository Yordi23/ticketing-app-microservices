import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';

import {
	BadRequestError,
	validateRequest,
} from '@yd-ticketing-app/common';

const router = express.Router();

router.post(
	'/api/users/signin',
	[
		body('email').isEmail().withMessage('Invalid email'),
		body('password').trim().notEmpty().withMessage('Invalid password'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });

		if (!existingUser) {
			throw new BadRequestError('Invalid credentials');
		}

		const passwordsMatch = await Password.compare(
			existingUser.password,
			password
		);

		if (!passwordsMatch) {
			throw new BadRequestError('Invalid credentials');
		}

		const userJwt = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email,
			},
			process.env.JWT_KEY!
		);

		req.session = {
			jwt: userJwt,
		};

		res.status(200).send(existingUser);
	}
);

export { router as signinRouter };
