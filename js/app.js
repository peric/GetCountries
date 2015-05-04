var OUTPUT_MYSQL = 'MySQL',
    OUTPUT_FIREBIRD = 'Firebird',
    OUTPUT_XML = 'XML',
    OUTPUT_JSON = 'JSON',
    OUTPUT_CSV = 'CSV',
    OUTPUT_YAML = 'YAML';

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

// TODO: when lookup tables is selected, select also languages

// TODO: lookup tables can be just with some types - mysql, firebird

//var columnsAttrLookupLang = {
//    'countryCode': "char(3) NOT NULL",
//    'languages': "varchar(10) NOT NULL",
//};

var settings = [
    { name: 'dblookup', longName: 'Language Lookup tables', checked: false }
];

var outputTypes = [
    { name: OUTPUT_MYSQL, checked: true },
    { name: OUTPUT_FIREBIRD, checked: false },
    { name: OUTPUT_XML, checked: false },
    { name: OUTPUT_JSON, checked: false },
    { name: OUTPUT_CSV, checked: false },
    { name: OUTPUT_YAML, checked: false }
];

// TODO: additional attribute 'languages': "varchar(100) DEFAULT NULL",

// TODO: show example code

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
    toggleCheck: function(index, type, data) {
        // radio buttons are handled different than checkboxes
        if (type === 'outputTypes') {
            data[index].checked = true;
            for (var i=0; i<data.length; i++) {
                if (i !== index) {
                    data[i].checked = false;
                }
            }
            this.setState({outputType: data[index].name});
        } else {
            data[index].checked = !data[index].checked;
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
        var columns = this.state.columns.map(function(column, index) {
            return (
                <Column
                    key={index + column.name}
                    index={index}
                    data={self.state.columns}
                    name={column.name}
                    checked={column.checked}
                    onChange={self.toggleCheck} />
            )
        });
        var settings = this.state.settings.map(function(setting, index) {
            return (
                <Setting
                    key={index + setting.name}
                    index={index}
                    data={self.state.settings}
                    name={setting.name}
                    longName={setting.longName}
                    checked={setting.checked}
                    onChange={self.toggleCheck} />
            )
        });
        var outputTypes = this.state.outputTypes.map(function(outputType, index) {
            return (
                <OutputType
                    key={index + outputType.name}
                    index={index}
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
        var index = this.props.index,
            type = event.target.dataset.type,
            data = this.props.data;

        this.props.onChange(index, type, data);
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
        var index = this.props.index,
            type = event.target.dataset.type,
            data = this.props.data;

        this.props.onChange(index, type, data);
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
                            {this.props.longName}
                </label>
            </div>
        );
    }
});

var OutputType = React.createClass({
    handleChange: function(event) {
        var index = this.props.index,
            type = event.target.dataset.type,
            data = this.props.data;

        this.props.onChange(index, type, data);
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

    for (var i=0; i<columns.length; i++) {
        if (columns[i].checked) {
            selectedColumns.push(columns[i]);
        }
    }

    // TODO: check options dblookup

    switch (outputType) {
        case OUTPUT_MYSQL:
            // TODO: check options dblookup
            var columnsDefinition = "";
            var insertStatement = "";

            output =
                "CREATE TABLE IF NOT EXISTS `countries` (\n" +
                    "    `id` int(5) NOT NULL AUTO_INCREMENT,\n" +
                    "{0}" +
                    "    PRIMARY KEY (`id`)\n" +
                    ") ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;\n\n" +
                    "{1}";

            // TODO: write this better - do not repeat?
            // insert statement
            insertStatement = "INSERT INTO `countries` (";
            for (var i=0; i<selectedColumns.length; i++) {
                var columnName = selectedColumns[i].name;
                var mysqlCode = selectedColumns[i].mysql;

                columnsDefinition += "    `" + columnName + "` " + mysqlCode + ",\n";
                insertStatement += "`" + columnName + "`, ";
            }
            insertStatement = insertStatement.substring(0, insertStatement.length - 2);
            insertStatement += ") VALUES";

            // insert values
            for (var i=0; i<data.length; i++) {
                insertStatement += "\n(";
                for (var j=0; j<selectedColumns.length; j++) {
                    var columnName = selectedColumns[j].name;
                    var value = data[i][columnName];

                    if (typeof value === "string")
                        insertStatement += "'" + value.replace(/\x27/g, '\\\x27') + "', ";
                    else
                        insertStatement += value + ", ";
                }
                insertStatement = insertStatement.substring(0, insertStatement.length - 2);
                insertStatement += "),";
            }
            insertStatement = insertStatement.substring(0, insertStatement.length - 1);

            output = output.format(columnsDefinition, insertStatement);

            break;
        case OUTPUT_FIREBIRD:
            // TODO
            break;
        case OUTPUT_XML:
            var countries = "";

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
            var countries = "";

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
            // TODO:
            break;
        case OUTPUT_YAML:
            // TODO:
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