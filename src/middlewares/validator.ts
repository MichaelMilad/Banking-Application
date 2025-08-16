import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

import { BadRequestError } from '../utils/errors';

export const validator = function (schema: Schema) {
  return function (req: Request, res: Response, next: NextFunction) {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join('; ');
      next(new BadRequestError(errorMessage));
    }

    next();
  };
};
