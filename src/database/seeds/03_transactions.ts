import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

type TransferInput = {
  fromId: number;
  toId: number;
  amount: number;
  description: string;
};

export async function seed(knex: Knex): Promise<void> {
  await knex('transactions').del();

  const accounts = await knex('accounts').select('id', 'account_number');
  const byNumber = new Map(accounts.map((a) => [a.account_number, a.id as number]));

  const u1c = byNumber.get('1000000001')!;
  const u1s = byNumber.get('1000000002')!;
  const u2c = byNumber.get('2000000001')!;
  const u2s = byNumber.get('2000000002')!;

  // Starting balances (must match what 02_accounts implies before transfers).
  const balances: Record<number, number> = {
    [u1c]: 5000,
    [u1s]: 2000,
    [u2c]: 3000,
    [u2s]: 1000,
  };

  const transfers: TransferInput[] = [
    { fromId: u1c, toId: u1s, amount: 500, description: 'Internal: checking to savings' },
    { fromId: u1s, toId: u1c, amount: 200, description: 'Internal: savings to checking' },
    { fromId: u1c, toId: u2c, amount: 300, description: 'Payment to testuser2' },
    { fromId: u2c, toId: u1s, amount: 150, description: 'Refund from testuser2' },
    { fromId: u1c, toId: u2s, amount: 100, description: 'Gift to testuser2 savings' },
  ];

  const rows: Knex.DbRecord<unknown>[] = [];
  const now = Date.now();
  let offset = 0;

  for (const t of transfers) {
    balances[t.fromId] -= t.amount;
    balances[t.toId] += t.amount;

    const debitKey = uuidv4();
    const creditKey = uuidv4();
    const createdAt = new Date(now + offset);
    offset += 1000;

    rows.push({
      key: debitKey,
      account_id: t.fromId,
      type: 'debit',
      amount: t.amount,
      balance_after: balances[t.fromId],
      description: t.description,
      related_account_id: t.toId,
      related_transaction_key: creditKey,
      status: 'completed',
      created_at: createdAt,
    });

    rows.push({
      key: creditKey,
      account_id: t.toId,
      type: 'credit',
      amount: t.amount,
      balance_after: balances[t.toId],
      description: t.description,
      related_account_id: t.fromId,
      related_transaction_key: debitKey,
      status: 'completed',
      created_at: createdAt,
    });
  }

  await knex('transactions').insert(rows);
}
