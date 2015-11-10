var outputTypes = require('../variables/outputTypes.js');
var columnsLookup = require('../variables/columnsLookup.js');

var GeneratorActions = {
    generateOutput: function (selectedOutputType, columns, settings, data) {
        var selectedColumns = [];
        var output = '',
            columnsDefinition = '',
            countries = '',
            lookupCountries = '',
            lookupColumnsDefinition = '',
            columnName = '',
            mysqlCode = '',
            value = '',
            firebirdCode = '',
            country = '';

        for (var key in columns) {
            if (columns.hasOwnProperty(key) && columns[key].checked) {
                selectedColumns.push(columns[key]);
            }
        }

        switch (selectedOutputType) {
            case outputTypes.OUTPUT_MYSQL:
                if (settings.languagelookup.checked) {
                    // insert statements
                    countries = "INSERT INTO `countries` (";
                    for (var i = 0; i < selectedColumns.length; i++) {
                        columnName = selectedColumns[i].name;
                        mysqlCode = selectedColumns[i].mysql;

                        if (columnName !== 'languages') {
                            columnsDefinition += "    `" + columnName + "` " + mysqlCode + ",\n";
                            countries += "`" + columnName + "`, ";
                        }
                    }
                    countries = countries.substring(0, countries.length - 2);
                    countries += ") VALUES";

                    lookupCountries = "INSERT INTO `country_lang_lnk` (";
                    for (var i = 0; i < columnsLookup.length; i++) {
                        columnName = columnsLookup[i].name;
                        mysqlCode = columnsLookup[i].mysql;

                        lookupColumnsDefinition += "    `" + columnName + "` " + mysqlCode + ",\n";
                        lookupCountries += "`" + columnName + "`, ";
                    }
                    lookupCountries = lookupCountries.substring(0, lookupCountries.length - 2);
                    lookupCountries += ") VALUES";

                    // insert values
                    for (var i = 0; i < data.length; i++) {
                        countries += "\n(";
                        for (var j = 0; j < selectedColumns.length; j++) {
                            columnName = selectedColumns[j].name;
                            value = data[i][columnName];

                            if (typeof value === "string")
                                countries += "'" + value.replace(/\x27/g, '\\\x27') + "', ";
                            else
                                countries += value + ", ";
                        }
                        countries = countries.substring(0, countries.length - 2);
                        countries += "),";
                    }
                    countries = countries.substring(0, countries.length - 1);

                    for (var i = 0; i < data.length; i++) {
                        lookupCountries += "\n(";
                        for (var j = 0; j < columnsLookup.length; j++) {
                            columnName = columnsLookup[j].name;
                            value = data[i][columnName];

                            if (typeof value === "string")
                                lookupCountries += "'" + value.replace(/\x27/g, '\\\x27') + "', ";
                            else
                                lookupCountries += value + ", ";
                        }
                        lookupCountries = lookupCountries.substring(0, lookupCountries.length - 2);
                        lookupCountries += "),";
                    }
                    lookupCountries = lookupCountries.substring(0, lookupCountries.length - 1);

                    output =
                        `CREATE TABLE IF NOT EXISTS \`countries\` (\n` +
                        `    \`id\` int(5) NOT NULL AUTO_INCREMENT,\n` +
                        `${columnsDefinition}` +
                        `    PRIMARY KEY (\`id\`)\n` +
                        `) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;\n\n` +
                        `CREATE TABLE IF NOT EXISTS \`country_lang_lnk\` (\n` +
                        `${lookupColumnsDefinition}` +
                        `    PRIMARY KEY (\`countryCode\`, \`languages\`)\n` +
                        `) ENGINE=MyISAM DEFAULT CHARSET=utf8;\n\n` +
                        `${countries}\n` +
                        `${lookupCountries}`;
                } else {
                    countries = "INSERT INTO `countries` (";
                    for (var i = 0; i < selectedColumns.length; i++) {
                        columnName = selectedColumns[i].name;
                        mysqlCode = selectedColumns[i].mysql;

                        columnsDefinition += "    `" + columnName + "` " + mysqlCode + ",\n";
                        countries += "`" + columnName + "`, ";
                    }
                    countries = countries.substring(0, countries.length - 2);
                    countries += ") VALUES";

                    // insert values
                    for (var i = 0; i < data.length; i++) {
                        countries += "\n(";
                        for (var j = 0; j < selectedColumns.length; j++) {
                            columnName = selectedColumns[j].name;
                            value = data[i][columnName];

                            if (typeof value === "string")
                                countries += "'" + value.replace(/\x27/g, '\\\x27') + "', ";
                            else
                                countries += value + ", ";
                        }
                        countries = countries.substring(0, countries.length - 2);
                        countries += "),";
                    }
                    countries = countries.substring(0, countries.length - 1);

                    output =
                        `CREATE TABLE IF NOT EXISTS \`countries\` (\n` +
                        `    \`id\` int(5) NOT NULL AUTO_INCREMENT,\n` +
                        `${columnsDefinition}` +
                        `    PRIMARY KEY (\`id\`)\n` +
                        `) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;\n\n` +
                        `${countries}`;
                }
                break;
            case outputTypes.OUTPUT_FIREBIRD:
                if (settings.languagelookup.checked) {
                    // insert statements
                    insertStatement = "INSERT INTO countries (";
                    for (var i = 0; i < selectedColumns.length; i++) {
                        columnName = selectedColumns[i].name;
                        firebirdCode = selectedColumns[i].firebird;

                        if (columnName !== 'languages') {
                            columnsDefinition += "    " + columnName + " " + firebirdCode + ",\n";
                            insertStatement += columnName + ", ";
                        }
                    }
                    insertStatement = insertStatement.substring(0, insertStatement.length - 2);
                    insertStatement += ") VALUES ";

                    // insert values
                    for (var i = 0; i < data.length; i++) {
                        country = "(";
                        for (var j = 0; j < selectedColumns.length; j++) {
                            columnName = selectedColumns[j].name;
                            value = data[i][columnName];

                            if (columnName !== 'languages') {
                                if (typeof value === "string")
                                    country += "'" + value.replace(/\x27/g, '\\\x27') + "', ";
                                else
                                    country += value + ", ";
                            }
                        }
                        country = country.substring(0, country.length - 2);
                        country += ");\n";
                        countries += insertStatement + country;
                    }
                    countries = countries.substring(0, countries.length - 1);

                    insertStatement = "INSERT INTO country_lang_lnk (";
                    for (var i = 0; i < columnsLookup.length; i++) {
                        columnName = columnsLookup[i].name;
                        firebirdCode = columnsLookup[i].firebird;

                        lookupColumnsDefinition += "    " + columnName + " " + firebirdCode + ",\n";
                        insertStatement += columnName + ", ";
                    }
                    insertStatement = insertStatement.substring(0, insertStatement.length - 2);
                    insertStatement += ") VALUES ";

                    for (var i = 0; i < data.length; i++) {
                        country = "(";
                        for (var j = 0; j < columnsLookup.length; j++) {
                            columnName = columnsLookup[j].name;
                            value = data[i][columnName];

                            if (typeof value === "string")
                                country += "'" + value.replace(/\x27/g, '\\\x27') + "', ";
                            else
                                country += value + ", ";
                        }
                        country = country.substring(0, country.length - 2);
                        country += ");\n";
                        lookupCountries += insertStatement + country;
                    }
                    lookupCountries = lookupCountries.substring(0, lookupCountries.length - 1);

                    output =
                        `CREATE TABLE countries (\n` +
                        `${columnsDefinition}` +
                        `    PRIMARY KEY (countryCode)\n` +
                        `);\n\n` +
                        `CREATE TABLE country_lang_lnk (\n` +
                        `${lookupColumnsDefinition}` +
                        `    PRIMARY KEY (countryCode, languages)\n` +
                        `);\n\n` +
                        `${countries}` +
                        `\n` +
                        `${lookupCountries}`;
                } else {
                    var insertStatement = "";

                    // insert statement
                    insertStatement = "INSERT INTO countries (";
                    for (var i = 0; i < selectedColumns.length; i++) {
                        columnName = selectedColumns[i].name;
                        firebirdCode = selectedColumns[i].firebird;

                        columnsDefinition += "    " + columnName + " " + firebirdCode + ",\n";
                        insertStatement += columnName + ", ";
                    }
                    insertStatement = insertStatement.substring(0, insertStatement.length - 2);
                    insertStatement += ") VALUES ";

                    // insert values
                    for (var i = 0; i < data.length; i++) {
                        country = "(";
                        for (var j = 0; j < selectedColumns.length; j++) {
                            columnName = selectedColumns[j].name;
                            value = data[i][columnName];

                            if (typeof value === "string")
                                country += "'" + value.replace(/\x27/g, '\\\x27') + "', ";
                            else
                                country += value + ", ";
                        }
                        country = country.substring(0, country.length - 2);
                        country += ");\n";
                        countries += insertStatement + country;
                    }
                    countries = countries.substring(0, countries.length - 1);

                    output =
                        `CREATE TABLE countries (\n` +
                        `    id int not null primary key,\n` +
                        `${columnsDefinition}` +
                        `);\n\n` +
                        `${countries}`;
                }

                break;
            case outputTypes.OUTPUT_XML:
                for (var i = 0; i < data.length; i++) {
                    countries += "    <country";
                    for (var j = 0; j < selectedColumns.length; j++) {
                        columnName = selectedColumns[j].name;
                        value = data[i][columnName];

                        countries += " " + columnName + "=\"" + value + "\"";
                    }
                    countries += " />\n";
                }

                output =
                    `<countries>\n` +
                    `${countries}` +
                    `</countries>`;

                break;
            case outputTypes.OUTPUT_JSON:
                for (var i = 0; i < data.length; i++) {
                    countries += "            {\n";
                    for (var j = 0; j < selectedColumns.length; j++) {
                        columnName = selectedColumns[j].name;
                        value = data[i][columnName];

                        countries += "                \"" + columnName + "\": \"" + value + "\",\n";
                    }
                    countries = countries.substring(0, countries.length - 2);
                    countries += "\n            },\n";
                }
                countries = countries.substring(0, countries.length - 2);
                countries += "\n";

                output =
                    `{\n` +
                    `    \"countries\": {\n` +
                    `        \"country\": [\n` +
                    `${countries}` +
                    `        ]\n` +
                    `    }\n` +
                    `}`;

                break;
            case outputTypes.OUTPUT_CSV:
                for (var i = 0; i < selectedColumns.length; i++) {
                    columnName = selectedColumns[i].name;

                    output += "\"" + columnName + "\",";
                }
                output = output.substring(0, output.length - 1);
                output += "\n";

                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < selectedColumns.length; j++) {
                        columnName = selectedColumns[j].name;
                        value = data[i][columnName];

                        output += "\"" + value + "\",";
                    }
                    output = output.substring(0, output.length - 1);
                    output += "\n";
                }

                break;
            case outputTypes.OUTPUT_YAML:
                for (var i = 0; i < data.length; i++) {
                    countries += "\n    -";
                    for (var j = 0; j < selectedColumns.length; j++) {
                        columnName = selectedColumns[j].name;
                        value = data[i][columnName];

                        countries += "\n      " + columnName + ": " + value;
                    }
                }

                output =
                    `---\n` +
                    `countries:\n` +
                    `  country:` +
                    `${countries}`;

                break;
            default:
                console.log('Something went wrong');
                break;
        }

        return output;
    }
};

module.exports = GeneratorActions;
