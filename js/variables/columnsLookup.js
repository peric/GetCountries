var columnsLookup = [
    { name: 'countryCode', mysql: 'char(2) NOT NULL DEFAULT \'\'', firebird: 'char(3) NOT NULL', checked: true },
    { name: 'languages', mysql: 'varchar(100) DEFAULT NULL', firebird: 'varchar(100) DEFAULT NULL', checked: false }
];

module.exports = columnsLookup;