import { OpenAPIV3 } from 'openapi-types';

import { IComponentApiDocumentation } from '../types/swagger.interfaces';
import { userApiDoc } from '../components/user/user.openapi';

// The base OpenAPI specification, defining global info, servers, and shared schemas.
const baseApiSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Banking Application API',
    version: '1.0.0',
    description: 'API documentation for the banking application.',
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {},
  components: {},
};

// The registry where we store documentation.
const swaggerRegistry: OpenAPIV3.Document = {
  ...baseApiSpec,
};

/**
 * A function to programmatically register OpenAPI path objects.
 * This is called once at server startup.
 * @param docs The OpenAPI PathsObject to be registered.
 */
export const registerSwaggerDocs = (docs: IComponentApiDocumentation): void => {
  if (swaggerRegistry.paths) {
    swaggerRegistry.paths = { ...swaggerRegistry.paths, ...docs.paths };
  }
  if (swaggerRegistry.components && docs.components && docs.components.schemas) {
    swaggerRegistry.components.schemas = {
      ...swaggerRegistry.components.schemas,
      ...docs.components.schemas,
    };
  }
};

/**
 * Returns the complete API spec.
 */
export const getFullApiSpec = (): OpenAPIV3.Document => {
  return swaggerRegistry;
};

export const initializeSwagger = (): void => {
  // Register paths for the users component.
  registerSwaggerDocs(userApiDoc);
  // Add other components here as your application grows, e.g.:
  // registerSwaggerPaths(authPaths);
  // registerSwaggerPaths(accountPaths);
};
