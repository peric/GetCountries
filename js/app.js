var OUTPUT_MYSQL = 'MySQL',
    OUTPUT_FIREBIRD = 'Firebird',
    OUTPUT_XML = 'XML',
    OUTPUT_JSON = 'JSON',
    OUTPUT_CSV = 'CSV',
    OUTPUT_YAML = 'YAML';

var columns = {
    'countryCode': { name: 'countryCode', mysql: "char(2) NOT NULL DEFAULT ''", firebird: "char(3) NOT NULL", checked: true },
    'countryName': { name: 'countryName', mysql: "varchar(45) NOT NULL DEFAULT ''", firebird: "varchar(45) NOT NULL", checked: true },
    'currencyCode': { name: 'currencyCode', mysql: "char(3) DEFAULT NULL", firebird: "char(3) DEFAULT NULL", checked: false },
    'population': { name: 'population', mysql: "varchar(20) DEFAULT NULL", firebird: "varchar(20) DEFAULT NULL", checked: false },
    'fipsCode': { name: 'fipsCode', mysql: "char(2) DEFAULT NULL", firebird: "char(2) DEFAULT NULL", checked: false },
    'isoNumeric': { name: 'isoNumeric', mysql: "char(4) DEFAULT NULL", firebird: "char(4) DEFAULT NULL", checked: false },
    'north': { name: 'north', mysql: "varchar(30) DEFAULT NULL", firebird: "varchar(30) DEFAULT NULL", checked: false },
    'south': { name: 'south', mysql: "varchar(30) DEFAULT NULL", firebird: "varchar(30) DEFAULT NULL", checked: false },
    'east': { name: 'east', mysql: "varchar(30) DEFAULT NULL", firebird: "varchar(30) DEFAULT NULL", checked: false },
    'west': { name: 'west', mysql: "varchar(30) DEFAULT NULL", firebird: "varchar(30) DEFAULT NULL", checked: false },
    'capital': { name: 'capital', mysql: "varchar(30) DEFAULT NULL", firebird: "varchar(30) DEFAULT NULL", checked: false },
    'continentName': { name: 'continentName', mysql: "varchar(15) DEFAULT NULL", firebird: "varchar(15) DEFAULT NULL", checked: false },
    'continent': { name: 'continent', mysql: "char(2) DEFAULT NULL", firebird: "char(2) DEFAULT NULL", checked: false },
    'areaInSqKm': { name: 'areaInSqKm', mysql: "varchar(20) DEFAULT NULL", firebird: "varchar(20) DEFAULT NULL", checked: false },
    'languages': { name: 'languages', mysql: "varchar(100) DEFAULT NULL", firebird: "varchar(100) DEFAULT NULL", checked: false },
    'isoAlpha3': { name: 'isoAlpha3', mysql: "char(3) DEFAULT NULL", firebird: "char(3) DEFAULT NULL", checked: false },
    'geonameId': { name: 'geonameId', mysql: "int(10) DEFAULT NULL", firebird: "integer DEFAULT NULL", checked: false }
};

// TODO: add additional stuff (YAML, CSV etc) to columns array

// TODO: when lookup tables is selected, select also languages

// TODO: disable lookup tables if it's not for mysql of firebird

//var columnsAttrLookupLang = {
//    'countryCode': "char(3) NOT NULL",
//    'languages': "varchar(10) NOT NULL",
//};

var settings = {
    'dblookup': { name: 'dblookup', longName: 'Language Lookup tables', checked: false, disabled: false, supportedOutputs: [OUTPUT_MYSQL, OUTPUT_FIREBIRD] }
};

var outputTypes = {};
outputTypes[OUTPUT_MYSQL] = { name: OUTPUT_MYSQL, checked: true };
outputTypes[OUTPUT_FIREBIRD] = { name: OUTPUT_FIREBIRD, checked: false };
outputTypes[OUTPUT_XML] = { name: OUTPUT_XML, checked: false };
outputTypes[OUTPUT_JSON] = { name: OUTPUT_JSON, checked: false };
outputTypes[OUTPUT_CSV] = { name: OUTPUT_CSV, checked: false };
outputTypes[OUTPUT_YAML] = { name: OUTPUT_YAML, checked: false };

// TODO: additional attribute 'languages': "varchar(100) DEFAULT NULL",

// TODO: after click, generate code based on selected options

var GeneratorApp = React.createClass({
    getInitialState: function() {
        return {
            columns: this.props.columns,
            settings: this.props.settings,
            outputTypes: this.props.outputTypes,
            outputType: OUTPUT_MYSQL,
            output: ''
        };
    },
    componentDidMount: function() {
        this.getOutput();
    },
    // handles changes for all the checkboxes and radio buttons
    toggleCheck: function(objectKey, type, data) {
        // radio buttons are handled different than checkboxes
        if (type === 'outputTypes') {
            var settings = this.state.settings;

            data[objectKey].checked = true;
            for (var key in data) {
                if (key !== objectKey) {
                    data[key].checked = false;
                }
            }

            for (var key in settings) {
                if (settings.hasOwnProperty(key) && settings[key].name === 'dblookup') {
                    if (settings[key].supportedOutputs.indexOf(data[objectKey].name) === -1) {
                        settings[key].checked = false;
                        settings[key].disabled = true;

                        this.setState({settings: settings});
                    } else {
                        settings[key].disabled = false;
                    }
                }
            }

            this.setState({outputType: data[objectKey].name});
        } else if (type === 'settings') {
            data[objectKey].checked = !data[objectKey].checked;
        } else {
            data[objectKey].checked = !data[objectKey].checked;
        }

        this.setState({type: data});
    },
    getOutput: function(e) {
        if (e) {
            e.preventDefault();
        }
        // TODO: show loader on button

        var source = 'http://api.geonames.org/countryInfoJSON?username=dperic';
        var columns = this.state.columns;
        var options = this.state.options;
        var outputType = this.state.outputType;

        $.getJSON(source)
            .done(function(data) {
                var geonamesData = data.geonames;

                this.setState({'output': generateOutput(outputType, columns, options, geonamesData) });
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
                    data={self.state.columns}
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
                    data={self.state.settings}
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
                    key={index + outputType.name}
                    objectKey={key}
                    data={self.state.outputTypes}
                    name={outputType.name}
                    checked={outputType.checked}
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
                            <button className="btn btn-primary btn-lg" type="submit">
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

var Column = React.createClass({
    handleChange: function(event) {
        var objectKey = this.props.objectKey,
            type = event.target.dataset.type,
            data = this.props.data;

        this.props.onChange(objectKey, type, data);
    },
    render: function() {
        return (
            <div className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        className="column"
                        name="column"
                        data-type="columns"
                        checked={this.props.checked}
                        onChange={this.handleChange} />
                            {this.props.name}
                </label>
            </div>
        );
    }
});

var Setting = React.createClass({
    handleChange: function(event) {
        var objectKey = this.props.objectKey,
            type = event.target.dataset.type,
            data = this.props.data;

        this.props.onChange(objectKey, type, data);
    },
    render: function() {
        return (
            <div className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        className="setting"
                        name="setting"
                        data-type="settings"
                        checked={this.props.checked}
                        onChange={this.handleChange}
                        disabled={this.props.disabled} />
                            {this.props.longName}
                </label>
            </div>
        );
    }
});

var OutputType = React.createClass({
    handleChange: function(event) {
        var objectKey = this.props.objectKey,
            type = event.target.dataset.type,
            data = this.props.data;

        this.props.onChange(objectKey, type, data);
    },
    render: function() {
        return (
            <div className="radio">
                <label>
                    <input
                        type="radio"
                        className="outputType"
                        name="outputType"
                        data-type="outputTypes"
                        checked={this.props.checked}
                        onChange={this.handleChange} />
                            {this.props.name}
                </label>
            </div>
        );
    }
});

var generateOutput = function(outputType, columns, options, data) {
    var output = "";
    var selectedColumns = [];
    var columnsDefinition = "";
    var countries = "";

    for (var key in columns) {
        if (columns.hasOwnProperty(key) && columns[key].checked) {
            selectedColumns.push(columns[key]);
        }
    }

    // TODO: check options dblookup

    switch (outputType) {
        case OUTPUT_MYSQL:
            // TODO: lookup

            output =
                "CREATE TABLE IF NOT EXISTS `countries` (\n" +
                    "    `id` int(5) NOT NULL AUTO_INCREMENT,\n" +
                    "{0}" +
                    "    PRIMARY KEY (`id`)\n" +
                    ") ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;\n\n" +
                    "{1}";

            // TODO: write this better - do not repeat?
            // insert statement
            countries = "INSERT INTO `countries` (";
            for (var i=0; i<selectedColumns.length; i++) {
                var columnName = selectedColumns[i].name;
                var mysqlCode = selectedColumns[i].mysql;

                columnsDefinition += "    `" + columnName + "` " + mysqlCode + ",\n";
                countries += "`" + columnName + "`, ";
            }
            countries = countries.substring(0, countries.length - 2);
            countries += ") VALUES";

            // insert values
            for (var i=0; i<data.length; i++) {
                countries += "\n(";
                for (var j=0; j<selectedColumns.length; j++) {
                    var columnName = selectedColumns[j].name;
                    var value = data[i][columnName];

                    if (typeof value === "string")
                        countries += "'" + value.replace(/\x27/g, '\\\x27') + "', ";
                    else
                        countries += value + ", ";
                }
                countries = countries.substring(0, countries.length - 2);
                countries += "),";
            }
            countries = countries.substring(0, countries.length - 1);

            output = output.format(columnsDefinition, countries);

            break;
        case OUTPUT_FIREBIRD:
            // TODO: lookup

            var insertStatement = "";

            output =
                "CREATE TABLE countries (\n" +
                "    id int not null primary key,\n" +
                "{0}" +
                ");\n\n" +
                "{1}";

            // TODO: write this better - do not repeat?
            // insert statement
            insertStatement = "INSERT INTO countries (";
            for (var i=0; i<selectedColumns.length; i++) {
                var columnName = selectedColumns[i].name;
                var firebirdCode = selectedColumns[i].firebird;

                columnsDefinition += "    " + columnName + " " + firebirdCode + ",\n";
                insertStatement += columnName + ", ";
            }
            insertStatement = insertStatement.substring(0, insertStatement.length - 2);
            insertStatement += ") VALUES {0}";

            // insert values
            for (var i=0; i<data.length; i++) {
                var country = "(";
                for (var j=0; j<selectedColumns.length; j++) {
                    var columnName = selectedColumns[j].name;
                    var value = data[i][columnName];

                    if (typeof value === "string")
                        country += "'" + value.replace(/\x27/g, '\\\x27') + "', ";
                    else
                        country += value + ", ";
                }
                country = country.substring(0, country.length - 2);
                country += ");\n";
                countries += insertStatement.format(country);
            }
            countries = countries.substring(0, countries.length - 1);

            output = output.format(columnsDefinition, countries);

            break;
        case OUTPUT_XML:
            output =
                "<countries>\n" +
                "{0}" +
                "</countries>";

            for (var i=0; i<data.length; i++) {
                countries += "    <country";
                for (var j=0; j<selectedColumns.length; j++) {
                    var columnName = selectedColumns[j].name;
                    var value = data[i][columnName];

                    countries += " " + columnName + "=\"" + value + "\"";
                }
                countries += "/>\n";
            }

            output = output.format(countries);

            break;
        case OUTPUT_JSON:
            output =
                "{\n" +
                "    \"countries\": {\n" +
                "        \"country\": [\n" +
                "{0}" +
                "        ]\n" +
                "    }\n" +
                "}";

            for (var i=0; i<data.length; i++) {
                countries += "            {\n";
                for (var j=0; j<selectedColumns.length; j++) {
                    var columnName = selectedColumns[j].name;
                    var value = data[i][columnName];

                    countries += "                \"" + columnName + "\": \"" + value + "\",\n";
                }
                countries = countries.substring(0, countries.length - 2);
                countries += "\n            },\n";
            }
            countries = countries.substring(0, countries.length - 2);
            countries += "\n";

            output = output.format(countries);

            break;
        case OUTPUT_CSV:
            for (var i=0; i<selectedColumns.length; i++) {
                var columnName = selectedColumns[i].name;

                output += "\"" + columnName + "\",";
            }
            output = output.substring(0, output.length - 1);
            output += "\n";

            for (var i=0; i<data.length; i++) {
                for (var j=0; j<selectedColumns.length; j++) {
                    var columnName = selectedColumns[j].name;
                    var value = data[i][columnName];

                    output += "\"" + value + "\",";
                }
                output = output.substring(0, output.length - 1);
                output += "\n";
            }

            break;
        case OUTPUT_YAML:
            output =
                "---\n" +
                "countries:\n" +
                "  country:" +
                "{0}";

            for (var i=0; i<data.length; i++) {
                countries += "\n    -";
                for (var j=0; j<selectedColumns.length; j++) {
                    var columnName = selectedColumns[j].name;
                    var value = data[i][columnName];

                    countries += "\n      " + columnName + ": " + value;
                }
            }

            output = output.format(countries);

            break;
        default:
            console.log('Something went wrong');
            break;
    }

    return output;
};

React.render(
    <GeneratorApp columns={columns} settings={settings} outputTypes={outputTypes} />,
    document.getElementById('content')
);

// TODO: restructure https://facebook.github.io/flux/docs/todo-list.html