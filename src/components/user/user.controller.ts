import { Request, Response } from 'express';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = [
      { id: 1, name: 'Alice Smith', email: 'alice.smith@example.com' },
      { id: 2, name: 'Bob Johnson', email: 'bob.johnson@example.com' },
    ];

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
