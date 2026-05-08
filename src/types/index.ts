export interface TestRun {
  id?: number;
  test_title: string;
  file_path: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  timestamp: string;
}