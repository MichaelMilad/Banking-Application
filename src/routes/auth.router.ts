import express from 'express';
import * as authController from '../components/auth/auth.controller';
import * as AuthValidationsSchemas from '../components/auth/auth.validations';
import { validator } from '../middlewares/validator';

const router = express.Router();

router.post('/signup', validator(AuthValidationsSchemas.signupSchema), authController.signUp);

router.post('/verify', validator(AuthValidationsSchemas.verifyUserSchema), authController.verifyUser);

export default router;
