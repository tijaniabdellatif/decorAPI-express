import 'reflect-metadata';
import { debug } from './utils/log-debugger.js';

export class Container {
  private static instance: Container = new Container();
  private services: Map<string, any> = new Map();

  /**
   * @description function to get single instance of the container
   * @returns Container instance
   */
  static getInstance(): Container {
    return Container.instance;
  }

  /**
   * @description register services to the container
   * @param token
   * @param implementation
   */
  register(token: string, implementation: any): void {
    this.services.set(token, implementation);
  }

  get(token: string): any {
    if (!this.services.has(token)) {
      debug.error('No provider registred for this token', token, {
        showTimestamp: true,
        maxDepth: 2,
        colorizeKeys: true,
        indentSize: 3,
      });
      return;
    }
    return this.services.get(token);
  }

  /**
   * @description check if a service exist in a given container
   * @param token
   * @returns {boolean}
   */
  has(token: string): boolean {
    return this.services.has(token);
  }

  /**
   * @description resolve the metadata to the container
   * @param {Array} target
   * @returns {any} the according service
   */
  resolve<T>(target: new (...args: any[]) => T): T {
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
    const injectionTokens = Reflect.getMetadata('custom:inject', target) || {};

    const dependencies = paramTypes.map((_: any, index: number) => {
      const token = injectionTokens[index];
      if (!token) {
        debug.error(`Missing injection token for parameter ${index} in : `, target.name, {
          showTimestamp: true,
          maxDepth: 2,
          colorizeKeys: true,
          indentSize: 3,
        });

        return;
      }
      return this.get(token);
    });

    return new target(...dependencies);
  }

  /**
   * @description get all the services injected to the container
   * @returns {Array} the services injected
   */
  getAllTokens(): string[] {
    return Array.from(this.services.keys());
  }
}
