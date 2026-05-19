import * as userRepository from './user.repository';
import { IUserPublic, IUserSearchParams, IUserPaginationResult, IUserCreate } from './user.interfaces';

export const getUsersService = async (): Promise<IUserPublic[]> => {
  return await userRepository.getUsers();
};

export const getUserByKeyService = async (userKey: string): Promise<IUserPublic> => {
  const user = await userRepository.getUserByKey(userKey);
  return user!; // getUserByKey throws NotFoundError if user doesn't exist
};

export const searchUsersService = async (params: IUserSearchParams): Promise<IUserPaginationResult> => {
  return await userRepository.searchUsers(params);
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

export const createUserService = async (user: IUserCreate): Promise<void> => {
  return await userRepository.createUser(user);
};
