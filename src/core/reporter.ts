import type {
  Reporter,
  TestCase,
  TestResult,
  FullConfig,
  Suite
} from '@playwright/test/reporter';
import { insertTestRun } from './storage.js';

class SentinelReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    console.log(`\n🔍 Sentinel is watching ${suite.allTests().length} tests...\n`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const status =
      result.status === 'passed' ? 'passed' :
      result.status === 'skipped' ? 'skipped' : 'failed';

    insertTestRun({
      test_title: test.title,
      file_path:  test.location.file,
      status,
      duration:  result.duration,
      timestamp: new Date().toISOString()
    });
  }

  onEnd() {
    console.log('\n✅ Sentinel saved all results.\n');
  }
}

export default SentinelReporter;
