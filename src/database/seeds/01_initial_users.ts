import { Knex } from 'knex';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  const hashedPassword = await bcrypt.hash('password123', 10);

  await knex('users').insert([
    {
      key: uuidv4(),
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key: uuidv4(),
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      key: uuidv4(),
      username: 'testuser2',
      email: 'test2@example.com',
      password: hashedPassword,
      role: 'user',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
