import { Method } from 'axios';

export interface Route {
  type: string;
  method: Method;
  path: string;
}

export interface RouteWithParams<T extends Function = (...args: any[]) => string> {
  type: string;
  method: Method;
  path: T;
}
