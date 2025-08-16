import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import * as AuthValidationSchemas from './auth.validations';
import { validator } from '../../middlewares/validator';

export const createUser = [
  validator(AuthValidationSchemas.signUpSchema),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userKey = await authService.createUserService(req.body.email, req.body.username, req.body.password);

      res.status(201).json({
        message: 'User created successfully',
        key: userKey,
      });
    } catch (error) {
      next(error);
    }
  },
];
