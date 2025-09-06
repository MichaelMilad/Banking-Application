import * as userRepository from './user.repository';

import { IUser } from '../../types/user.interfaces';
import { hardDeleteUser, activateUser } from './user.repository';

export const getUsersService = async (): Promise<IUser[]> => {
  return await userRepository.getUsers();
};

export const deleteUserService = async (userKey: string): Promise<void> => {
  return await userRepository.deleteUser(userKey);
};

export const hardDeleteUserService = async (userKey: string): Promise<void> => {
  return await userRepository.hardDeleteUser(userKey);
};

export const activateUserService = async (userKey: string): Promise<void> => {
  return await userRepository.activateUser(userKey);
};

export const createUserService = async (user: IUser): Promise<void> => {
  return await userRepository.createUser(user);
};
