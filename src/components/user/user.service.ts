import * as userRepository from "./user.repository";

import { IUser } from "../../types/user.interfaces";

export const getUsersService = async (): Promise<IUser[]> => {
  return await userRepository.getUsers();
};

export const deleteUserService = async (userKey: string): Promise<void> => {
  return await userRepository.deleteUser(userKey);
}
