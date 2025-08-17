import express from 'express';
import * as userController from '../components/user/user.controller';

const router = express.Router();

router.get('/', userController.getUsers);

router.delete('/:userKey', userController.deleteUser);

export default router;
