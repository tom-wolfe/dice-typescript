/* cSpell:disable */
module.exports = function (config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            { pattern: "spec/**/*.ts" },
            { pattern: "src/**/*.ts" },
        ],
        preprocessors: {
            "**/*.ts": ["karma-typescript"],
        },
        compilerOptions: {
            sourceMap: true
        },
        reporters: ["progress", "karma-typescript"],
        browsers: ["Chrome"],
        plugins: [
            "karma-chrome-launcher",
            "karma-jasmine",
            "karma-typescript"
        ],
        customLaunchers: {
            chromeTravisCi: {
                base: "Chrome",
                flags: ["--no-sandbox"]
            }
        },
        karmaTypescriptConfig: {
            compilerOptions: {
                sourceMap: true
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
    if (process.env.TRAVIS) {
        config.browsers = ["chromeTravisCi"];
    }
};