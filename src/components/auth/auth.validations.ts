import Joi from 'joi';

export const signupSchema = Joi.object({
  body: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }).required(),
});

export const verifyUserSchema = Joi.object({
  body: Joi.object({
    userKey: Joi.string().required(),
    otp: Joi.string().required(),
  }).required(),
});

export const loginSchema = Joi.object({
  body: Joi.object({
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().required(),
  })
    .xor('username', 'email')
    .required(),
});
