import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['backend', 'frontend', 'repo']],
    'subject-case': [2, 'always', ['sentence-case', 'lower-case']],
  },
};

export default config;
