import { v4 as uuidv4 } from 'uuid';
import knex from '../../config/knex';
import * as accountRepository from './account.repository';
import * as userRepository from '../user/user.repository';
import { BadRequestError, NotFoundError } from '../../utils/errors';
import {
  IAccountPublic,
  ITransferRequest,
  ITransferResult,
  IOperationResult,
  AccountType,
  TransactionType,
  TransactionStatus,
} from './account.interfaces';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateAccountNumber(): string {
  return Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
}

function validateAmount(amount: number): void {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new BadRequestError('Amount must be a valid number');
  }
  
  if (amount <= 0) {
    throw new BadRequestError('Amount must be positive');
  }
  
  if (Math.round(amount * 100) !== amount * 100) {
    throw new BadRequestError('Amount can have at most 2 decimal places');
  }
}

// ============================================================================
// ACCOUNT OPERATIONS
// ============================================================================

export const getAccounts = async (): Promise<IAccountPublic[]> => {
  const accounts = await accountRepository.getAllAccounts();
  return accounts;
}

export const createAccount = async (
  userKey: string,
  accountType: AccountType
): Promise<IAccountPublic> => {
  // Verify user exists and is active
  const user = await userRepository.getUserByKey(userKey);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Get user's database id for foreign key
  const userRecord = await knex('users').where({ key: userKey }).select('id').first();
  if (!userRecord) {
    throw new NotFoundError('User record not found');
  }

  const accountKey = uuidv4();
  const accountNumber = generateAccountNumber();

  await accountRepository.createAccount({
    key: accountKey,
    user_id: userRecord.id,
    account_number: accountNumber,
    account_type: accountType,
    balance: 0,
    is_active: true,
    deleted_at: null,
  });

  return {
    key: accountKey,
    account_number: accountNumber,
    account_type: accountType,
    balance: 0,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };
};

export const getAccountByKey = async (accountKey: string): Promise<IAccountPublic> => {
  const account = await accountRepository.getAccountByKey(accountKey);
  
  if (!account) {
    throw new NotFoundError('Account not found');
  }

  return {
    key: account.key,
    account_number: account.account_number,
    account_type: account.account_type,
    balance: parseFloat(account.balance.toString()),
    is_active: account.is_active,
    created_at: account.created_at!,
    updated_at: account.updated_at!,
  };
};

export const getUserAccounts = async (
  userKey: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  data: IAccountPublic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}> => {
  const { data, total } = await accountRepository.getAccountsByUserKey(userKey, page, limit);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

// ============================================================================
// DEPOSIT
// ============================================================================

export const deposit = async (
  accountKey: string,
  amount: number,
  description?: string
): Promise<IOperationResult> => {
  validateAmount(amount);

  return await knex.transaction(async (trx) => {
    // Lock the account
    const account = await accountRepository.lockAccount(trx, accountKey);

    if (!account) {
      throw new NotFoundError('Account not found or inactive');
    }

    const currentBalance = parseFloat(account.balance.toString());
    const newBalance = currentBalance + amount;

    // Update balance
    await accountRepository.updateAccountBalance(trx, accountKey, newBalance);

    // Record transaction
    const transactionKey = uuidv4();
    await accountRepository.createTransaction(trx, accountKey, {
      key: transactionKey,
      type: TransactionType.CREDIT,
      amount: amount,
      balance_after: newBalance,
      description: description || 'Deposit',
      status: TransactionStatus.COMPLETED,
    });

    return {
      transactionKey,
      accountKey,
      amount,
      newBalance,
      type: TransactionType.CREDIT,
      timestamp: new Date(),
    };
  });
};

// ============================================================================
// WITHDRAW
// ============================================================================

export const withdraw = async (
  accountKey: string,
  amount: number,
  description?: string
): Promise<IOperationResult> => {
  validateAmount(amount);

  return await knex.transaction(async (trx) => {
    // Lock the account
    const account = await accountRepository.lockAccount(trx, accountKey);

    if (!account) {
      throw new NotFoundError('Account not found or inactive');
    }

    const currentBalance = parseFloat(account.balance.toString());
    
    if (currentBalance < amount) {
      throw new BadRequestError(
        `Insufficient funds. Available: $${currentBalance.toFixed(2)}, Required: $${amount.toFixed(2)}`
      );
    }

    const newBalance = currentBalance - amount;

    // Update balance
    await accountRepository.updateAccountBalance(trx, accountKey, newBalance);

    // Record transaction
    const transactionKey = uuidv4();
    await accountRepository.createTransaction(trx, accountKey, {
      key: transactionKey,
      type: TransactionType.DEBIT,
      amount: amount,
      balance_after: newBalance,
      description: description || 'Withdrawal',
      status: TransactionStatus.COMPLETED,
    });

    return {
      transactionKey,
      accountKey,
      amount,
      newBalance,
      type: TransactionType.DEBIT,
      timestamp: new Date(),
    };
  });
};

// ============================================================================
// TRANSFER (WITH CONCURRENCY CONTROL)
// ============================================================================

export const transfer = async (
  request: ITransferRequest
): Promise<ITransferResult> => {
  const { fromAccountKey, toAccountKey, amount, description } = request;

  validateAmount(amount);

  if (fromAccountKey === toAccountKey) {
    throw new BadRequestError('Cannot transfer to the same account');
  }

  return await knex.transaction(async (trx) => {
    // CRITICAL: Lock accounts in consistent order to prevent deadlock
    const [firstKey, secondKey] = [fromAccountKey, toAccountKey].sort();

    // Lock both accounts
    const accounts = await trx('accounts')
      .whereIn('key', [firstKey, secondKey])
      .where({ is_active: true })
      .forUpdate()
      .select('*');

    if (accounts.length !== 2) {
      throw new NotFoundError('One or both accounts not found or inactive');
    }

    const fromAccount = accounts.find((acc: any) => acc.key === fromAccountKey);
    const toAccount = accounts.find((acc: any) => acc.key === toAccountKey);

    if (!fromAccount || !toAccount) {
      throw new NotFoundError('Account configuration error');
    }

    // Check sufficient balance
    const fromBalance = parseFloat(fromAccount.balance.toString());
    if (fromBalance < amount) {
      throw new BadRequestError(
        `Insufficient funds. Available: $${fromBalance.toFixed(2)}, Required: $${amount.toFixed(2)}`
      );
    }

    // Calculate new balances
    const newFromBalance = fromBalance - amount;
    const newToBalance = parseFloat(toAccount.balance.toString()) + amount;

    // Update both accounts
    await accountRepository.updateAccountBalance(trx, fromAccountKey, newFromBalance);
    await accountRepository.updateAccountBalance(trx, toAccountKey, newToBalance);

    // Record transactions
    const transactionKey = uuidv4();
    
    // Debit from source
    await accountRepository.createTransaction(trx, fromAccountKey, {
      key: transactionKey,
      type: TransactionType.DEBIT,
      amount: amount,
      balance_after: newFromBalance,
      description: description || 'Transfer out',
      status: TransactionStatus.COMPLETED,
    }, toAccountKey);

    // Credit to destination
    await accountRepository.createTransaction(trx, toAccountKey, {
      key: uuidv4(),
      type: TransactionType.CREDIT,
      amount: amount,
      balance_after: newToBalance,
      description: description || 'Transfer in',
      related_transaction_key: transactionKey,
      status: TransactionStatus.COMPLETED,
    }, fromAccountKey);

    return {
      transactionKey,
      fromAccountKey,
      toAccountKey,
      amount,
      newBalanceFrom: newFromBalance,
      newBalanceTo: newToBalance,
      status: TransactionStatus.COMPLETED,
      timestamp: new Date(),
    };
  });
};

// ============================================================================
// TRANSACTION HISTORY
// ============================================================================

export const getTransactionHistory = async (
  accountKey: string,
  startDate?: Date,
  endDate?: Date,
  page: number = 1,
  limit: number = 50
) => {
  // Verify account exists
  await getAccountByKey(accountKey);

  let result;
  
  if (startDate && endDate) {
    result = await accountRepository.getTransactionsByDateRange(
      accountKey,
      startDate,
      endDate,
      page,
      limit
    );
  } else {
    result = await accountRepository.getTransactionsByAccountKey(accountKey, page, limit);
  }

  const totalPages = Math.ceil(result.total / limit);

  return {
    transactions: result.data,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};
