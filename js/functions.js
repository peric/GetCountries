$(document).ready(function () {
	var allValues = [];
	var options = [];
	var settings = {type: "sqltype"};
	var columnsAttr = {
		'countryCode': "char(2) NOT NULL DEFAULT ''", 
		'countryName': "varchar(80) NOT NULL DEFAULT ''",
		'currencyCode': "char(3) DEFAULT NULL",
		'population': "varchar(20) DEFAULT NULL",
		'fipsCode': "char(2) DEFAULT NULL",
		'isoNumeric': "char(4) DEFAULT NULL",
		'north': "varchar(30) DEFAULT NULL",
		'south': "varchar(30) DEFAULT NULL",
		'east': "varchar(30) DEFAULT NULL",
		'west': "varchar(30) DEFAULT NULL",
		'capital': "varchar(30) DEFAULT NULL",
		'continentName': "varchar(15) DEFAULT NULL",
		'continent': "char(2) DEFAULT NULL",
		'areaInSqKm': "varchar(20) DEFAULT NULL",
		'languages': "varchar(30) DEFAULT NULL",
		'isoAlpha3': "char(3) DEFAULT NULL",
		'geonameId': "int(10) DEFAULT NULL"
	};

	$('#showexamplecode').click(function (e) {
		e.preventDefault();
		$('#examplecode').toggle();
	})

	$('.options').change(function () {
		if ($('.options:checked').length < 1)
			$(this).attr('checked','checked');
	});

	$('#getcode').click(function () {
		allValues = [];
		options = [];

		$('.options').each(function () {
			var $this = $(this);
			if ($this.is(':checked'))
				options.push($(this).val());
		});
		$('.codetype').each(function () {
			var $this = $(this);
			if ($this.is(':checked'))
				settings.type = $this.val();
		});
		fetchCountries();
	});

	$("#generatedcode").focus(function() {
    	var $this = $(this);
    	$this.select();

    	$this.mouseup(function() {
        	$this.unbind("mouseup");
        	return false;
    	});
	});

	var fetchCountries = function () {
		$.getJSON("http://api.geonames.org/countryInfoJSON?username=dperic", function(data) {
			for(var i = 0; i < data.geonames.length; i++) {
				var oLength = options.length;
				var value = {};

				for (var j = 0; j < oLength; j++) {
					var currAttr = options[j];
					value[currAttr] = data.geonames[i][currAttr]; 
				}
				allValues.push(value);
			}
			generateScript();
		});
	}

	var generateScript = function () {
		var oLength = options.length;
		var valuesLength = allValues.length;
		var sql = "";
		var xml = "";

		if (settings.type === "sqltype") {
			// create table
			sql += "CREATE TABLE IF NOT EXISTS `countries` (" +
					"\n	`idCountry` int(5) NOT NULL AUTO_INCREMENT,";
			for (var i = 0; i < oLength; i++) {
				var currAttr = options[i];
				sql += "\n	`" + options[i] + "` " + columnsAttr[options[i]] + ",";
			}
			sql += "\n	PRIMARY KEY (`idCountry`)";
			sql += "\n) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;\n\n";
			
			// insert into
			sql += "INSERT INTO `countries` (";
			for (var i = 0; i < oLength; i++) {
				sql += "`" + options[i] + "`, ";
			}
			sql = sql.substring(0, sql.length - 2);
			sql += ") VALUES";
			for (var i = 0; i < valuesLength; i++) {
				sql += "\n("
				for (var j = 0; j < oLength; j++) {
					var currValue = allValues[i][options[j]];
					if (typeof currValue === "string")
						sql += "'" + currValue.replace(/\x27/g, '\\\x27') + "', ";
					else if (typeof currValue === "number")
						sql += "" + currValue + ", ";
				}
				sql = sql.substring(0, sql.length - 2);
				sql += "),"
			}
			sql = sql.substring(0, sql.length - 1);
			
			// set sql code
			$('#generatedcode').text(sql);
		} else if (settings.type === "xmltype") {
			xml += "<countries>";
			for (var i = 0; i < valuesLength; i++) {
				xml += "\n	<country";
				for (var j = 0; j < oLength; j++) {
					var currOption = options[j];
					var currValue = allValues[i][options[j]];
					xml += " " + currOption + "=\"" + currValue + "\"";
				}
				xml += " />";
			}
			xml += "\n</countries>";
			
			// set xml code
			$('#generatedcode').text(xml);
		}
	}
});