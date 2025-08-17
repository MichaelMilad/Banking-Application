import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userKey = await authService.createUserService(req.body.email, req.body.username, req.body.password);

    res.status(201).json({
      message: 'User created successfully',
      key: userKey,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userKey, otp } = req.body;

    await authService.verifyOTP(userKey, otp);

    res.status(200).json({
      message: 'User Verified',
    });
  } catch (error) {
    next(error);
  }
};
