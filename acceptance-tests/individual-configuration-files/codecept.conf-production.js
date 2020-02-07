const { setHeadlessWhen } = require("@codeceptjs/configure");

// turn on headless mode when running with HEADLESS=true environment variable
// HEADLESS=true npx codecept run
setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: "./test-files/*_test.js",
  output: "./output",
  helpers: {
    Puppeteer: {
      url: "https://gitcoin-enterprise.org",
      show: false,
      browsers: ['ChromeHeadlessNoSandbox'],
      customLaunchers: {
        ChromeHeadlessNoSandbox: {
          base: 'ChromeHeadless',
          flags: ['--no-sandbox']
        }
      },
    }
  },
  include: {
    I: "./test-files/steps_file.js"
  },
  bootstrap: null,
  mocha: {},
  name: "acceptance-tests",
  plugins: {
    retryFailedStep: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  },
  require: ["ts-node/register"]
};
