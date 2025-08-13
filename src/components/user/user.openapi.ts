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
      post: {
        summary: 'Creates a new user',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
            },
          },
        },
        responses: {
          '201': {
            description: 'The user was successfully created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
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
