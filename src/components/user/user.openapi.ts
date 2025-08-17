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
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
      },
    },
    '/users/{key}': {
      delete: {
        summary: 'Deletes a user',
        parameters: [{
          in: 'path',
          name: 'key',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Unique User Key'
        }],
        tags: ['Users'],
        responses: {
          '204': {
            description: 'The list of users',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    key: {
                      type: 'string'
                    }
                  }
                },
              },
            },
          },
        },
      },
    }
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          key: { type: 'number', description: 'The unique key of the user.' },
          username: { type: 'string', description: 'The full name of the user.' },
          email: { type: 'string', format: 'email', description: "The user's email address." },
        },
        required: ['name', 'email'],
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
