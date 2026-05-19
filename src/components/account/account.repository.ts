import knex from '../../config/knex';
import { NotFoundError } from '../../utils/errors';
import {
  IAccount,
  IAccountPublic,
  ITransaction,
  ITransactionPublic,
} from './account.interfaces';

// ============================================================================
// ACCOUNT QUERIES
// ============================================================================

export const getAllAccounts = async (): Promise<IAccountPublic[]> => {
  return await knex('accounts')
    .where({ is_active: true, deleted_at: null })
    .select('key', 'account_number', 'account_type', 'balance', 'is_active', 'created_at', 'updated_at');
}

export const createAccount = async (account: Omit<IAccount, 'created_at' | 'updated_at'>): Promise<void> => {
  await knex('accounts').insert(account);
};

export const getAccountByKey = async (accountKey: string): Promise<IAccount | undefined> => {
  return await knex('accounts')
    .where({ key: accountKey, is_active: true, deleted_at: null })
    .first();
};

export const getAccountsByUserKey = async (
  userKey: string,
  page: number = 1,
  limit: number = 10
): Promise<{ data: IAccountPublic[]; total: number }> => {
  // First get the user's id from their key
  const user = await knex('users').where({ key: userKey }).select('id').first();
  if (!user) return { data: [], total: 0 };
  
  // Get total count
  const [{ count }] = await knex('accounts')
    .where({ user_id: user.id, is_active: true, deleted_at: null })
    .count('* as count');
  const total = Number(count);
  
  // Calculate offset
  const offset = (page - 1) * limit;
  
  // Get paginated data
  const data = await knex('accounts')
    .where({ user_id: user.id, is_active: true, deleted_at: null })
    .select('key', 'account_number', 'account_type', 'balance', 'is_active', 'created_at', 'updated_at')
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);
  
  return { data, total };
};

export const updateAccountBalance = async (
  trx: any,
  accountKey: string,
  newBalance: number
): Promise<void> => {
  await trx('accounts')
    .where({ key: accountKey })
    .update({
      balance: newBalance,
      updated_at: trx.fn.now(),
    });
};

export const lockAccount = async (trx: any, accountKey: string): Promise<IAccount> => {
  const account = await trx('accounts')
    .where({ key: accountKey, is_active: true })
    .forUpdate()
    .first();
  
  return account;
};

export const softDeleteAccount = async (accountKey: string): Promise<void> => {
  await knex('accounts')
    .where({ key: accountKey })
    .update({ deleted_at: knex.fn.now() });
};

// ============================================================================
// TRANSACTION QUERIES
// ============================================================================

export const createTransaction = async (
  trx: any,
  accountKey: string,
  transaction: Omit<ITransaction, 'created_at' | 'account_id'>,
  relatedAccountKey?: string
): Promise<void> => {
  try {
    const transactionData: any = {
      ...transaction,
      account_id: trx.raw('(SELECT id FROM accounts WHERE key = ?)', [accountKey]),
    };
    
    // Handle related account if present
    if (relatedAccountKey) {
      transactionData.related_account_id = trx.raw(
        '(SELECT id FROM accounts WHERE key = ?)',
        [relatedAccountKey]
      );
    }
    
    await trx('transactions').insert(transactionData);
  } catch (error: any) {
    // Check if error is due to foreign key constraint (account not found)
    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.errno === 1452) {
      throw new NotFoundError('Account not found');
    }
    throw error;
  }
};

export const getTransactionsByAccountKey = async (
  accountKey: string,
  page: number = 1,
  limit: number = 50
): Promise<{ data: ITransactionPublic[]; total: number }> => {
  try {
    // Get total count using subquery
    const countResult = await knex('transactions')
      .whereRaw('account_id = (SELECT id FROM accounts WHERE key = ?)', [accountKey])
      .count('* as count')
      .first();
    
    const total = Number(countResult?.count || 0);
    
    // If no transactions found, verify account exists
    if (total === 0) {
      const accountExists = await knex('accounts')
        .where({ key: accountKey })
        .first();
      
      if (!accountExists) {
        throw new NotFoundError('Account not found');
      }
    }
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Get paginated data (excluding internal IDs)
    const data = await knex('transactions')
      .whereRaw('account_id = (SELECT id FROM accounts WHERE key = ?)', [accountKey])
      .select('key', 'type', 'amount', 'balance_after', 'description', 'related_transaction_key', 'status', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
    
    return { data, total };
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw error;
  }
};

export const getTransactionsByDateRange = async (
  accountKey: string,
  startDate: Date,
  endDate: Date,
  page: number = 1,
  limit: number = 50
): Promise<{ data: ITransactionPublic[]; total: number }> => {
  try {
    // Get total count using subquery
    const countResult = await knex('transactions')
      .whereRaw('account_id = (SELECT id FROM accounts WHERE key = ?)', [accountKey])
      .whereBetween('created_at', [startDate, endDate])
      .count('* as count')
      .first();
    
    const total = Number(countResult?.count || 0);
    
    // If no transactions found, verify account exists
    if (total === 0) {
      const accountExists = await knex('accounts')
        .where({ key: accountKey })
        .first();
      
      if (!accountExists) {
        throw new NotFoundError('Account not found');
      }
    }
    
    // Calculate offset
    const offset = (page - 1) * limit;
    
    // Get paginated data (excluding internal IDs)
    const data = await knex('transactions')
      .whereRaw('account_id = (SELECT id FROM accounts WHERE key = ?)', [accountKey])
      .whereBetween('created_at', [startDate, endDate])
      .select('key', 'type', 'amount', 'balance_after', 'description', 'related_transaction_key', 'status', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
    
    return { data, total };
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw error;
  }
};
