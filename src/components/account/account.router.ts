import express from 'express';
import * as accountController from './account.controller';
import * as AccountValidations from './account.validations';
import { validator } from '../../middlewares/validator';
import {
  authenticate,
  requireRole,
  requireSelfOrAdmin,
} from '../../middlewares/authenticate';

const router = express.Router();

router.use(authenticate);

// Create account
router.post(
  '/',
  validator(AccountValidations.createAccountSchema),
  accountController.createAccount
);
// Admin-only: list every account in the system
router.get('/', requireRole('admin'), accountController.getAccounts);

// Get account by key (any authenticated user; deeper ownership check would need a DB lookup)
router.get('/:accountKey', accountController.getAccountByKey);

// Get user's accounts — self or admin
router.get(
  '/user/:userKey',
  requireSelfOrAdmin('userKey'),
  accountController.getUserAccounts,
);

// Deposit
router.post(
  '/:accountKey/deposit',
  validator(AccountValidations.depositSchema),
  accountController.deposit
);

// Withdraw
router.post(
  '/:accountKey/withdraw',
  validator(AccountValidations.withdrawSchema),
  accountController.withdraw
);

// Transfer
router.post(
  '/transfer',
  validator(AccountValidations.transferSchema),
  accountController.transfer
);

// Transaction history
router.get(
  '/:accountKey/transactions',
  validator(AccountValidations.getTransactionHistorySchema),
  accountController.getTransactionHistory
);

export default router;
