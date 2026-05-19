import knex from '../../config/knex';
import { IOtpRecord } from './auth.interfaces';

export const enlistOTP = async (
  userKey: string,
  otp: string,
  expiresAt: Date,
): Promise<void> => {
  await knex('otp_codes').insert({
    user_key: userKey,
    otp_hash: otp,
    expires_at: expiresAt,
  });
};

export const getUserOTP = async (
  userKey: string,
): Promise<IOtpRecord[]> => {
  return await knex('otp_codes').select('otp_hash', 'expires_at').where({
    user_key: userKey,
  });
};

export const deleteOTP = async (userKey: string): Promise<void> => {
  await knex('otp_codes').delete().where({
    user_key: userKey,
  });
};
