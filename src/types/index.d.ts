export type ConfigSchema = {
  [key: string]: {
    required: boolean;
    defaultValue?: string;
    description?: string;
  };
};
