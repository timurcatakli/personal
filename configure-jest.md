## /jest.config.js

COMMENT OUT COLLECT COVERAGE FROM...
ADD YOUR FOLDER PATH

```js
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/features/investigation/components/Journal/**/*',
    // 'src/**/*.{js,jsx,ts,tsx}',
    // 'packages/**/src/**/*.{js,jsx,ts,tsx}',
    // '!packages/**/src/**/*.spec.{js,jsx,ts,tsx}',
    // '!src/**/*.d.ts',
    // '!src/**/node_modules/**',
    // '!src/**/locales/**',
    // '!src/**/*.style.{js,jsx}',
    // '!src/**/style.{js,jsx}',
    // '!src/**/constants.{js,jsx}',
    // '!packages/**/src/**/constants/index.{js,jsx}',
    // '!packages/**/src/**/constants.{js,jsx}',
    // '!src/**/constants/index.{js,jsx}',
    // '!src/**/const.{js,jsx}',
  ],
```

## /scripts/test.js

COMMENT OUT argv.push('--no-coverage')
ADD COVERAGE

```js
...
...
    // console.log output will be printed
    argv.push('--verbose=false');
    // argv.push('--no-coverage');
    argv.push('--coverage');
  }
  jest.run(argv);
}
```

RUN `npm run test src/features/notables/_components/Notables/NotablesTable`
