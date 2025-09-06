import express from 'express';
import * as userController from './user.controller';

const router = express.Router();

router.get('/', userController.getUsers);

router.delete('/:userKey', userController.deleteUser);

export default router;
