interface TestResult {
  name: string;
  failed: boolean;
  error?: Error;
  time?: number;
}

interface TestReporter {
  start?: () => void;
  each: (result: TestResult) => void;
  end?: (results: TestResult[]) => void;
}

export default {
  start() {
    console.log('🧪 Starting tests...');
  },

  each(result: TestResult) {
    const status = result.failed ? '❌ FAIL' : '✅ PASS';
    const time = result.time ? ` (${result.time.toFixed(2)}ms)` : '';
    console.log(`${status} - ${result.name}${time}`);

    if (result.failed && result.error) {
      console.error(`  Error: ${result.error.message}`);
      if (result.error.stack) {
        console.error(`  ${result.error.stack.split('\n').slice(1).join('\n  ')}`);
      }
    }
  },

  end(results: TestResult[]) {
    const passed = results.filter(r => !r.failed).length;
    const failed = results.filter(r => r.failed).length;
    const total = results.length;

    console.log('\n📊 Test Results:');
    console.log(`Total: ${total}`);
    console.log(`Passed: ${passed} ${passed === total ? '🎉' : ''}`);

    if (failed > 0) {
      console.log(`Failed: ${failed} ❌`);
      process.exitCode = 1;
    }
  },
} as TestReporter;
