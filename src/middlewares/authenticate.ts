import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import {
  IAccessTokenPayload,
  TokenType,
} from '../components/auth/auth.interfaces';
import { UserRole } from '../components/user/user.interfaces';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or malformed Authorization header');
    }

    const token = header.slice('Bearer '.length).trim();
    const decoded = jwt.verify(token, JWT_SECRET) as IAccessTokenPayload;

    if (decoded.type !== TokenType.ACCESS) {
      throw new UnauthorizedError('Invalid token type');
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Invalid or expired token'));
    }
    next(error);
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnauthorizedError());
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
};

export const requireSelfOrAdmin = (paramName: string) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnauthorizedError());
    const targetKey = req.params[paramName];
    if (req.user.role === 'admin' || req.user.sub === targetKey) {
      return next();
    }
    next(new ForbiddenError('You can only access your own resources'));
  };
};
