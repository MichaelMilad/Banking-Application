import express, { Request, Response } from 'express';
import usersRouter from './components/user/users.router';
import authRouter from './components/auth/auth.router';
import accountRouter from './components/account/account.router';

const router = express.Router();

router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/accounts', accountRouter);

router.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Invalid API' });
});

export default router;
