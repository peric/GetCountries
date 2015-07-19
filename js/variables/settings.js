var outputTypes = require('./outputTypes.js');

var settings = {
    languagelookup: {
        name: 'languagelookup',
        longName: 'Language Lookup tables',
        checked: false,
        disabled: false,
        supportedOutputs: [outputTypes.OUTPUT_MYSQL, outputTypes.OUTPUT_FIREBIRD]
    }
};

module.exports = settings;
