import knex from '../../config/knex';
import { ConflictError } from '../../utils/errors';
import { IUser } from '../../types/user.interfaces';

export const getUsers = async (): Promise<IUser[]> => {
  return await activeUsers()
    .select('key', 'username', 'email', 'is_active', 'created_at', 'updated_at')
    .from('users');
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

export const hardDeleteUser = async (userKey: string): Promise<void> => {
  try {
    await knex('users').delete().where({
      key: userKey,
    });
    return;
  } catch (error: unknown) {
    throw error;
  }
};

export const getUserForLogin = async (identifier: string): Promise<any> => {
  try {
    return await activeUsers()
      .select('key', 'email', 'username', 'password')
      .where({ username: identifier })
      .orWhere({ email: identifier })
      .first();
  } catch (error: unknown) {
    throw error;
  }
};

const activeUsers = () => {
  return knex('users')
    .where({ is_active: true })
    .andWhere({ deleted_at: null });
};

export const createUser = async (user: IUser): Promise<void> => {
  try {
    return await knex('users').insert(user);
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'errno' in error &&
      error.errno === 1062
    ) {
      throw new ConflictError('A user with this email already exists.');
    }
    throw error;
  }
};
export const activateUser = async (userKey: string): Promise<void> => {
  try {
    await knex('users')
      .update({
        is_active: true,
      })
      .where({
        key: userKey,
      });
    return;
  } catch (error) {
    throw error;
  }
};
