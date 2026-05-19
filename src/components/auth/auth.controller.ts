import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { UnauthorizedError } from '../../utils/errors';

const REFRESH_TOKEN_COOKIE = 'refreshToken';
const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userKey = await authService.createUserService(
      req.body.email,
      req.body.username,
      req.body.password,
    );

    res.status(201).json({
      message: 'User created successfully',
      key: userKey,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password } = req.body;

    const { accessToken, refreshToken, user } = await authService.login(
      password,
      username || email,
    );

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/auth',
      maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    });

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new UnauthorizedError();
    const user = await authService.getMe(req.user.sub);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};
