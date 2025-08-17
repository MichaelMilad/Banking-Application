import { Request, Response, NextFunction } from "express";
import * as userService from "./user.service";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getUsersService();

    res.status(200).json({
      message: "Users List",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Request Params:: ', req.params)
      const { userKey } = req.params;
      await userService.deleteUserService(userKey);
      res.status(204).json({
        message: 'User Deleted Successfully!',
        key: userKey,
      })
    } catch (error) {
      next(error);
    }
  }
]
