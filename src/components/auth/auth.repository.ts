import knex from '../../config/knex';
import { ConflictError } from '../../utils/errors';
import { INewUser } from '../../types/auth.interfaces';

export const createUser = async (user: INewUser): Promise<void> => {
  try {
    return await knex('users').insert(user);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'errno' in error && error.errno === 1062) {
      throw new ConflictError('A user with this email already exists.');
    }
    throw error;
  }
};

export const enlistOTP = async (userKey: string, otp: string, expiresAt: Date): Promise<void> => {
  try {
    return await knex('otp_codes').insert({
      user_key: userKey,
      otp_hash: otp,
      expires_at: expiresAt,
    });
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
