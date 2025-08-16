import knex from "../../config/knex";

interface IUser {
  username: string;
  email: string;
  key: string;
}

export const getUsers = async (): Promise<IUser[]> => {
  return await knex.select("key", "username", "email").from("users");
};
