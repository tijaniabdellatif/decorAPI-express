// test/core/services/env-config.test.ts
import { describe, expect, it, beforeEach, afterEach } from "bun:test";
import { EnvConfig } from "@/services/env-config";
import { type ConfigSchema } from "@/types";

describe("EnvConfig", () => {
  // Store original environment
  const originalEnv = { ...process.env };
  
  // Reset the singleton instance and environment before each test
  beforeEach(() => {
    // Reset singleton instance - using any to access private property
    (EnvConfig as any).instance = undefined;
    
    // Reset environment to original state
    process.env = { ...originalEnv };
  });
  
  // Restore environment after all tests
  afterEach(() => {
    process.env = { ...originalEnv };
  });
  
  it("should throw an error when instantiated without a schema", () => {
    expect(() => EnvConfig.getInstance()).toThrow(
      "Config environnement variables is required"
    );
  });
  
  it("should load environment variables according to schema", () => {
    // Set test environment variables
    process.env.TEST_VAR1 = "value1";
    process.env.TEST_VAR3 = "value3";
    
    const schema: ConfigSchema = {
      TEST_VAR1: {
        required: true,
        description: "Test variable 1",
      },
      TEST_VAR2: {
        required: false,
        defaultValue: "default2",
        description: "Test variable 2",
      },
      TEST_VAR3: {
        required: true,
        description: "Test variable 3",
      },
    };
    
    const config = EnvConfig.getInstance(schema);
    
    // Get values using the get method
    expect(config.get("TEST_VAR1")).toBe("value1");
    expect(config.get("TEST_VAR2")).toBe("default2");
    expect(config.get("TEST_VAR3")).toBe("value3");
  });
  
  it("should throw an error for missing required variables during initialization", () => {
    const schema: ConfigSchema = {
      MISSING_VAR: {
        required: true,
        description: "This variable should be missing",
      },
    };
    
    expect(() => EnvConfig.getInstance(schema)).toThrow(
      "Missing required environment variable: MISSING_VAR"
    );
  });
  
  it("should use default values when environment variables are not set", () => {
    const schema: ConfigSchema = {
      TEST_VAR_WITH_DEFAULT: {
        required: true,
        defaultValue: "default_value",
        description: "Test variable with default",
      },
    };
    
    const config = EnvConfig.getInstance(schema);
    expect(config.get("TEST_VAR_WITH_DEFAULT")).toBe("default_value");
  });
  
  it("should return the same instance when called multiple times", () => {
    const schema: ConfigSchema = {
      TEST_VAR: {
        required: false,
        defaultValue: "test",
      },
    };
    
    const instance1 = EnvConfig.getInstance(schema);
    const instance2 = EnvConfig.getInstance();
    
    expect(instance1).toBe(instance2);
  });
  
  it("should throw an error when getting a non-existent variable", () => {
    const schema: ConfigSchema = {
      EXISTING_VAR: {
        required: false,
        defaultValue: "exists",
      },
    };
    
    const config = EnvConfig.getInstance(schema);
    
    expect(() => config.get("NON_EXISTENT_VAR")).toThrow(
      "Missing required environment variable: NON_EXISTENT_VAR"
    );
  });
  
  it("should handle environment variables taking precedence over default values", () => {
    // Set environment variable that overrides default
    process.env.VAR_WITH_DEFAULT = "env_value";
    
    const schema: ConfigSchema = {
      VAR_WITH_DEFAULT: {
        required: false,
        defaultValue: "default_value",
        description: "Variable with default that is overridden",
      },
    };
    
    const config = EnvConfig.getInstance(schema);
    expect(config.get("VAR_WITH_DEFAULT")).toBe("env_value");
  });
  
  it("should handle empty string values properly", () => {
    // Set empty environment variable
    process.env.EMPTY_VAR = "";
    
    const schema: ConfigSchema = {
      EMPTY_VAR: {
        required: false,
        description: "Empty variable",
      },
      EMPTY_WITH_DEFAULT: {
        required: false,
        defaultValue: "",
        description: "Empty default variable",
      },
    };
    
    const config = EnvConfig.getInstance(schema);
    expect(config.get("EMPTY_VAR")).toBe("");
    expect(config.get("EMPTY_WITH_DEFAULT")).toBe("");
  });
  
  it("should allow re-initialization with a new schema", () => {
    // First initialization
    const schema1: ConfigSchema = {
      VAR1: {
        required: false,
        defaultValue: "value1",
      },
    };
    
    const config1 = EnvConfig.getInstance(schema1);
    expect(config1.get("VAR1")).toBe("value1");
    
    // Reset singleton for testing
    (EnvConfig as any).instance = undefined;
    
    // Second initialization with different schema
    const schema2: ConfigSchema = {
      VAR2: {
        required: false,
        defaultValue: "value2",
      },
    };
    
    const config2 = EnvConfig.getInstance(schema2);
    expect(() => config2.get("VAR1")).toThrow(); // VAR1 should no longer exist
    expect(config2.get("VAR2")).toBe("value2");  // VAR2 should exist
  });
});