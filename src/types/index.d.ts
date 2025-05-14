/**
 * Configuration options for env variables
 */
export type ConfigSchema = {
  [key: string]: {
    /** Whether the variable is required */
    required: boolean;
    /** Default value for the variable */
    defaultValue?: string;
    /** Description of the variable */
    description?: string;
  };
};

/**
 * Configuration options for the log debugger
 */

export type DebugOptions = {
  /** Whether to show timestamps in logs */
  showTimestamp: boolean;
  /** Size of indentation in spaces */
  indentSize: number;
  /** Maximum depth for object traversal */
  maxDepth: number;
  /** Whether to colorize keys in output */
  colorizeKeys: boolean;
};
