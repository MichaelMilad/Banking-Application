import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.uuid('key').notNullable().unique().index();
    table.integer('account_id').unsigned().notNullable();
    table.enum('type', ['credit', 'debit']).notNullable();
    table.decimal('amount', 15, 2).notNullable();
    table.decimal('balance_after', 15, 2).notNullable();
    table.string('description', 255).nullable();
    table.integer('related_account_id').unsigned().nullable();
    table.uuid('related_transaction_key').nullable();
    table.enum('status', ['pending', 'completed', 'failed', 'reversed'])
      .notNullable()
      .defaultTo('completed');
    
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    // Foreign key constraints
    table.foreign('account_id').references('id').inTable('accounts').onDelete('CASCADE');
    table.foreign('related_account_id').references('id').inTable('accounts').onDelete('SET NULL');
    
    // Indexes for performance
    table.index('account_id');
    table.index('created_at');
    table.index(['account_id', 'created_at']);
    table.index('related_transaction_key');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('transactions');
}

