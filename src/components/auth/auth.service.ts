import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import * as authRepository from './auth.repository';
import * as userRepository from '../user/user.repository';
import { sendOTPEmail } from '../../utils/mailing';
import { NotFoundError, BadRequestError } from '../../utils/errors';
import { IUser } from '../../types/user.interfaces';

const SALT_ROUNDS = 10;
const EXPIRATION_TIME = 10 * 60 * 1000;
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateAccessToken(user: IUser): string {
  const payload = {
    sub: user.key,
    email: user.email,
    key: user.key,
    username: user.username,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(userKey: string): string {
  const payload = {
    sub: userKey,
  };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export const createUserService = async (
  email: string,
  username: string,
  password: string,
): Promise<string> => {
  const userKey = uuidv4();
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    await userRepository.createUser({
      key: userKey,
      username,
      email,
      password: hashedPassword,
    });

    await authRepository.deleteOTP(userKey);

    const otp = generateOTP();
    const otp_hash = await bcrypt.hash(otp, SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + EXPIRATION_TIME);
    await authRepository.enlistOTP(userKey, otp_hash, expiresAt);
    await sendOTPEmail(email, username, otp);

    return userKey;
  } catch (error) {
    console.error(
      'Failed to create user or enlist OTP. Attempting to rollback...',
    );
    try {
      await userRepository.hardDeleteUser(userKey);
      console.log('User record rolled back successfully.');
    } catch (rollbackError) {
      console.error('Failed to roll back user record:', rollbackError);
    }
    throw error;
  }
};

export const verifyOTP = async (userKey: string, otp: string) => {
  try {
    const userOTP = await authRepository.getUserOTP(userKey);

    if (userOTP.length === 0)
      throw new NotFoundError('OTP Not Found on the system');
    const otpRecord = userOTP[0];

    const isExpired = new Date() > new Date(otpRecord.expires_at);
    if (isExpired) {
      await authRepository.deleteOTP(userKey);
      throw new BadRequestError(
        'Entered OTP has expired, please request a new one!',
      );
    }

    const isValidOTP = await bcrypt.compare(otp, otpRecord.otp_hash);

    if (!isValidOTP)
      throw new BadRequestError('Entered OTP is invalid, please try again!');

    await userRepository.activateUser(userKey);
    await authRepository.deleteOTP(userKey);
    return;
  } catch (error) {
    throw error;
  }
};

export const login = async (
  password: string,
  identifier: string,
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = await userRepository.getUserForLogin(identifier);
    console.log(user);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestError('Invalid credentials.');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.key);

    return {
      accessToken,
      refreshToken,
    };
  } catch (error: unknown) {
    throw error;
  }
};
