import { IAccessTokenPayload } from '../components/auth/auth.interfaces';

declare global {
  namespace Express {
    interface Request {
      user?: IAccessTokenPayload;
    }
  }
}

export {};
