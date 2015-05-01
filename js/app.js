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

// TODO: additional attribute 'languages': "varchar(100) DEFAULT NULL",

// TODO: show example code

// TODO: after click, generate code based on selected options

// TODO: use https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js

var GeneratorApp = React.createClass({
    getInitialState: function() {
        return {
            columns: this.props.columns,
            settings: this.props.settings,
            outputTypes: this.props.outputTypes,
            output: ''
        };
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
        } else {
            data[index].checked = !data[index].checked;
        }

        this.setState({type: data});
    },
    getOutput: function(e) {
        e.preventDefault();

        var source = 'http://api.geonames.org/countryInfoJSON?username=dperic';
        var results = '';

        // this.prepare data
        // generate
//        prepareData();

        // fetch and prepare data
        $.getJSON(source, function(data) {
            var columns = this.state.columns;

            for (var i=0; i<data.geonames.length; i++) {
                for (var j=0; j<columns.length; j++) {
                    if (columns[j].checked) {
                        console.log(data.geonames[i][columns[j].name]);
                    }
                }
            }

//            this.setState({output: result});
        }.bind(this));

        console.log(generateOutput());
//        this.setState({output: results});

        // TODO: generate output
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
                    <form onSubmit={this.getOutput}>
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

var generateOutput = function() {
    return 'test';
};

React.render(
    <GeneratorApp columns={columns} settings={settings} outputTypes={outputTypes} />,
    document.getElementById('content')
);

// TODO: restructure https://facebook.github.io/flux/docs/todo-list.html