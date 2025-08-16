import Joi from 'joi';

export const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
})
  .required()
  .unknown(false);
