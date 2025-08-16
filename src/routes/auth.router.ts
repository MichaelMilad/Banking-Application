import express from 'express';
import * as authController from '../components/auth/auth.controller';

const router = express.Router();

/**
 * @route POST /auth
 * @description Fetches a list of all users.
 */
router.post('/signup', authController.createUser);

export default router;
