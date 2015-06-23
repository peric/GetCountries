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

(function() {
    var outputCode = document.getElementById('outputcode');

    // select on focus
    outputCode.onfocus = function() {
        this.select();

        // TODO: copy to clipboard
        // https://github.com/zeroclipboard/zeroclipboard
    };

    // TODO: show loader on button
//    $('#generateButton').on('click', function () {
//        console.log('taa    ')
//
//        var $btn = $(this).button('loading')
//        // business logic...
//    //            $btn.button('reset')
//    })
})();
