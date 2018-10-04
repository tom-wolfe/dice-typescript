/* cSpell:disable */

const watching = process.env.npm_lifecycle_script.indexOf("--single-run") === -1;
console.log("Watching: " + watching);

module.exports = function (config) {
  config.set({
    browserNoActivityTimeout: 20000,
    frameworks: ["jasmine", "karma-typescript"],
    files: [
      { pattern: "spec/**/*.ts" },
      { pattern: "src/**/*.ts" },
    ],
    preprocessors: {
      "**/*.ts": ["karma-typescript"],
    },
    reporters: ["progress", "karma-typescript"],
    browsers: ["chromeDebugging"],
    plugins: [
      "karma-chrome-launcher",
      "karma-jasmine",
      "karma-typescript"
    ],
    customLaunchers: {
      chromeDebugging: {
        base: 'Chrome',
        flags: [ '--remote-debugging-port=9333' ]
      },
      chromeTravisCi: {
        base: "Chrome",
        flags: ["--no-sandbox"]
      }
    },
    karmaTypescriptConfig: {
      coverageOptions: {
        instrumentation: true
      },
      reports: {
        lcovonly: {
          directory: "coverage",
          filename: "lcov.info",
          subdirectory: "lcov"
        }
      }
    }
  });

  if (watching) {
    config.karmaTypescriptConfig.coverageOptions.instrumentation = false;
  }

  if (process.env.TRAVIS) {
    config.browsers = ["chromeTravisCi"];
  }
};