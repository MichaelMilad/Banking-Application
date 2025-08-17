import knex from '../../config/knex';

interface IUser {
  username: string;
  email: string;
  key: string;
}

export const getUsers = async (): Promise<IUser[]> => {
  return await knex.select('key', 'username', 'email', 'is_active', 'created_at', 'updated_at').from('users');
};

export const deleteUser = async (userKey: string): Promise<void> => {
  try {
    await knex('users').delete().where({
      key: userKey,
    });
    return;
  } catch (error: unknown) {
    throw error;
  }
};
