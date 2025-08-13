import { OpenAPIV3 } from 'openapi-types';

export interface IComponentApiDocumentation {
  paths: OpenAPIV3.PathsObject;
  components: OpenAPIV3.ComponentsObject;
}
