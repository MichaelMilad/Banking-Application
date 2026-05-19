import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const getDataToValidate = (req: Request, schema: Joi.ObjectSchema): any => {
  const dataToValidate: any = {};
  const schemaDescription = schema.describe();

  if (schemaDescription.keys.body) {
    dataToValidate.body = req.body;
  }

  if (schemaDescription.keys.params) {
    dataToValidate.params = req.params;
  }

  if (schemaDescription.keys.query) {
    dataToValidate.query = req.query;
  }

  return dataToValidate;
};

export const validator = (schema: Joi.ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = getDataToValidate(req, schema);

      await schema.validateAsync(dataToValidate, {
        abortEarly: false,
        stripUnknown: true,
      });

      next();
    } catch (error: any) {
      if (error.isJoi) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.details.map((detail: any) => ({
            field: detail.path.join('.'),
            message: detail.message,
          })),
        });
      }
      next(error);
    }
  };
};