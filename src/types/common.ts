/**
 * Common Types and Interfaces
 * These are used across multiple modules (3+)
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

// ============================================================================
// API RESPONSE INTERFACES
// ============================================================================

export interface IApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface IApiError {
  success: false;
  error: string;
  statusCode: number;
  details?: unknown;
}

// ============================================================================
// PAGINATION INTERFACES
// ============================================================================

export interface IPaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: IPaginationMeta;
}

// ============================================================================
// DATE RANGE INTERFACES
// ============================================================================

export interface IDateRange {
  startDate: Date;
  endDate: Date;
}

export interface IDateRangeOptional {
  startDate?: Date;
  endDate?: Date;
}

// ============================================================================
// COMMON ENTITY PATTERNS
// ============================================================================

export interface ITimestamps {
  created_at: Date;
  updated_at: Date;
}

export interface ISoftDeletable {
  deleted_at: Date | null;
}

export interface IEntity extends ITimestamps, ISoftDeletable {
  id: string;
}

// ============================================================================
// QUERY FILTERS
// ============================================================================

export interface IBaseFilter {
  search?: string;
  isActive?: boolean;
  includeDeleted?: boolean;
}

export interface IDateFilter extends IDateRangeOptional {
  // Additional date filtering options
}
