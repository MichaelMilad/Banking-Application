import { Request, Response, NextFunction } from "express";
import * as userService from "./user.service";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // The controller calls the service layer to perform the core logic
    const users = await userService.getUsersService();

    res.status(200).json({
      message: "Users List",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
