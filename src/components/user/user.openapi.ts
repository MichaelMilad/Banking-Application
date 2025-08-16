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
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'The unique ID of the user.' },
          name: { type: 'string', description: 'The full name of the user.' },
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
