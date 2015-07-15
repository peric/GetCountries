var $ = require('jquery');
var React = require('react');
var GeneratorApp = require('./components/GeneratorApp.react');
var columns = require('./variables/columns.js');
var settings = require('./variables/settings.js');
var outputTypes = require('./variables/outputTypes.js');

React.render(
    <GeneratorApp columns={columns} settings={settings} outputTypes={outputTypes} />,
    document.getElementById('content')
);

require('./actions/OutputActions.js');
