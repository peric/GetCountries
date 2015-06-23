var columns = {
    'countryCode': { name: 'countryCode', mysql: 'char(2) NOT NULL DEFAULT \'\'', firebird: 'char(3) NOT NULL', checked: true },
    'countryName': { name: 'countryName', mysql: 'varchar(45) NOT NULL DEFAULT \'\'', firebird: 'varchar(45) NOT NULL', checked: true },
    'currencyCode': { name: 'currencyCode', mysql: 'char(3) DEFAULT NULL', firebird: 'char(3) DEFAULT NULL', checked: false },
    'population': { name: 'population', mysql: 'varchar(20) DEFAULT NULL', firebird: 'varchar(20) DEFAULT NULL', checked: false },
    'fipsCode': { name: 'fipsCode', mysql: 'char(2) DEFAULT NULL', firebird: 'char(2) DEFAULT NULL', checked: false },
    'isoNumeric': { name: 'isoNumeric', mysql: 'char(4) DEFAULT NULL', firebird: 'char(4) DEFAULT NULL', checked: false },
    'north': { name: 'north', mysql: 'varchar(30) DEFAULT NULL', firebird: 'varchar(30) DEFAULT NULL', checked: false },
    'south': { name: 'south', mysql: 'varchar(30) DEFAULT NULL', firebird: 'varchar(30) DEFAULT NULL', checked: false },
    'east': { name: 'east', mysql: 'varchar(30) DEFAULT NULL', firebird: 'varchar(30) DEFAULT NULL', checked: false },
    'west': { name: 'west', mysql: 'varchar(30) DEFAULT NULL', firebird: 'varchar(30) DEFAULT NULL', checked: false },
    'capital': { name: 'capital', mysql: 'varchar(30) DEFAULT NULL', firebird: 'varchar(30) DEFAULT NULL', checked: false },
    'continentName': { name: 'continentName', mysql: 'varchar(15) DEFAULT NULL', firebird: 'varchar(15) DEFAULT NULL', checked: false },
    'continent': { name: 'continent', mysql: 'char(2) DEFAULT NULL', firebird: 'char(2) DEFAULT NULL', checked: false },
    'areaInSqKm': { name: 'areaInSqKm', mysql: 'varchar(20) DEFAULT NULL', firebird: 'varchar(20) DEFAULT NULL', checked: false },
    'languages': { name: 'languages', mysql: 'varchar(100) DEFAULT NULL', firebird: 'varchar(100) DEFAULT NULL', checked: false },
    'isoAlpha3': { name: 'isoAlpha3', mysql: 'char(3) DEFAULT NULL', firebird: 'char(3) DEFAULT NULL', checked: false },
    'geonameId': { name: 'geonameId', mysql: 'int(10) DEFAULT NULL', firebird: 'integer DEFAULT NULL', checked: false }
};

module.exports = columns;
