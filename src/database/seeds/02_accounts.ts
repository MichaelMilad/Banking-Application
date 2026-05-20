import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  await knex('accounts').del();

  const user1 = await knex('users').where({ username: 'testuser' }).first('id');
  const user2 = await knex('users').where({ username: 'testuser2' }).first('id');

  if (!user1 || !user2) {
    throw new Error('Seed users not found — run 01_initial_users first.');
  }

  // Final balances reflect the transactions seeded in 03_transactions.
  await knex('accounts').insert([
    {
      key: uuidv4(),
      user_id: user1.id,
      account_number: '1000000001',
      account_type: 'checking',
      balance: 4300.0,
      is_active: true,
    },
    {
      key: uuidv4(),
      user_id: user1.id,
      account_number: '1000000002',
      account_type: 'savings',
      balance: 2450.0,
      is_active: true,
    },
    {
      key: uuidv4(),
      user_id: user2.id,
      account_number: '2000000001',
      account_type: 'checking',
      balance: 3150.0,
      is_active: true,
    },
    {
      key: uuidv4(),
      user_id: user2.id,
      account_number: '2000000002',
      account_type: 'savings',
      balance: 1100.0,
      is_active: true,
    },
  ]);
}
