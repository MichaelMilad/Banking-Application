import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validator = (schema: Joi.ObjectSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    next();
  };
};
