var $ = require('jquery');
var React = require('react');
var Column = require('./Column.react');
var OutputType = require('./OutputType.react');
var Setting = require('./Setting.react');
var GeneratorActions = require('../actions/GeneratorActions');

var GeneratorApp = React.createClass({
    getInitialState: function() {
        return {
            columns: this.props.columns,
            settings: this.props.settings,
            outputTypes: this.props.outputTypes,
            selectedOutputType: this.props.outputTypes.OUTPUT_MYSQL,
            output: ''
        };
    },
    componentWillMount: function() {
        this.getOutput();
    },
    // handles changes for all the checkboxes and radio buttons
    toggleCheck: function(objectKey, type, selectedList) {
        var newState = {};

        // radio buttons are handled different than checkboxes
        if (type === 'outputTypes') {
            var settings = this.state.settings;

            // based on the selected, disable or enable 'languagelookup' setting
            for (var key in settings) {
                if (settings.hasOwnProperty(key) && settings[key].name === 'languagelookup') {
                    if (settings[key].supportedOutputs.indexOf(selectedList[objectKey]) === -1) {
                        settings[key].checked = false;
                        settings[key].disabled = true;
                    } else {
                        settings[key].disabled = false;
                    }
                }
            }

            this.setState({selectedOutputType: selectedList[objectKey]});
            this.setState({settings: settings});
        } else if (type === 'settings') {
            if (selectedList[objectKey].name === 'languagelookup') {
                var columns = this.state.columns;

                columns['languages'].checked = !selectedList[objectKey].checked;

                this.setState({columns: columns});
            }

            selectedList[objectKey].checked = !selectedList[objectKey].checked;
        } else {
            selectedList[objectKey].checked = !selectedList[objectKey].checked;
        }

        newState[type] = selectedList;

        this.setState(newState);
    },
    getOutput: function(e) {
        if (e) {
            e.preventDefault();
        }

        var source = 'http://api.geonames.org/countryInfoJSON?username=dperic';
        var columns = this.state.columns;
        var settings = this.state.settings;
        var selectedOutputType = this.state.selectedOutputType;

        $.getJSON(source)
            .done(function(fetchedData) {
                var geonamesData = fetchedData.geonames;

                this.setState({'output': GeneratorActions.generateOutput(selectedOutputType, columns, settings, geonamesData) });
            }.bind(this));
    },
    render: function() {
        var self = this;
        var columns = Object.keys(this.state.columns).map(function(key, index) {
            var column = self.state.columns[key];
            return (
                <Column
                    key={index + column.name}
                    objectKey={key}
                    columns={self.state.columns}
                    name={column.name}
                    checked={column.checked}
                    onChange={self.toggleCheck} />
            )
        });
        var settings = Object.keys(this.state.settings).map(function(key, index) {
            var setting = self.state.settings[key];
            return (
                <Setting
                    key={index + key}
                    objectKey={key}
                    settings={self.state.settings}
                    name={setting.name}
                    longName={setting.longName}
                    checked={setting.checked}
                    onChange={self.toggleCheck}
                    disabled={setting.disabled} />
            )
        });
        var outputTypes = Object.keys(this.state.outputTypes).map(function(key, index) {
            var outputType = self.state.outputTypes[key];
            return (
                <OutputType
                    key={index + outputType}
                    objectKey={key}
                    outputTypes={self.state.outputTypes}
                    name={outputType}
                    checked={self.state.selectedOutputType == outputType}
                    onChange={self.toggleCheck} />
            )
        });
        return (
            <div className="GeneratorApp">
                <div className="row">
                    <div className="col-md-4">
                        <h3>Columns</h3>
                        {columns}
                    </div>
                    <div className="col-md-4">
                        <h3>Settings</h3>
                        {settings}
                    </div>
                    <div className="col-md-4">
                        <h3>Output types</h3>
                        {outputTypes}
                    </div>
                </div>
                <div className="row">
                    <form id="generateForm" onSubmit={this.getOutput}>
                        <p className="text-center">
                            <button id="generateButton" className="btn btn-primary btn-lg" type="submit" data-loading-text="Loading...">
                            Generate
                            </button>
                        </p>
                    </form>
                </div>
                <div className="row">
                    <textarea
                    id="outputcode"
                    className="outputcode"
                    rows="30"
                    value={this.state.output}
                    readOnly="true" />
                </div>
            </div>
        );
    }
});

module.exports = GeneratorApp;
