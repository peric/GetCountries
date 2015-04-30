var columns = [
    { name: 'countryCode', mysql: "char(2) NOT NULL DEFAULT ''", firebird: "char(3) NOT NULL", checked: true },
    { name: 'countryName', mysql: "varchar(45) NOT NULL DEFAULT ''", firebird: "varchar(45) NOT NULL", checked: true },
    { name: 'currencyCode', mysql: "char(3) DEFAULT NULL", firebird: "char(3) DEFAULT NULL", checked: false },
    { name: 'population', mysql: "varchar(20) DEFAULT NULL", firebird: "varchar(20) DEFAULT NULL", checked: false },
    { name: 'fipsCode', mysql: "char(2) DEFAULT NULL", firebird: "char(2) DEFAULT NULL", checked: false },
    { name: 'isoNumeric', mysql: "char(4) DEFAULT NULL", firebird: "char(4) DEFAULT NULL", checked: false },
    { name: 'north', mysql: "varchar(30) DEFAULT NULL", firebird: "varchar(30) DEFAULT NULL", checked: false },
    { name: 'south', mysql: "varchar(30) DEFAULT NULL", firebird: "varchar(30) DEFAULT NULL", checked: false },
    { name: 'east', mysql: "varchar(30) DEFAULT NULL", firebird: "varchar(30) DEFAULT NULL", checked: false },
    { name: 'west', mysql: "varchar(30) DEFAULT NULL", firebird: "varchar(30) DEFAULT NULL", checked: false },
    { name: 'capital', mysql: "varchar(30) DEFAULT NULL", firebird: "varchar(30) DEFAULT NULL", checked: false },
    { name: 'continentName', mysql: "varchar(15) DEFAULT NULL", firebird: "varchar(15) DEFAULT NULL", checked: false },
    { name: 'continent', mysql: "char(2) DEFAULT NULL", firebird: "char(2) DEFAULT NULL", checked: false },
    { name: 'areaInSqKm', mysql: "varchar(20) DEFAULT NULL", firebird: "varchar(20) DEFAULT NULL", checked: false },
    { name: 'languages', mysql: "varchar(100) DEFAULT NULL", firebird: "varchar(100) DEFAULT NULL", checked: false },
    { name: 'isoAlpha3', mysql: "char(3) DEFAULT NULL", firebird: "char(3) DEFAULT NULL", checked: false },
    { name: 'geonameId', mysql: "int(10) DEFAULT NULL", firebird: "integer DEFAULT NULL", checked: false }
];

// TODO: add additional stuff (YAML, CSV etc) to columns array

//var columnsAttrLookupLang = {
//    'countryCode': "char(3) NOT NULL",
//    'languages': "varchar(10) NOT NULL",
//};

var settings = [
    { name: 'dblookup', longName: 'Language Lookup tables', checked: false }
];

var outputTypes = [
    { name: 'MySQL', checked: true },
    { name: 'Firebird', checked: false },
    { name: 'XML', checked: false },
    { name: 'JSON', checked: false },
    { name: 'CSV', checked: false },
    { name: 'YAML', checked: false }
];

// TODO: keep track of selected options
// TODO: additional attribute 'languages': "varchar(100) DEFAULT NULL",

// TODO: show example

// TODO: after click, generate code based on selected options

// TODO: pass properties to ColumnsList and access it with this.props.column, this.props.children etc
// TODO: use https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js

var GeneratorApp = React.createClass({
    // TODO: getInitialState, for internal state data
    getInitialState: function() {
        return {
            columns: this.props.columns,
            settings: this.props.settings,
            outputTypes: this.props.outputTypes
        };
    },
    generateOutput: function(e) {
        e.preventDefault();
//        console.log(this.props.outputTypes);
        console.log(this.props.outputTypes);
    },
    // TODO: onChange
    render: function() {
        return (
            <div className="GeneratorApp">
                <div className="row">
                    <ColumnsList columns={this.props.columns} />
                    <SettingsList settings={this.props.settings} />
                    <OutputsList outputTypes={this.props.outputTypes} />
                </div>
                <div className="row">
                    <form onSubmit={this.generateOutput}>
                        <p className="text-center">
                            <button className="btn btn-primary btn-lg" type="submit">
                                Generate
                            </button>
                        </p>
                    </form>
                </div>
                <div className="row">
                    <textarea className="generatedcode" rows="30"></textarea>
                </div>
            </div>
        );
    }
});

var Column = React.createClass({
    render: function() {
        // TODO: rewrite app so that every property resides for itself
        // TODO: properties become states when passed into
        // TODO: http://jsfiddle.net/martinaglv/mr7gY/light/
    }
});

var ColumnsList = React.createClass({
    handleChange: function(column) {
        console.log(column);
//        e.preventDefault();
//        console.log(e);
//        console.log(e.target.value);
        console.log(this.props.columns);
//        console.log(this.props.columns);
    },
    render: function() {
        var showColumns = this.props.columns.map(function(column, index) {
            var columnName = column.name;
            return (
                <div className="checkbox" key={index + columnName}>
                    <label>
                        <input
                            type="checkbox"
                            className="column"
                            name="column"
                            value={columnName}
                            checked={column.checked}
                            onChange={this.handleChange(column)}>
                                {columnName}
                        </input>
                    </label>
                </div>
            );
        }.bind(this));
        return (
            <div className="col-md-4">
                <h3>Columns</h3>
                {showColumns}
            </div>
        );
    }
});

var SettingsList = React.createClass({
    render: function() {
        var showSettings = this.props.settings.map(function(setting, index) {
            var settingName = setting.name;
            var checked = setting.checked;
            return (
                <div className="checkbox" key={index + settingName}>
                    <label>
                        <input
                            type="checkbox"
                            className="setting"
                            name="setting"
                            value={settingName}
                            defaultChecked={ checked ? 'checked' : '' }>
                                {setting.longName}
                        </input>
                    </label>
                </div>
                );
        });
        return (
            <div className="col-md-4">
                <h3>Settings</h3>
                {showSettings}
            </div>
        );
    }
});

var OutputsList = React.createClass({
    render: function() {
        var showOutputTypes = this.props.outputTypes.map(function(outputType, index) {
            var outputTypeName = outputType.name;
            var checked = outputType.checked;
            return (
                <div className="radio" key={index + outputTypeName}>
                    <label>
                        <input
                        type="radio"
                        className="output"
                        name="output"
                        value={outputTypeName}
                        defaultChecked={ checked ? 'checked' : '' }>
                            {outputTypeName}
                        </input>
                    </label>
                </div>
            );
        });
        return (
            <div className="col-md-4">
                <h3>Output type</h3>
                {showOutputTypes}
            </div>
        );
    }
});

var GenerateOutput = React.createClass({
    render: function() {

    }
});

React.render(
    <GeneratorApp columns={columns} settings={settings} outputTypes={outputTypes} />,
    document.getElementById('content')
);

// TODO: reuse same method for rendering all the columns, options and outputs
// TODO: pass checkbox/radio as parameter
