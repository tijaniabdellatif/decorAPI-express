import { type ConfigSchema } from '@/types/index.js';
export class EnvConfig {
  private static instance: EnvConfig;
  private config: Record<string, string> = {};

  private constructor(schema: ConfigSchema) {
    this.loadConfig(schema);
  }

  public static getInstance(schema?: ConfigSchema): EnvConfig {
    if (!EnvConfig.instance) {
      if (!schema) {
        throw new Error('Config environnement variables is required');
      }

      EnvConfig.instance = new EnvConfig(schema);
    }

    return EnvConfig.instance;
  }

  private loadConfig(schema: ConfigSchema): void {
    for (const key in schema) {
      const { required, defaultValue, description: _ } = schema[key];
      const value = process.env[key] || defaultValue;
      if (required && !value && !defaultValue) {
        throw new Error('Missing required environment variable: ' + key);
      }

      this.config[key] = value || defaultValue || '';
    }
  }

  public get(key: string): string {
    if (key in this.config) {
      return this.config[key].toString();
    }

    throw new Error('Missing required environment variable: ' + key);
  }
}
