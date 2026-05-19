import express from 'express';
import * as userController from './user.controller';
import {
  authenticate,
  requireRole,
  requireSelfOrAdmin,
} from '../../middlewares/authenticate';

const router = express.Router();

router.use(authenticate);

// Admin-only: full user listings
router.get('/', requireRole('admin'), userController.getUsers);
router.get('/search', requireRole('admin'), userController.searchUsers);

// Self or admin: single-user views and deletes
router.get('/:userKey', requireSelfOrAdmin('userKey'), userController.getUserByKey);
router.delete('/:userKey', requireSelfOrAdmin('userKey'), userController.deleteUser);

export default router;
