const { setHeadlessWhen } = require("@codeceptjs/configure");

// turn on headless mode when running with HEADLESS=true environment variable
// HEADLESS=true npx codecept run
setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: "./test-files/*-test.js",
  output: "./output",
  helpers: {
    Puppeteer: {
      url: "http://localhost:4200",
      show: false
    }
  },
  include: {
    I: "./test-files/steps_file.js"
  },
  bootstrap: null,
  mocha: {},
  name: "acceptance-tests",
  plugins: {
    screenshotOnFail: {
      enabled: true
    }
  },
  require: ["ts-node/register"]
};
