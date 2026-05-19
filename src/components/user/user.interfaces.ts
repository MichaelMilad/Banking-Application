/**
 * User Module Types and Interfaces
 */

import { IPaginatedResponse, ITimestamps, ISoftDeletable } from '../../types/common';

// ============================================================================
// BASE INTERFACES
// ============================================================================

export type UserRole = 'user' | 'admin';

/**
 * Base user properties shared across all user representations
 */
interface IUserBase {
  key: string;
  username: string;
  email: string;
  role: UserRole;
}

// ============================================================================
// MAIN INTERFACES
// ============================================================================

/**
 * Full user entity with all fields (including password and internal flags)
 * Used internally in repositories and services
 */
export interface IUser extends IUserBase, ITimestamps, ISoftDeletable {
  password: string;
  is_active: boolean;
}

/**
 * User data for creation (only required fields, DB handles timestamps and defaults)
 */
export interface IUserCreate {
  key: string;
  username: string;
  email: string;
  password: string;
  role?: UserRole; // Defaults to 'user' in DB
  is_active?: boolean; // Defaults to false in DB
}

/**
 * Public user representation (no password, no soft delete info)
 * Used for API responses
 */
export interface IUserPublic extends IUserBase, ITimestamps {
  is_active: boolean;
}

// ============================================================================
// SEARCH AND PAGINATION INTERFACES
// ============================================================================

/**
 * Search and filter parameters for user queries
 */
export interface IUserSearchParams {
  search?: string; // Search by username or email
  isActive?: boolean; // Filter by active status
  page?: number;
  limit?: number;
  sortBy?: 'username' | 'email' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated user search result
 * Uses common pagination structure
 */
export interface IUserPaginationResult extends IPaginatedResponse<IUserPublic> {
  // Inherits data and pagination from IPaginatedResponse
}
