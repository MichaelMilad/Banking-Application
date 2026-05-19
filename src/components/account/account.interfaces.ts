/**
 * Account Module Types and Interfaces
 */

import { ITimestamps, ISoftDeletable } from '../../types/common';

// ============================================================================
// ENUMS
// ============================================================================

export enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
}

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REVERSED = 'reversed',
}

// ============================================================================
// BASE INTERFACES
// ============================================================================

/**
 * Base account properties shared across representations
 */
interface IAccountBase {
  key: string;
  account_number: string;
  account_type: AccountType;
  balance: number;
  is_active: boolean;
}

/**
 * Base transaction properties shared across representations
 */
interface ITransactionBase {
  key: string;
  type: TransactionType;
  amount: number;
  balance_after: number;
  status: TransactionStatus;
}

// ============================================================================
// ACCOUNT INTERFACES
// ============================================================================

/**
 * Full account entity with internal fields
 * Used internally in repositories and services
 */
export interface IAccount extends IAccountBase, ITimestamps, ISoftDeletable {
  id?: number; // Database ID (internal use only)
  user_id?: number; // Database foreign key (internal use only)
}

/**
 * Public account representation (no internal IDs)
 * Used for API responses
 */
export interface IAccountPublic extends IAccountBase, ITimestamps {
  // All timestamps are always present in API responses
}

// ============================================================================
// TRANSACTION INTERFACES
// ============================================================================

/**
 * Full transaction entity with internal fields
 * Used internally in repositories and services
 */
export interface ITransaction extends ITransactionBase {
  id?: number; // Database ID (internal use only)
  account_id?: number; // Database foreign key (internal use only)
  description?: string;
  related_account_id?: number; // Database foreign key (internal use only)
  related_transaction_key?: string;
  created_at: Date;
}

/**
 * Public transaction representation (no internal IDs)
 * Used for API responses
 */
export interface ITransactionPublic extends ITransactionBase {
  description?: string;
  related_transaction_key?: string;
  created_at: Date;
}

// ============================================================================
// OPERATION INTERFACES
// ============================================================================

/**
 * Result of account operation (deposit/withdrawal)
 */
export interface IOperationResult {
  transactionKey: string;
  accountKey: string;
  amount: number;
  newBalance: number;
  type: TransactionType;
  timestamp: Date;
}

// ============================================================================
// TRANSFER INTERFACES
// ============================================================================

/**
 * Transfer request between accounts
 */
export interface ITransferRequest {
  fromAccountKey: string;
  toAccountKey: string;
  amount: number;
  description?: string;
}

/**
 * Transfer operation result
 */
export interface ITransferResult {
  transactionKey: string;
  fromAccountKey: string;
  toAccountKey: string;
  amount: number;
  newBalanceFrom: number;
  newBalanceTo: number;
  status: TransactionStatus;
  timestamp: Date;
}
