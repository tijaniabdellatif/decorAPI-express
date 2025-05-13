/**
 * Sets environment variables temporarily for a test
 * @param envVars Object containing environment variables to set
 * @returns A function to restore the original environment
 */
export function withEnv(envVars: Record<string, string>): () => void {
  const originalEnv = { ...process.env };

  // Set the environment variables
  Object.entries(envVars).forEach(([key, value]) => {
    process.env[key] = value;
  });

  // Return a function to restore the original environment
  return () => {
    process.env = { ...originalEnv };
  };
}
