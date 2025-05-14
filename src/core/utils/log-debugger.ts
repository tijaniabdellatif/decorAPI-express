import { DebugOptions } from '@/types/index.js';
import { format } from 'date-fns';
import { LogType } from '@/enums/enum.js';
import chalk from 'chalk';

class LogDebugger {
  private static instance: LogDebugger;
  private options: DebugOptions = {
    showTimestamp: true,
    indentSize: 2,
    maxDepth: 4,
    colorizeKeys: true,
  };

  private constructor() {}
  public static getInstance(): LogDebugger {
    if (!LogDebugger.instance) {
      LogDebugger.instance = new LogDebugger();
    }
    return LogDebugger.instance;
  }

  /**
   *
   * @param {Date} date since January 1, 1970, 00:00:00 UTC (the Unix Epoch).
   * @returns {string} the formatted date human readable string
   */
  private formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }

  /**
   * configure(options) method @class LogDebugger
   * @description Configure the log debugger option
   * @param {Object} options - Configuration options for the debugger
   * @param {boolean} options.showTimestamp - Whether to show timestamps in logs
   * @param {number} options.indentSize - Size of indentation in spaces
   * @param {number} options.maxDepth - Maximum depth for object traversal
   * @param {boolean} options.colorizeKeys - Whether to colorize keys in output
   * @returns {LogDebugger} The debugger instance for chaining
   *
   */
  public configure(options: DebugOptions): LogDebugger {
    this.options = { ...this.options, ...options };
    return this;
  }

  /**
   * getOptions() method @class LogDebugger
   * @description Get the actual LogDebugger options
   * @returns {object} returns LogDebugger options
   */
  public getOptions(): DebugOptions {
    return { ...this.options };
  }

  private formateDate(date: Date): string {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }

  /**
   * resetOptions() method
   * @description reset the option of the LogDebugger
   * @class LogDebugger
   * @returns {object} LogDebugger with reset options
   */
  public resetOptions(): LogDebugger {
    this.options = {
      showTimestamp: true,
      indentSize: 2,
      maxDepth: 4,
      colorizeKeys: true,
    };
    return this;
  }

  public log(
    label: string | undefined,
    data: any,
    type: LogType = LogType.INFO,
    overrideOptions: DebugOptions
  ): void {
    // Merge options with instance settings
    const opts = { ...this.options, ...overrideOptions };

    // Get timestamp if needed
    const timestamp = opts.showTimestamp ? chalk.gray(`[${this.formateDate(new Date())}]`) : '';

    // Create header based on type
    let header;
    switch (type) {
      case LogType.SUCCESS:
        header = chalk.bgGreenBright(chalk.bold.black(' SUCCESS '));
        break;
      case LogType.ERROR:
        header = chalk.bgRedBright(chalk.bold.white(' ERROR '));
        break;
      case LogType.WARNING:
        header = chalk.bgYellowBright(chalk.bold.black(' WARNING '));
        break;
      case LogType.DEBUG:
        header = chalk.bgBlueBright(chalk.bold.white(' DEBUG '));
        break;
      case LogType.INFO:
      default:
        header = chalk.bgCyanBright(chalk.bold.black(' INFO '));
        break;
    }

    // Print header
    console.log(`${timestamp} ${header}${label ? ` ${chalk.bold(label)}` : ''}`);

    // Handle different data types
    if (data === null) {
      console.log(chalk.italic('null'));
    } else if (data === undefined) {
      console.log(chalk.italic('undefined'));
    } else if (typeof data === 'string') {
      console.log(chalk.white(data));
    } else if (typeof data === 'number' || typeof data === 'boolean') {
      console.log(chalk.yellowBright(data));
    } else if (typeof data === 'function') {
      console.log(chalk.magenta('[Function]'));
    } else if (Array.isArray(data)) {
      // Print array with formatting
      console.log(this.formatArrayOrObject(data, opts, 0));
    } else if (typeof data === 'object') {
      // Print object with formatting
      console.log(this.formatArrayOrObject(data, opts, 0));
    } else {
      // Fallback for other types
      console.log(data);
    }

    // Add trailing separator
    console.log(chalk.gray('─'.repeat(50)));
  }

  /**
   * Format arrays and objects with proper indentation and styling
   */
  private formatArrayOrObject(data: any, options: DebugOptions, depth: number): string {
    const { indentSize = 2, maxDepth = 4, colorizeKeys = true } = options;

    // Prevent infinite recursion
    if (depth > maxDepth) {
      return chalk.gray('[Maximum depth reached]');
    }

    const indent = ' '.repeat(depth * indentSize);
    const indentInner = ' '.repeat((depth + 1) * indentSize);

    try {
      if (Array.isArray(data)) {
        if (data.length === 0) return chalk.gray('[]');

        const items = data.map((item, index) => {
          if (item === null) return `${indentInner}${chalk.gray('null')}`;
          if (item === undefined) return `${indentInner}${chalk.gray('undefined')}`;

          if (typeof item === 'object') {
            return `${indentInner}${this.formatArrayOrObject(item, options, depth + 1)}`;
          }

          if (typeof item === 'string') {
            return `${indentInner}${chalk.green(`"${item}"`)}`;
          }

          if (typeof item === 'number') {
            return `${indentInner}${chalk.yellow(item)}`;
          }

          if (typeof item === 'boolean') {
            return `${indentInner}${chalk.yellow(item)}`;
          }

          return `${indentInner}${item}`;
        });

        return `[\n${items.join(',\n')}\n${indent}]`;
      } else {
        const keys = Object.keys(data);
        if (keys.length === 0) return chalk.gray('{}');

        const entries = keys.map(key => {
          const value = data[key];
          const keyString = colorizeKeys ? chalk.cyan(key) : key;

          if (value === null) return `${indentInner}${keyString}: ${chalk.gray('null')}`;
          if (value === undefined) return `${indentInner}${keyString}: ${chalk.gray('undefined')}`;

          if (typeof value === 'object') {
            return `${indentInner}${keyString}: ${this.formatArrayOrObject(value, options, depth + 1)}`;
          }

          if (typeof value === 'string') {
            return `${indentInner}${keyString}: ${chalk.green(`"${value}"`)}`;
          }

          if (typeof value === 'number') {
            return `${indentInner}${keyString}: ${chalk.yellow(value)}`;
          }

          if (typeof value === 'boolean') {
            return `${indentInner}${keyString}: ${chalk.yellow(value)}`;
          }

          return `${indentInner}${keyString}: ${value}`;
        });

        return `{\n${entries.join(',\n')}\n${indent}}`;
      }
    } catch (error: any) {
      return chalk.red(`[Error formatting: ${error.message}]`);
    }
  }

  /**
   * Log success message or data
   */
  public success(label: string | undefined, data: any, options: DebugOptions): void {
    this.log(label, data, LogType.SUCCESS, options);
  }

  /**
   * Log error message or data
   */
  public error(label: string | undefined, data: any, options: DebugOptions): void {
    this.log(label, data, LogType.ERROR, options);
  }

  /**
   * Log warning message or data
   */
  public warning(label: string | undefined, data: any, options: DebugOptions): void {
    this.log(label, data, LogType.WARNING, options);
  }

  /**
   * Log debug information
   */
  public debug(label: string | undefined, data: any, options: DebugOptions): void {
    this.log(label, data, LogType.DEBUG, options);
  }

  /**
   * Log info message or data
   */
  public info(label: string | undefined, data: any, options: DebugOptions): void {
    this.log(label, data, LogType.INFO, options);
  }
}
