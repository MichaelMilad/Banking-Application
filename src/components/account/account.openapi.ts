import { IComponentApiDocumentation } from '../../types/swagger.interfaces';

export const accountApiDoc: IComponentApiDocumentation = {
  paths: {
    '/accounts': {
      post: {
        tags: ['Accounts'],
        summary: 'Create a new account',
        description: 'Creates a new bank account for a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userKey', 'accountType'],
                properties: {
                  userKey: {
                    type: 'string',
                    format: 'uuid',
                    description: 'User UUID key',
                  },
                  accountType: {
                    type: 'string',
                    enum: ['checking', 'savings'],
                    description: 'Type of account',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Account created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Account' },
                  },
                },
              },
            },
          },
          '400': { description: 'Invalid input' },
          '404': { description: 'User not found' },
        },
      },
      get: {
        tags: ['Accounts'],
        summary: 'Get all accounts',
        description: 'Retrieves all active accounts',
        responses: {
          '200': {
            description: 'List of accounts',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Account' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/accounts/{accountKey}': {
      get: {
        tags: ['Accounts'],
        summary: 'Get account by key',
        description: 'Retrieves account details by UUID key',
        parameters: [
          {
            name: 'accountKey',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Account UUID key',
          },
        ],
        responses: {
          '200': {
            description: 'Account details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Account' },
                  },
                },
              },
            },
          },
          '404': { description: 'Account not found' },
        },
      },
    },
    '/accounts/user/{userKey}': {
      get: {
        tags: ['Accounts'],
        summary: 'Get user accounts',
        description: 'Retrieves all accounts belonging to a user with pagination',
        parameters: [
          {
            name: 'userKey',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'User UUID key',
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
            description: 'Page number',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
            description: 'Items per page',
          },
        ],
        responses: {
          '200': {
            description: 'List of user accounts with pagination',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Account' },
                    },
                    pagination: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
          '404': { description: 'User not found' },
        },
      },
    },
    '/accounts/{accountKey}/deposit': {
      post: {
        tags: ['Accounts'],
        summary: 'Deposit money',
        description: 'Deposits money into an account',
        parameters: [
          {
            name: 'accountKey',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Account UUID key',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['amount'],
                properties: {
                  amount: {
                    type: 'number',
                    minimum: 0.01,
                    description: 'Amount to deposit',
                  },
                  description: {
                    type: 'string',
                    description: 'Optional transaction description',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Deposit successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/OperationResult' },
                  },
                },
              },
            },
          },
          '400': { description: 'Invalid amount' },
          '404': { description: 'Account not found' },
        },
      },
    },
    '/accounts/{accountKey}/withdraw': {
      post: {
        tags: ['Accounts'],
        summary: 'Withdraw money',
        description: 'Withdraws money from an account',
        parameters: [
          {
            name: 'accountKey',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Account UUID key',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['amount'],
                properties: {
                  amount: {
                    type: 'number',
                    minimum: 0.01,
                    description: 'Amount to withdraw',
                  },
                  description: {
                    type: 'string',
                    description: 'Optional transaction description',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Withdrawal successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/OperationResult' },
                  },
                },
              },
            },
          },
          '400': { description: 'Invalid amount or insufficient funds' },
          '404': { description: 'Account not found' },
        },
      },
    },
    '/accounts/transfer': {
      post: {
        tags: ['Accounts'],
        summary: 'Transfer money between accounts',
        description: 'Transfers money from one account to another with concurrency control',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fromAccountKey', 'toAccountKey', 'amount'],
                properties: {
                  fromAccountKey: {
                    type: 'string',
                    format: 'uuid',
                    description: 'Source account UUID key',
                  },
                  toAccountKey: {
                    type: 'string',
                    format: 'uuid',
                    description: 'Destination account UUID key',
                  },
                  amount: {
                    type: 'number',
                    minimum: 0.01,
                    description: 'Amount to transfer',
                  },
                  description: {
                    type: 'string',
                    description: 'Optional transfer description',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Transfer successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/TransferResult' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid input, insufficient funds, or same account transfer',
          },
          '404': { description: 'One or both accounts not found' },
        },
      },
    },
    '/accounts/{accountKey}/transactions': {
      get: {
        tags: ['Accounts'],
        summary: 'Get transaction history',
        description: 'Retrieves transaction history for an account with pagination',
        parameters: [
          {
            name: 'accountKey',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Account UUID key',
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', minimum: 1, default: 1 },
            description: 'Page number',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 50 },
            description: 'Items per page',
          },
          {
            name: 'startDate',
            in: 'query',
            schema: { type: 'string', format: 'date-time' },
            description: 'Filter transactions from this date',
          },
          {
            name: 'endDate',
            in: 'query',
            schema: { type: 'string', format: 'date-time' },
            description: 'Filter transactions until this date',
          },
        ],
        responses: {
          '200': {
            description: 'Transaction history with pagination',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Transaction' },
                    },
                    pagination: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
          '404': { description: 'Account not found' },
        },
      },
    },
  },
  components: {
    schemas: {
      Account: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            format: 'uuid',
            description: 'Account UUID key',
          },
          account_number: {
            type: 'string',
            description: 'Unique account number',
          },
          account_type: {
            type: 'string',
            enum: ['checking', 'savings'],
            description: 'Account type',
          },
          balance: {
            type: 'number',
            description: 'Current account balance',
          },
          is_active: {
            type: 'boolean',
            description: 'Whether the account is active',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Account creation timestamp',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            format: 'uuid',
            description: 'Transaction UUID key',
          },
          type: {
            type: 'string',
            enum: ['credit', 'debit'],
            description: 'Transaction type',
          },
          amount: {
            type: 'number',
            description: 'Transaction amount',
          },
          balance_after: {
            type: 'number',
            description: 'Account balance after transaction',
          },
          description: {
            type: 'string',
            nullable: true,
            description: 'Transaction description',
          },
          related_transaction_key: {
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'UUID of the paired transaction for transfers',
          },
          status: {
            type: 'string',
            enum: ['pending', 'completed', 'failed', 'reversed'],
            description: 'Transaction status',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Transaction timestamp',
          },
        },
      },
      OperationResult: {
        type: 'object',
        description: 'Result of a deposit or withdrawal',
        properties: {
          transactionKey: { type: 'string', format: 'uuid' },
          accountKey: { type: 'string', format: 'uuid' },
          amount: { type: 'number' },
          newBalance: { type: 'number' },
          type: { type: 'string', enum: ['credit', 'debit'] },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      TransferResult: {
        type: 'object',
        description: 'Result of a transfer between two accounts',
        properties: {
          transactionKey: {
            type: 'string',
            format: 'uuid',
            description: 'UUID of the debit (source) transaction',
          },
          fromAccountKey: { type: 'string', format: 'uuid' },
          toAccountKey: { type: 'string', format: 'uuid' },
          amount: { type: 'number' },
          newBalanceFrom: { type: 'number' },
          newBalanceTo: { type: 'number' },
          status: {
            type: 'string',
            enum: ['pending', 'completed', 'failed', 'reversed'],
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          limit: { type: 'integer' },
          total: { type: 'integer' },
          totalPages: { type: 'integer' },
          hasNextPage: { type: 'boolean' },
          hasPreviousPage: { type: 'boolean' },
        },
      },
    },
  },
};
