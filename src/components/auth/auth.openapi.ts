import { IComponentApiDocumentation } from '../../types/swagger.interfaces';

export const authApiDoc: IComponentApiDocumentation = {
  paths: {
    '/auth/signup': {
      post: {
        summary: 'Creates a new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SignupRequest' },
            },
          },
        },
        responses: {
          '201': {
            description: 'The user was successfully created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    key: {
                      type: 'string',
                    },
                  },
                },
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
    '/auth/verify': {
      post: {
        summary: 'Verifies User via OTP',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OTPVerificationRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'The user was successfully created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                    },
                  },
                },
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
    '/auth/login': {
      post: {
        summary: 'User Login',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'The user was successfully created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                    },
                    accessToken: {
                      type: 'string',
                    },
                    refreshToken: {
                      type: 'string',
                    },
                  },
                },
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
      SignupRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            description: 'The Email of the user.',
            format: 'email',
          },
          username: {
            type: 'string',
            description: 'The name of the user.',
          },
          password: {
            type: 'string',
            description: "The user's email address.",
          },
        },
        required: ['email', 'password'],
      },
      OTPVerificationRequest: {
        type: 'object',
        properties: {
          userKey: { type: 'string', format: 'uuid' },
          otp: { type: 'string', description: 'The one-time password' },
        },
        required: ['userKey', 'otp'],
      },
      LoginRequest: {
        type: 'object',
        required: ['password'],
        properties: {
          password: {
            type: 'string',
            description: 'User Password',
          },
        },
        oneOf: [
          {
            properties: {
              email: {
                type: 'string',
                description: 'User Email',
              },
            },
            required: ['email'],
          },
          {
            properties: {
              username: {
                type: 'string',
                description: 'Username',
              },
            },
            required: ['username'],
          },
        ],
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
