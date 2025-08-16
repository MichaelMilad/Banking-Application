import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import * as authRepository from './auth.repository';
import { sendOTPEmail } from '../../utils/mailing';

const SALT_ROUNDS = 10;
const EXPIRATION_TIME = 10 * 60 * 1000;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const createUserService = async (email: string, username: string, password: string): Promise<string> => {
  const userKey = uuidv4();
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    await authRepository.createUser({
      key: userKey,
      username,
      email,
      password: hashedPassword,
    });

    const otp = generateOTP();
    const otp_hash = await bcrypt.hash(otp, SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + EXPIRATION_TIME);
    await authRepository.enlistOTP(userKey, otp_hash, expiresAt);
    await sendOTPEmail(email, username, otp);

    return userKey;
  } catch (error) {
    console.error('Failed to create user or enlist OTP. Attempting to rollback...');
    try {
      await authRepository.hardDeleteUser(userKey);
      console.log('User record rolled back successfully.');
    } catch (rollbackError) {
      console.error('Failed to roll back user record:', rollbackError);
    }
    throw error;
  }
};
