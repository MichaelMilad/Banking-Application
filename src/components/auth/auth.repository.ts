import knex from '../../config/knex';
import { ConflictError } from '../../utils/errors';
import { INewUser, IRECORD_OTP_CODE } from '../../types/auth.interfaces';

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

export const getUserOTP = async (userKey: string): Promise<IRECORD_OTP_CODE[]> => {
  try {
    return await knex('otp_codes').select('otp_hash', 'expires_at').where({
      user_key: userKey,
    });
  } catch (error) {
    throw error;
  }
};

export const deleteOTP = async (userKey: string): Promise<void> => {
  try {
    await knex('otp_codes').delete().where({
      user_key: userKey,
    });
    return;
  } catch (error: unknown) {
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
