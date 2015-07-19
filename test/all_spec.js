var data = require('./countries_mock.js');
var GeneratorActions = require('../js/actions/GeneratorActions.js');
var outputTypes = require('../js/variables/outputTypes.js');
var columns = require('../js/variables/columns.js');
var settings = require('../js/variables/settings.js');

describe('Generates countries in different formats', () => {

  it('Generates XML', () => {
    var output = GeneratorActions.generateOutput(outputTypes.OUTPUT_XML, columns, settings, data);
    expect(output).toBe(`<countries>
    <country countryCode="HR" countryName="Croatia" />
    <country countryCode="SE" countryName="Sweden" />
    <country countryCode="SI" countryName="Slovenia" />
</countries>`);

    // Copy columns to prevent mutating them for other tests
    var columnsCopy = JSON.parse(JSON.stringify(columns));
    columnsCopy.capital.checked = true;
    var output = GeneratorActions.generateOutput(outputTypes.OUTPUT_XML, columnsCopy, settings, data);
    expect(output).toBe(`<countries>
    <country countryCode="HR" countryName="Croatia" capital="Zagreb" />
    <country countryCode="SE" countryName="Sweden" capital="Stockholm" />
    <country countryCode="SI" countryName="Slovenia" capital="Ljubljana" />
</countries>`);
  });

  it('Generates YAML', () => {
    var output = GeneratorActions.generateOutput(outputTypes.OUTPUT_YAML, columns, settings, data);
    expect(output).toBe(`---
countries:
  country:
    -
      countryCode: HR
      countryName: Croatia
    -
      countryCode: SE
      countryName: Sweden
    -
      countryCode: SI
      countryName: Slovenia`);
  });

  it('Generates JSON', () => {
    var output = GeneratorActions.generateOutput(outputTypes.OUTPUT_JSON, columns, settings, data);
    expect(output).toBe(`{
    "countries": {
        "country": [
            {
                "countryCode": "HR",
                "countryName": "Croatia"
            },
            {
                "countryCode": "SE",
                "countryName": "Sweden"
            },
            {
                "countryCode": "SI",
                "countryName": "Slovenia"
            }
        ]
    }
}`);
  });

  it('Generates CSV', () => {
    var output = GeneratorActions.generateOutput(outputTypes.OUTPUT_CSV, columns, settings, data);
    expect(output).toBe(`"countryCode","countryName"
"HR","Croatia"
"SE","Sweden"
"SI","Slovenia"
`);
  });

  it('Generates MySQL', () => {
    var output = GeneratorActions.generateOutput(outputTypes.OUTPUT_MYSQL, columns, settings, data);
    expect(output).toBe(`CREATE TABLE IF NOT EXISTS \`countries\` (
    \`id\` int(5) NOT NULL AUTO_INCREMENT,
    \`countryCode\` char(2) NOT NULL DEFAULT '',
    \`countryName\` varchar(45) NOT NULL DEFAULT '',
    PRIMARY KEY (\`id\`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;

INSERT INTO \`countries\` (\`countryCode\`, \`countryName\`) VALUES
('HR', 'Croatia'),
('SE', 'Sweden'),
('SI', 'Slovenia')`);
  });

});
