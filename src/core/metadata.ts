export const CONTROLLER_META = 'controller:metadata';
export const ROUTES_META = 'controller:routes';
export const PARAM_META = 'controller:params';
export const MIDDLEWARE_META = 'controller:middlewares';
export const INTERCEPTOR_META = 'controller:interceptor';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
export type ParamType = 'body' | 'query' | 'param' | 'request' | 'response' | 'headers' | 'cookies';
export type MiddlewareFunction = (req: any, res: any, next: Function) => void;
export type InterceptorFunction = (data: any, req: any, res: any) => any;

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handlerName: string;
  middleware: MiddlewareFunction[];
}

export interface ControllerDefinition {
  basePath: string;
  middleware: MiddlewareFunction[];
}

export interface ParamDefinition {
  index: number;
  type: ParamType;
  name?: string;
}

export interface InterceptorDefinition {
  handlerName: string;
  interceptor: InterceptorFunction;
}
