import Joi from 'joi';
import { AccountType } from './account.interfaces';

export const createAccountSchema = Joi.object({
  body: Joi.object({
    userKey: Joi.string().uuid().required(),
    accountType: Joi.string()
      .valid(...Object.values(AccountType))
      .required(),
  }).required(),
});

export const depositSchema = Joi.object({
  params: Joi.object({
    accountKey: Joi.string().uuid().required(),
  }).required(),
  body: Joi.object({
    amount: Joi.number().positive().precision(2).required(),
    description: Joi.string().max(255).optional(),
  }).required(),
});

export const withdrawSchema = Joi.object({
  params: Joi.object({
    accountKey: Joi.string().uuid().required(),
  }).required(),
  body: Joi.object({
    amount: Joi.number().positive().precision(2).required(),
    description: Joi.string().max(255).optional(),
  }).required(),
});

export const transferSchema = Joi.object({
  body: Joi.object({
    fromAccountKey: Joi.string().uuid().required(),
    toAccountKey: Joi.string().uuid().required(),
    amount: Joi.number().positive().precision(2).required(),
    description: Joi.string().max(255).optional(),
  }).required(),
});

export const getTransactionHistorySchema = Joi.object({
  params: Joi.object({
    accountKey: Joi.string().uuid().required(),
  }).required(),
  query: Joi.object({
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).optional(),
});
