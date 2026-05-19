import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('otp_codes', (table) => {
    table.increments('id').primary();
    table.uuid('user_key').notNullable();
    table.string('otp_hash', 60).notNullable();

    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('expires_at').notNullable();

    table.foreign('user_key').references('key').inTable('users').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('otp_codes');
}
