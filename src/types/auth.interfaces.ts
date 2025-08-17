export interface ICreateUser {
  email: string;
  password: string;
}

export interface INewUser {
  key: string;
  username: string;
  email: string;
  password: string;
}

export interface IRECORD_OTP_CODE {
  id: number;
  user_key: string;
  otp_hash: string;
  created_at: Date;
  expires_at: Date;
}
