import express, { Request, Response, NextFunction } from 'express';
import usersRouter from './users.router';

const router = express.Router();

// Mount the user router under the /users path.
// The full path for these routes will now be /api/users.
router.use('/users', usersRouter);

router.use('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: 'Invalid API',
  });
  next();
});

export default router;
