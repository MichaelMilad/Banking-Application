import { IComponentApiDocumentation } from '../../types/swagger.interfaces';

export const userApiDoc: IComponentApiDocumentation = {
  paths: {
    '/users': {
      get: {
        summary: 'Returns a list of all users',
        tags: ['Users'],
        responses: {
          '200': {
            description: 'The list of users',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users/search': {
      get: {
        summary: 'Search users with pagination',
        tags: ['Users'],
        parameters: [
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Search by username or email',
          },
          {
            in: 'query',
            name: 'isActive',
            schema: { type: 'boolean' },
            description: 'Filter by active status',
          },
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', minimum: 1, default: 1 },
            description: 'Page number',
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
            description: 'Items per page',
          },
          {
            in: 'query',
            name: 'sortBy',
            schema: {
              type: 'string',
              enum: ['username', 'email', 'created_at'],
              default: 'created_at',
            },
            description: 'Field to sort by',
          },
          {
            in: 'query',
            name: 'sortOrder',
            schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
            description: 'Sort order',
          },
        ],
        responses: {
          '200': {
            description: 'Paginated users list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' },
                    },
                    pagination: { $ref: '#/components/schemas/PaginationMeta' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users/{key}': {
      get: {
        summary: 'Get a user by key',
        parameters: [
          {
            in: 'path',
            name: 'key',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Unique User Key',
          },
        ],
        tags: ['Users'],
        responses: {
          '200': {
            description: 'User details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Deletes a user',
        parameters: [
          {
            in: 'path',
            name: 'key',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Unique User Key',
          },
        ],
        tags: ['Users'],
        responses: {
          '204': {
            description: 'User deleted !',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          key: {
            type: 'string',
            format: 'uuid',
            description: 'The unique key of the user.',
          },
          username: {
            type: 'string',
            description: 'The full name of the user.',
          },
          email: {
            type: 'string',
            format: 'email',
            description: "The user's email address.",
          },
          is_active: {
            type: 'boolean',
            description: 'Whether the user is active',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'User creation timestamp',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
          },
        },
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer', description: 'Current page number' },
          limit: { type: 'integer', description: 'Items per page' },
          total: { type: 'integer', description: 'Total number of items' },
          totalPages: { type: 'integer', description: 'Total number of pages' },
          hasNextPage: { type: 'boolean', description: 'Whether there is a next page' },
          hasPreviousPage: { type: 'boolean', description: 'Whether there is a previous page' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          code: { type: 'number' },
        },
      },
    },
  },
};
