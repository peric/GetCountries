$(document).ready(function () {
	var allValues = [];
	var options = [];
	var settings = {type: "mysqltype",dblookup : false};
	var columnsAttr = {
		'countryCode': "char(2) NOT NULL DEFAULT ''", 
		'countryName': "varchar(45) NOT NULL DEFAULT ''",
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
		'languages': "varchar(100) DEFAULT NULL",
		'isoAlpha3': "char(3) DEFAULT NULL",
		'geonameId': "int(10) DEFAULT NULL"
	};
	var columnsAttrFB = {
		'countryCode': "char(3) NOT NULL", 
		'countryName': "varchar(45) NOT NULL",
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
		'languages': "varchar(100) DEFAULT NULL",
		'isoAlpha3': "char(3) DEFAULT NULL",
		'geonameId': "integer DEFAULT NULL"
	};	
	var columnsAttrLookupFB = {
		'countryCode': "char(3) NOT NULL", 
		'countryName': "varchar(45) NOT NULL",
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
		'isoAlpha3': "char(3) DEFAULT NULL",
		'geonameId': "integer DEFAULT NULL"
	};	
	
	var columnsAttrLookupLang = {
		'countryCode': "char(3) NOT NULL", 
		'languages': "varchar(10) NOT NULL",
	};		

	$('#showexamplecode').click(function (e) {
		e.preventDefault();
		
		$('#examplecode').toggle();
	})

	$('.options').change(function () {
		if ($('.options:checked').length < 1) {
			$(this).attr('checked','checked');
	    }	
	});

	$('#dblookup').click(function (e) {
		if ($('#dblookup').attr('checked')) {
			$('.options[value=languages]').attr('checked','checked');
	    }		
	});	
	$('#getcode').click(function () {
		allValues = [];
		options = [];

		$('.options').each(function () {
			var $this = $(this);
			if ($this.is(':checked')) {
				options.push($(this).val());
			}	
		});
		if ($('#dblookup').attr('checked')) {
		  if (!$('.options[value=languages]').attr('checked')) {
			options.push('languages');
		  }
		}

		$('.codetype').each(function () {
			var $this = $(this);
			if ($this.is(':checked'))
				settings.type = $this.val();
		});
		
		$('.dblookup').each(function () {
			var $this = $(this);
			if ($this.is(':checked')) {
				settings.dblookup = true;
			} else {
			  	settings.dblookup = false;
			}
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
	var uniqueArray =  function(arr) {
	  return arr.reduce(function(a,b){
		if (a.indexOf(b) < 0 ) a.push(b);
		return a;
	  },[]);
	}
	
	var generateLookupScript = function (i) {
	   /*
	     Purpose : To loop through each language value and create a entry in the country_lang_lnk tabel for 
		            it.
	   */
	   var sqlTmp = '';
	   var langVals = uniqueArray(allValues[i]['languages'].split(","));
	   for (var lKey in langVals) { //loop for each language value
	        if (langVals[lKey] == '') { continue; }
			
			sqlTmp += "INSERT INTO country_lang_lnk (";

			for(var key in columnsAttrLookupLang){ 
			    if (settings.type === "mysqltype") {
				  sqlTmp += " `" + key + "`, ";
				} else {
				  sqlTmp += " " + key + ", ";
                }				
			}
			sqlTmp = sqlTmp.substring(0, sqlTmp.length - 2);
			sqlTmp += ") VALUES";
			sqlTmp += " ("
			for(var key in columnsAttrLookupLang){ 
			    if (key == 'languages') {
				  var currValue = langVals[lKey];				
				} else {
				  var currValue = allValues[i][key];
				}  
			
				if (typeof currValue === "string")
				  sqlTmp += "'" + currValue + "', ";
				else if (typeof currValue === "number")
				  sqlTmp += "" + currValue + ", ";
			}
			sqlTmp = sqlTmp.substring(0, sqlTmp.length - 2);
			sqlTmp += "); \n"	
		} //end of loop for each language value	
	   return sqlTmp;
	}

	var generateScript = function () {
		var oLength = options.length;
		var valuesLength = allValues.length;
		var sql = "";
		var sqlLkp = "";
		var xml = "";
		var json = "";
		var csv = "";		

		if (settings.type === "mysqltype") {
			// create table
			sql = "CREATE TABLE IF NOT EXISTS `countries` (" +
					"\n\t`idCountry` int(5) NOT NULL AUTO_INCREMENT,";
			if (settings.dblookup == false) {		
				for (var i = 0; i < oLength; i++) {
					var currAttr = options[i];
					sql += "\n\t`" + options[i] + "` " + columnsAttr[options[i]] + ",";
				}
				sql += "\n\tPRIMARY KEY (`idCountry`)";
				sql += "\n) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;\n\n";
			} else {
				for (var i = 0; i < oLength; i++) {
					var currAttr = options[i];
					if (currAttr != 'languages') {
					  sql += "\n\t`" + options[i] + "` " + columnsAttrLookupFB[options[i]] + ",";
					}  
				}			
				sql += "\n\tPRIMARY KEY (`idCountry`)";
				sql += "\n) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;\n\n";
				sql += "CREATE TABLE IF NOT EXISTS `country_lang_lnk` (";
				var currAttr = '';
				for (var i = 0; i < oLength; i++) {
				    if (columnsAttrLookupLang[options[i]] != undefined ) {
					  currAttr = options[i];
					  sql += "\n\t`" + options[i] + "` " + columnsAttrLookupLang[options[i]] + ",";
					}  
				}
			    sql += "\n\tPRIMARY KEY (`countryCode`,`languages`)";
				sql += "\n) ENGINE=MyISAM DEFAULT CHARSET=utf8;\n\n";
			
			}
			
			// insert into
			sql += "INSERT INTO `countries` (";
			for (var i = 0; i < oLength; i++) {
			    if ((settings.dblookup == true) && (options[i] == 'languages')) { continue; }
				sql += "`" + options[i] + "`, ";
			}
			sql = sql.substring(0, sql.length - 2);
			sql += ") VALUES";
			for (var i = 0; i < valuesLength; i++) {
				sql += "\n("
				for (var j = 0; j < oLength; j++) {
				     if ((settings.dblookup == true) && (options[j] == 'languages')) { continue; }
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
			
			if (settings.dblookup == true) {
			  sql += ";\n";
			  for (var i = 0; i < valuesLength; i++) {
			    sql += generateLookupScript(i);
			  }
			}

			// set sql code
			$('#generatedcode').text(sql);
		} else if (settings.type === "xmltype") {
			xml += "<countries>";
			for (var i = 0; i < valuesLength; i++) {
				xml += "\n\t<country";
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
		} else if (settings.type === "jsontype") {
			json += "{";
			json += "\n\t\"countries\": {";
			json += "\n\t\t\"country\": [";
			for(var i = 0; i < valuesLength; i++) {
				json += "\n\t\t\t{";
					for (var j = 0; j < oLength; j++) {
						var currOption = options[j];
						var currValue = allValues[i][options[j]];

						if (j == (oLength - 1)) {
							json += "\n\t\t\t\t\"" + currOption + "\": \"" + currValue + "\"";
						} else {
							json += "\n\t\t\t\t\"" + currOption + "\": \"" + currValue + "\",";
						}
					}
				if (i == (valuesLength - 1)) {
					json += "\n\t\t\t}";
				} else {
					json += "\n\t\t\t},";
				}
			}
			json += "\n\t\t]";
			json += "\n\t}";
			json += "\n}";

			//set json code
			$('#generatedcode').text(json);
		} else if (settings.type === "firebirdtype") {
			// create table
			sql = "CREATE TABLE  countries (";
			if (settings.dblookup == false) {
				for (var i = 0; i < oLength; i++) {
					var currAttr = options[i];
					sql += "\n\t " + options[i] + " " + columnsAttrFB[options[i]] + ",";
				}
				sql += "\n\tPRIMARY KEY (countryCode)";
				sql += "\n);\n\n";
			} else {
				for (var i = 0; i < oLength; i++) {
					var currAttr = options[i];
					if (currAttr != 'languages') {
					  sql += "\n\t " + options[i] + " " + columnsAttrLookupFB[options[i]] + ",";
					}  
				}			
			    sql += "\n\tPRIMARY KEY (countryCode)";
			    sql += "\n);\n\n";
				sql += "CREATE TABLE  country_lang_lnk (";
				var currAttr = '';
				for (var i = 0; i < oLength; i++) {
				    if (columnsAttrLookupLang[options[i]] != undefined ) {
					  currAttr = options[i];
					  sql += "\n\t " + options[i] + " " + columnsAttrLookupLang[options[i]] + ",";
					}  
				}
			    sql += "\n\tPRIMARY KEY (countryCode,languages)";
			    sql += "\n);\n\n";
				
			}
  		   

			for (var i = 0; i < valuesLength; i++) {
				
				// insert into
				sql += "INSERT INTO countries (";
				for (var it = 0; it < oLength; it++) {
				   if ((settings.dblookup == true) && (options[it] == 'languages')) { continue; }
  				   sql += " " + options[it] + ", ";
				}
				sql = sql.substring(0, sql.length - 2);
				sql += ") VALUES";
			
				sql += " ("
				for (var j = 0; j < oLength; j++) {
					var currValue = allValues[i][options[j]];
					if ((settings.dblookup == true) && (options[j] == 'languages')) { continue; }
					
					if (typeof currValue === "string")
					  sql += "'" + currValue.replace(/\x27/g, 'x27x27') + "', ";
					else if (typeof currValue === "number")
					  sql += "" + currValue + ", ";
				}
				sql = sql.substring(0, sql.length - 2);
				sql += "); \n"
                if (settings.dblookup == true) {
				  sql += generateLookupScript(i);
				}  
				
			} 
			sql = sql.substring(0, sql.length - 1);
			
			// set sql code
			$('#generatedcode').text(sql);
	    } else if (settings.type === "csvtype") {
			csv = "";
			for (var j = 0; j < oLength; j++) {
				var currOption = options[j];
				csv += "\"" + currOption + "\",";
			}
			csv = csv.substring(0, csv.length - 1);			
			csv += "\n";
			for (var i = 0; i < valuesLength; i++) {
				for (var j = 0; j < oLength; j++) {
					var currValue = allValues[i][options[j]];
					csv += "\"" + currValue + "\",";
				}
				csv = csv.substring(0, csv.length - 1);
				csv += "\n";
			}
			
			// set csv code
     	   $('#generatedcode').text(csv);
        }
    }		
});