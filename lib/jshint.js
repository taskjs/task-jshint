var Execution = require('execution');

module.exports = Execution.extend({
    // The type of option could be HTML5 input types: file, directory, number, range, select,
    // url, email, tel, color, date, time, month, time, week, datetime(datetime-local),
    // string(text), boolean(checkbox), array, regexp, function and object.
    options: {
        config: {
            label: 'Custom config',
            type: 'file',
            placeholder: 'Custom configuration file'
        },
        reporter: {
            label: 'Custom reporter',
            type: 'string',
            default: 'jslint',
            placeholder: '<PATH>|jslint|checkstyle'
        },
        extensions: {
            type: 'string',
            default: '.js',
            label: 'Extensions',
            placeholder: 'Comma-separated list of file extensions to use (default is .js)'
        },
        ignores: {
            type: 'array',
            label: 'Ignores',
            placeholder: 'Comma-separated list of files and dirs to ignore (this will override .jshintignore file if set and does not merge)'
        },
        extract: {
            type: 'select',
            label: 'Extract inline scripts',
            default: 'never',
            options: ['never', 'auto', 'always']
        },
        showNonErrors: {
            label: 'Show additional data',
            type: 'boolean',
            default: false
        },
        verbose: {
            label: 'Show message codes',
            type: 'boolean',
            default: false
        }
    },
    run: function (inputs, options, logger) {
        return this._run(inputs, options, logger);
    },
    execute: function (resolve, reject) {
        var options = this.options;
        var inputs = this.inputs;
        var logger = this.logger;

        var jshintcli = require('jshint/src/cli');
        var files = inputs.map(function(input){
            return input.path || input
        });

        // Use config file if specified.
        var config;
        if (options.config) {
            config = jshintcli.loadConfig(options.config);
        }

        switch (true) {
        // JSLint reporter
        case options.reporter === 'jslint':
            options.reporter = './reporters/jslint_xml.js';
            break;

        // CheckStyle (XML) reporter
        case options.reporter === 'checkstyle':
            options.reporter = './reporters/checkstyle.js';
            break;

        // Reporter that displays additional JSHint data
        case options['showNonErrors']:
            options.reporter = './reporters/non_error.js';
            break;

        // Custom reporter
        case options.reporter !== undefined:
            options.reporter = path.resolve(process.cwd(), options.reporter);
        }

        var reporter;
        if (options.reporter) {
            try {
                reporter = require(options.reporter).reporter;
            } catch (err) {}

            if (reporter === null) {
                throw new Error("Can't load reporter file: " + options.reporter);
            }
        }

        jshintcli.run({
            args:       files,
            config:     config,
            reporter:   reporter,
            ignores:    options.ignores,
            extensions: options.extensions,
            verbose:    options.verbose,
            extract:    options.extract
        });

        resolve();
    }
})
