import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('accounts', (table) => {
    table.increments('id').primary();
    table.uuid('key').notNullable().unique().index();
    table.integer('user_id').unsigned().notNullable();
    table.string('account_number', 20).notNullable().unique();
    table.enum('account_type', ['checking', 'savings']).notNullable();
    table.decimal('balance', 15, 2).notNullable().defaultTo(0);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('deleted_at').nullable();
    
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(
      knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    );

    // Foreign key constraint
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Indexes for performance
    table.index('user_id');
    table.index('account_number');
    table.index(['is_active', 'deleted_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('accounts');
}

