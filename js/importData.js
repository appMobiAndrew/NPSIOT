/* Get lightpost data from Mashery */

var masheryURL = "http://npspoc.mashery.com/io-docs";

//var defaultNeighborhoodID = "las_vegas_strip";
var defaultNeighborhoodID = "city_santa_clara";

var apikey = "g3rthm4qcxbkjs2kye8vqqzm";

var switchSensorID = function(lightID) {
	return lightID + ".switch";
}

var motionSensorID = function(lightID) {
	return lightID + ".humans";
}

/* Smart City Methods */

var  urlGetNeighborhoods = function() { return "http://npspoc.api.mashery.com/smartcity/?apikey=" + apikey }

var urlGetNeighborhoodDetails = function(neighborhoodID) {
	return "http://npspoc.api.mashery.com/smartcity/" + neighborhoodID + "/?apikey=" + apikey;
}

/* Smart Street Light Methods */

var urlGetStreetLightSensors = function(neighborhoodID, lightID) {
	return "http://npspoc.api.mashery.com/smartcity/" + neighborhoodID + "/" + lightID + "/?apikey=" + apikey;

}

var urlGetStreetLightSensorDetails = function(neighborhoodID, lightID, sensorID) {
	return "http://npspoc.api.mashery.com/smartcity/" + neighborhoodID + "/" + lightID + "/" + sensorID + "/?apikey=" + apikey;

}

var urlUpdateStreetLightSensor = function(neighborhoodID, lightID, sensorID) {
	return "http://npspoc.api.mashery.com/smartcity/" + neighborhoodID + "/" + lightID + "/" + sensorID + "/?apikey=" + apikey;
}

//get all the sensors & humanity data
var getStreetlightPositions = function(passedNeightorhoodID) {
	if (passedNeightorhoodID == null) {
		passedNeightorhoodID = defaultNeighborhoodID;
	}

	$.getJSON(urlGetNeighborhoodDetails(passedNeightorhoodID),{},function(data){
		
		//console.log(data);
		
		//push this data into the stack
		data.forEach(function(entry) {
		
			var calculatedHumans = 1;
			//arrStreetLights.push({lat:entry.location.latitude,lng:entry.location.longitude,id:entry._id,installed:"",status:entry.status,notes:entry.description,humans:calculatedHumans});
			console.log(entry);
		});
		
	});
}


var switchLightOff = function (passedNeightorhoodID,passedLightID) {
	
	if (passedNeightorhoodID == null) {
		passedNeightorhoodID = defaultNeighborhoodID;
	}
	
	console.log(urlUpdateStreetLightSensor(passedNeightorhoodID,passedLightID,switchSensorID(passedLightID)));

	
	$.ajax({
		type:"POST",
		url: urlUpdateStreetLightSensor(passedNeightorhoodID,passedLightID,switchSensorID(passedLightID)),
		data:JSON.stringify({"value":0.0}),
		contentType:"application/json",
		error:function(data) {
			//error callback  
			console.log("error");
			console.log(data);
			
		},
		success:function(data){
			//success callback  
			console.log("success");
			console.log(data); 
			
		}
	});
	
	


}



var switchLightOn = function (passedNeightorhoodID,passedLightID) {
	
	if (passedNeightorhoodID == null) {
		passedNeightorhoodID = defaultNeighborhoodID;
	}
	
	console.log(urlUpdateStreetLightSensor(passedNeightorhoodID,passedLightID,switchSensorID(passedLightID)));
	
	
	$.ajax({
		type:"post",
		url:urlUpdateStreetLightSensor(passedNeightorhoodID,passedLightID,switchSensorID(passedLightID)),
		data:JSON.stringify({"value":1.0}),
		contentType:"application/json",
		error:function(data) {
			//error callback  
			console.log("error");
			console.log(data);
			
		},
		success:function(data){
			//success callback  
			console.log("success");
			console.log(data); 
			
		}
	});


}

var toggleLight = function(value, passedLightID) {
	if (value == true) {
		switchLightOn(null,passedLightID);
	} else {
		switchLightOff(null,passedLightID);
	}

}

