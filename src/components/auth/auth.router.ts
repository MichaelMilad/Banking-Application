import express from 'express';
import * as authController from '../../components/auth/auth.controller';
import * as AuthValidationsSchemas from '../../components/auth/auth.validations';
import { validator } from '../../middlewares/validator';
import { authenticate } from '../../middlewares/authenticate';
import {
  loginRateLimiter,
  otpRateLimiter,
} from '../../middlewares/rate-limiter';

const router = express.Router();

router.post(
  '/signup',
  validator(AuthValidationsSchemas.signupSchema),
  authController.signUp,
);

router.post(
  '/verify',
  // otpRateLimiter,
  validator(AuthValidationsSchemas.verifyUserSchema),
  authController.verifyUser,
);

router.post(
  '/login',
  // loginRateLimiter,
  validator(AuthValidationsSchemas.loginSchema),
  authController.login,
);

router.get('/me', authenticate, authController.me);

export default router;
