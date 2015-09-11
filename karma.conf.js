module.exports = function (config) {
    config.set({

        basePath: '',

        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher'
        ],

        files: [

            {pattern: 'bower_components/angular/angular.js', watched: false, include: true},
            {pattern: 'bower_components/angular-mocks/angular-mocks.js', watched: false, include: true},
            {pattern: 'bower_components/angular-animate/angular-animate.js', watched: false, include: true},
            {pattern: 'bower_components/angular-bootstrap/ui-bootstrap.js', watched: false, include: true},
            {pattern: 'node_modules/underscore/underscore.js', watched: false, include: true},
            {pattern: 'bower_components/jquery/dist/jquery.js', watched: false, include: true},
            {pattern: 'bower_components/select2/select2.min.js', watched: false, include: true, served: true},
            {pattern: 'bower_components/flow.js/dist/flow.js', watched: false, include: true, served: true},
            {pattern: 'bower_components/ng-flow/dist/ng-flow.js', watched: false, include: true, served: true},
            {pattern: 'src/scania-angular-ui.js', watched: true, include: true},
            {pattern: 'src/scania-angular-ui-tpls.js', watched: true, include: true},
            {pattern: 'test/**/*.spec.js', watched: true, include: true}
        ],

        exclude: [],

        preprocessors: {},

        reporters: ['progress'],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['Chrome'],
        junitReporter: {
            outputFile: 'test/test-results.xml',
            suite: ''
        },
        port: 9876,
        reportSlowerThan: 100,
        colors: true,
        logLevel: config.LOG_INFO,
        singleRun: false
    });
};
