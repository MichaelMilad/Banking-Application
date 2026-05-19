import { IComponentApiDocumentation } from '../../types/swagger.interfaces';

export const authApiDoc: IComponentApiDocumentation = {
  paths: {
    '/auth/signup': {
      post: {
        summary: 'Creates a new user',
        tags: ['Auth'],
        security: [],
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
        security: [],
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
        description:
          'Returns the access token and user profile in the body. The refresh token is set as an httpOnly cookie (sameSite=strict, path=/auth).',
        tags: ['Auth'],
        security: [],
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
            description: 'Login successful',
            headers: {
              'Set-Cookie': {
                schema: {
                  type: 'string',
                  example:
                    'refreshToken=<jwt>; HttpOnly; SameSite=Strict; Path=/auth; Max-Age=604800',
                },
                description: 'httpOnly refresh token cookie',
              },
            },
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    accessToken: { type: 'string' },
                    user: { $ref: '#/components/schemas/UserPublic' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get current authenticated user',
        tags: ['Auth'],
        responses: {
          '200': {
            description: 'The authenticated user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/UserPublic' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Missing or invalid token',
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
      UserPublic: {
        type: 'object',
        properties: {
          key: { type: 'string', format: 'uuid' },
          username: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['user', 'admin'] },
          is_active: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
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
