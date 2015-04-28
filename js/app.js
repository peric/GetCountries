// Options
// Columns
// select
// Settings
// select
// Output type
// select

// Generate
// Output


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

//var columnsAttrLookupLang = {
//    'countryCode': "char(3) NOT NULL",
//    'languages': "varchar(10) NOT NULL",
//};

var settings = [
    { name: 'dblookup', checked: false }
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

var GeneratorApp = React.createClass({
    getInitialState: function () {
        // TODO: return
    },

    render: function () {
        // TODO: define additional function
        // TODO: return something that calls additional function

        // TODO: return options and result

        // TODO: return them into container
    }
});

React.renderComponent(
    <GeneratorApp options= { options } />,
    document.body
);

//var GeneratorOptions = React.createClass({
//    render: function() {
//
//    }
//});