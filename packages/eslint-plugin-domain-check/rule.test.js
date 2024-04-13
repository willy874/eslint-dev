const { RuleTester } = require('eslint');
const pathCheckRule = require('./path-check');

const ruleTester = new RuleTester({
  // Must use at least ecmaVersion 2015 because
  // that's when `const` variables were introduced.
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});

const cwd = process.cwd();

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
  'path-check', // rule name
  pathCheckRule, // rule code
  {
    // checks
    // 'valid' checks cases that should pass
    valid: [
      {
        filename: `${cwd}/src/test.js`,
        code: `
      import {} from './test';
      `,
      },
      {
        options: [{ 'allowPaths': ['./src/libs'] }],
        filename: `${cwd}/src/test.js`,
        code: `
      import {} from '../libs/test';
      `,
      },
      {
        options: [{ 'modulePaths': ['./src/slices'] }],
        filename: `${cwd}/src/slices/utils/add/test.js`,
        code: `
      import {} from '../get';
      `,
      },
    ],
    // 'invalid' checks cases that should not pass
    invalid: [
      {
        filename: `${cwd}/src/apps/test.js`,
        code: `
        import {} from '../xxx';
      `,
        output: `
        import {} from '../xxx';
      `,
        errors: 1,
      },
      {
        options: [{ 'modulePaths': ['./src/slices'] }],
        filename: `${cwd}/src/slices/utils/add/test.js`,
        code: `
      import {} from '../../shared/test';
      `,
        output: `
      import {} from '../../shared/test';
      `,
        errors: 1,
      },
      {
        options: [{ 'modulePaths': ['./src/slices'] }],
        filename: `${cwd}/src/slices/utils/add/test.js`,
        code: `
      import {} from '../../shared/test';
      `,
        output: `
      import {} from '../../shared/test';
      `,
        errors: 1,
      },
    ],
  },
);

console.log('All tests passed!');
