import { Request, Response, NextFunction } from 'express';
import * as accountService from './account.service';
import { AccountType } from './account.interfaces';

export const getAccounts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accounts = await accountService.getAccounts();
    res.status(200).json({
      message: 'Accounts retrieved successfully',
      data: accounts,
    });
  } catch (error) {
    next(error);
  }
}

export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userKey, accountType } = req.body;
    
    const account = await accountService.createAccount(userKey, accountType as AccountType);

    res.status(201).json({
      message: 'Account created successfully',
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

export const getAccountByKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accountKey } = req.params;
    
    const account = await accountService.getAccountByKey(accountKey);

    res.status(200).json({
      message: 'Account retrieved successfully',
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserAccounts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userKey } = req.params;
    const { page = '1', limit = '10' } = req.query;
    
    const result = await accountService.getUserAccounts(
      userKey,
      parseInt(page as string, 10),
      parseInt(limit as string, 10)
    );

    res.status(200).json({
      message: 'Accounts retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const deposit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accountKey } = req.params;
    const { amount, description } = req.body;
    
    const result = await accountService.deposit(accountKey, amount, description);

    res.status(200).json({
      message: 'Deposit successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const withdraw = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accountKey } = req.params;
    const { amount, description } = req.body;
    
    const result = await accountService.withdraw(accountKey, amount, description);

    res.status(200).json({
      message: 'Withdrawal successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const transfer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fromAccountKey, toAccountKey, amount, description } = req.body;
    
    const result = await accountService.transfer({
      fromAccountKey,
      toAccountKey,
      amount,
      description,
    });

    res.status(200).json({
      message: 'Transfer successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accountKey } = req.params;
    const { startDate, endDate, page = '1', limit = '50', type } = req.query;
    
    const result = await accountService.getTransactionHistory(
      accountKey,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
      parseInt(page as string, 10),
      parseInt(limit as string, 10)
    );

    res.status(200).json({
      message: 'Transaction history retrieved successfully',
      data: result.transactions,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
