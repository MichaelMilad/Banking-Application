import express from 'express';
import * as userController from '../components/user/user.controller';

const router = express.Router();

/**
 * @route GET /users
 * @description Fetches a list of all users.
 */
router.get('/', userController.getUsers);

export default router;
