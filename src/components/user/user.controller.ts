import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await userService.getUsersService();

    res.status(200).json({
      message: 'Users List',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userKey } = req.params;
    const user = await userService.getUserByKeyService(userKey);

    res.status(200).json({
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      search,
      isActive,
      page = '1',
      limit = '10',
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = req.query;

    const result = await userService.searchUsersService({
      search: search as string,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sortBy: sortBy as 'username' | 'email' | 'created_at',
      sortOrder: sortOrder as 'asc' | 'desc',
    });

    res.status(200).json({
      message: 'Users retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log('Request Params:: ', req.params);
    const { userKey } = req.params;
    await userService.deleteUserService(userKey);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
