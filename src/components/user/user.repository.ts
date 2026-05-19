import knex from '../../config/knex';
import { ConflictError, NotFoundError } from '../../utils/errors';
import { IUser, IUserPublic, IUserSearchParams, IUserPaginationResult, IUserCreate } from './user.interfaces';

export const getUsers = async (): Promise<IUserPublic[]> => {
  return await activeUsers()
    .select('key', 'username', 'email', 'role', 'is_active', 'created_at', 'updated_at')
    .from('users');
};

export const getUserByKey = async (userKey: string): Promise<IUserPublic | undefined> => {
  const user = await activeUsers()
    .select('key', 'username', 'email', 'role', 'is_active', 'created_at', 'updated_at')
    .where({ key: userKey })
    .first();

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

export const searchUsers = async (params: IUserSearchParams): Promise<IUserPaginationResult> => {
  const {
    search,
    isActive,
    page = 1,
    limit = 10,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = params;

  // Build query
  let query = knex('users').where({ deleted_at: null });

  // Apply filters
  if (isActive !== undefined) {
    query = query.where({ is_active: isActive });
  }

  if (search) {
    query = query.where((builder) => {
      builder
        .where('username', 'like', `%${search}%`)
        .orWhere('email', 'like', `%${search}%`);
    });
  }

  // Get total count
  const countQuery = query.clone();
  const [{ count }] = await countQuery.count('* as count');
  const total = Number(count);

  // Calculate pagination
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  // Apply sorting and pagination
  const data = await query
    .select('key', 'username', 'email', 'role', 'is_active', 'created_at', 'updated_at')
    .orderBy(sortBy, sortOrder)
    .limit(limit)
    .offset(offset);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const deleteUser = async (userKey: string): Promise<void> => {
  // Soft delete: just mark as deleted
  await knex('users')
    .update({ deleted_at: knex.fn.now() })
    .where({ key: userKey });
};

export const hardDeleteUser = async (userKey: string): Promise<void> => {
  // Hard delete: permanently remove from database
  await knex('users').delete().where({
    key: userKey,
  });
};

export const getUserForLogin = async (identifier: string): Promise<IUser | undefined> => {
  return await activeUsers()
    .select('key', 'email', 'username', 'password', 'role', 'is_active', 'created_at', 'updated_at')
    .where({ username: identifier })
    .orWhere({ email: identifier })
    .first();
};

const activeUsers = () => {
  return knex('users')
    .where({ is_active: true })
    .andWhere({ deleted_at: null });
};

export const createUser = async (user: IUserCreate): Promise<void> => {
  try {
    return await knex('users').insert(user);
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'errno' in error &&
      error.errno === 1062
    ) {
      throw new ConflictError('A user with this email already exists.');
    }
    throw error;
  }
};
export const activateUser = async (userKey: string): Promise<void> => {
  await knex('users')
    .update({
      is_active: true,
    })
    .where({
      key: userKey,
    });
};
