import * as userRepository from "./user.repository";

interface IUser {
  username: string;
  email: string;
  key: string;
}

export const getUsersService = async (): Promise<IUser[]> => {
  return await userRepository.getUsers();
};
