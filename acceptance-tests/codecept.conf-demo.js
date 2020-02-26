// const { setHeadlessWhen } = require("@codeceptjs/configure");

// // turn on headless mode when running with HEADLESS=true environment variable
// // HEADLESS=true npx codecept run
// setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: "./test-files/*-test.js",
  output: "./output",
  helpers: {
    Puppeteer: {
      url: "http://localhost:3001",
      show: true
    }
  },
  bootstrap: "./initialize.js",
  mocha: {},
  name: "acceptance-tests",
  plugins: {
    screenshotOnFail: {
      enabled: true
    }
  }
};
