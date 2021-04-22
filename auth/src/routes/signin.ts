import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post('/api/users/signin', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').trim().notEmpty().withMessage('Invalid password')
],
    validateRequest,
    (req: Request, res: Response) => {
        res.send('Hi there');
    });

export { router as signinRouter };