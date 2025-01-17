// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-safari-launcher'),
      require('karma-firefox-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-spec-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    browsers: ['Chrome', 'Safari', 'Firefox'],
    client: {
      jasmine: {
        hideDisabled:true
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    // jasmineHtmlReporter: {
    //   suppressAll: true, // removes the duplicated traces
    //   hideDisabled:true,
    // },
    // coverageReporter: {
    //   dir: require('path').join(__dirname, './coverage/mgm-client-dashboard'),
    //   subdir: '.',
    //   reporters: [
    //     { type: 'html' },
    //     { type: 'text-summary' }
    //   ]
    // },
    // reporters: ['progress', 'kjhtml'],
    reporters: ['spec'],
    specReporter: {
      maxLogLines: 5,         // limit number of lines logged per test
      suppressErrorSummary: true,  // do not print error summary
      suppressFailed: false,  // do not print information about failed tests
      suppressPassed: false,  // do not print information about passed tests
      suppressSkipped: true,  // do not print information about skipped tests
      showSpecTiming: false // print the time elapsed for each spec
    },
    port: 9876,
    colors: true,
    logLevel: config.DEBUG,
    autoWatch: false, //run on test changes
    browsers: ['Chrome'],
    singleRun: true, //Karma will exit after running tests
    restartOnFileChange: false,
    hideDisabled: true
  });
};
