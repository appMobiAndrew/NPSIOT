//Geolocation App Framework Plugin 

/*
Copyright (c) 2013,2014 Intel(R) Corporation

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
*/

var heatmap;

//This object is called using $().geoLocationPlugin()
(function($){
    $.fn.geoLocationPlugin=function(){
	
		return {
            
            //currentLocation:{lat:40.713768,lng:-73.016696},   //NYC 
            //currentLocation:{lat:25.2711,lng:55.3075},        //Dubai - from Aepona
            //currentLocation:{lat:41.355755,lng:2.136605},     //Barcelona
            //currentLocation:{lat:45.5534,lng:-122.8192},      //Portland
            //currentLocation:{lat:36.1749700,lng:-115.1372200},        //Las Vegas
			//currentLocation:{lat:36.121722,lng:-115.169399},	//Las Vegas - The Venetian Hotel
            //currentLocation:{lat:36.121341,lng:-115.165987},        //Las Vegas - Sands Expo Center Hall D
			currentLocation:{lat:37.386384,lng:-121.966366},	//Santa Clara SC12

			arrEngineers: [
				{"lat":"37.390073", "lng":"-121.991844"},
				{"lat":"37.388709", "lng":"-121.963692"},
				{"lat":"37.386663", "lng":"-121.942234"},
				{"lat":"37.377660", "lng":"-121.982918"},
			],
			
        
            //location icons
            icons:{DEFAULT:"images/site.png", DEFAULT_OFF:"images/siteOff.png", GREEN:"images/Icon-Light1_green.png", RED:"images/Icon-Light1_red.png", ENGINEER:"images/engineer.png"},
            
            markers:new Array(),
		
			//This is just a simple test function 
			helloWorld:function() {
			
				alert("hello world");
			
			},
			
			//This function draws a Google Map with a heat signature
			drawHeatMap: function (objParameters) {
			
				console.log("in drawHeatMap");
				
                //by default, use Las Vegas
                var passedLatitude  = $().geoLocationPlugin().currentLocation.lat; 
                var passedLongitude = $().geoLocationPlugin().currentLocation.lng; 
				var mapCanvasID = "map_canvas";
								
				//if a parameter object is passed, use that information
				if (objParameters != null) {
					if (objParameters.mapCanvasID != null) { mapCanvasID = objParameters.mapCanvasID; }
				    if (objParameters.passedLatitude != null) { passedLatitude = objParameters.passedLatitude; }
					if (objParameters.passedLongitude != null) { passedLongitude =  objParameters.passedLongitude; }
				
				}
				
				//clear the map object
				_map = null;
				
				//clear the map DIV
				document.getElementById(mapCanvasID).innerHTML = "";
				
				//create the latlng object to pass to Google maps
				var latlng = new google.maps.LatLng(passedLatitude,passedLongitude);
								
				//create the options object to pass to Google maps
				var mapOptions = {
					zoom:15,
					center: latlng,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					zoomControl: true,
					zoomControlOptions: {
					  style: google.maps.ZoomControlStyle.SMALL,
					  position: google.maps.ControlPosition.LEFT_TOP
					}
				};
				
				//create the map object by passing the latlng and options objects to Google maps
				_map = new google.maps.Map(document.getElementById(mapCanvasID), mapOptions);
		

						
					
				//generate a pedestrian array from the lamp post data
				var pedestrianData = new Array();
				arrStreetLights.forEach(function(light){
					
					pedestrianData.push(new google.maps.LatLng(light.lat,light.lng));
					
					//add an extra pedestrian point
					for (var x=0; x<=light.humans; x++)
					{
						pedestrianData.push(new google.maps.LatLng(light.lat,light.lng));
					}
				
				});
				
				var pointArray = new google.maps.MVCArray(pedestrianData);

				console.log(pedestrianData);
				
				heatmap = new google.maps.visualization.HeatmapLayer({
					data: pointArray
				});

				heatmap.setMap(_map);
		
		
			
			},
			
			//This function draws the Google map to the DIV with the ID passed to mapCanvasID
			//This function is called by getPosition
			drawMap:function(objParameters) {
				//console.log("in drawMap");
                
                //The drawMap method takes one parameter object with the following attributes: mapCanvasID, positions, passedLatitude, passedLongitude
                var mapCanvasID = objParameters.mapCanvasID;
                var positions = "LIGHTS";
                if (objParameters.positions != null) {  positions = objParameters.positions; }
                var passedLatitude = objParameters.passedLatitude;
                var passedLongitude =  objParameters.passedLongitude;
                
                
                
                //use default if nothing is passed
                if (passedLatitude  == null) { passedLatitude  = $().geoLocationPlugin().currentLocation.lat; }
                if (passedLongitude == null) { passedLongitude = $().geoLocationPlugin().currentLocation.lng; }
			
				//clear the map object
				_map = null;
				
				//clear the map DIV
				document.getElementById(mapCanvasID).innerHTML = "";
                
                //console.log($().geoLocationPlugin().geographicCenter);
				
				//create the latlng object to pass to Google maps
				var latlng = new google.maps.LatLng(passedLatitude,passedLongitude);
				
				
				//set zoom level
				
		
				//create the options object to pass to Google maps
				var mapOptions = {
					zoom:15,
					center: latlng,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					zoomControl: true,
                  
					zoomControlOptions: {
					  style: google.maps.ZoomControlStyle.SMALL,
					  position: google.maps.ControlPosition.LEFT_TOP
					}
				};
				
				//The pop up for the location is created here
				infowindow = new google.maps.InfoWindow();

				//create the map object by passing the latlng and options objects to Google maps
				_map = new google.maps.Map(document.getElementById(mapCanvasID), mapOptions);
								
				//console.log("map drawn successfully");
                
                //draw the points on the map
				if (positions == "LIGHTS") {
					$().geoLocationPlugin().drawLampPositions();
				}
				if (positions == "ENGINEERS") {
				
					$().geoLocationPlugin().drawLampPositions({subset:"WARNING"});
					$().geoLocationPlugin().drawEngineerPositions();
				}

                
			},
            
            drawEngineerPositions:function() {
                
                console.log("in drawEngineerPositions");
               
                //draw the positions on the map with the appropriate info
                $().geoLocationPlugin().arrEngineers.forEach(function(entry) {

                    //draw a marker for this position
                    $().geoLocationPlugin().drawPosition({type:"ENGINEER",lat:entry.lat,lng:entry.lng});

                });

            },
            
            drawLampPositions:function(objParameters) {
                console.log("in drawLampPositions");
				
				var lampSubset = "";
				if (objParameters != null) {
					console.log(objParameters);
					if (objParameters.subset != null) { lampSubset = objParameters.subset; }
				}
				
				console.log(lampSubset);

                //$().geoLocationPlugin().arrStreetlights.forEach(function(entry) {
                  arrStreetLights.forEach(function(entry) {
                
                    //draw a marker for this position
					if (lampSubset != "WARNING" || entry.status != "OK") {
						$().geoLocationPlugin().drawPosition({type:"LIGHT",lat:entry.lat, lng:entry.lng, 
																id:entry.id, installed:entry.installed,
																status:entry.status, humans:entry.humans, notes:entry.notes});
					}


                    
                    /*
                    //draw entries in the left rail for each site
                    $("#ulSiteList").html(document.getElementById('ulSiteList').innerHTML + "<li><a href='javascript:'>" + 
                                          entry.name + "<br/>" + 
                                          entry.location + "<br/>" +  
                                          entry.state + "</a>");
					*/
                });
            },
			
			//This function gets the current latitude/longitude of the device and immediately attempts to draw a map 
			getPosition:function(mapCanvasID) {
					console.log("in getPosition");
					
                    //get the user's current location
                                
                    //store the user's current location as calculated by the devices geolocation services
					//$().geoLocationPlugin().currentLocation.lat = ;
					//$().geoLocationPlugin().currentLocation.lng = ;
			},
            
        
            //This method draws and labels a point on the map
            drawPosition:function(objParameters) {
                
                //The drawPosition method takes one parameter object with the following attributes: lat, lng, labelText, icon, siteText
                
                //this method is passed an object
				var type = objParameters.type
                var lat = objParameters.lat;
                var lng = objParameters.lng;
				var labelText = "";
				var siteText = "";
				if (objParameters.labelText != null) { labelText = objParameters.labelText; }
                if (objParameters.siteText != null) {siteText = objParameters.siteText; }
				
				var status = "OK";
				if (objParameters.status != null) { status = objParameters.status; }				
				
				var lightID = "";
				if (objParameters.id != null) { lightID = objParameters.id; }
				
				var installed = "";
				if (objParameters.installed != null) { installed = objParameters.installed; }
				
				var humans = "";
				if (objParameters.humans != null) { humans = objParameters.humans; }
				
				var notes = "";
				if (objParameters.notes != null) { notes = objParameters.notes; }
				
                
                var titleText = "";
               
                var icon = $().geoLocationPlugin().icons.DEFAULT; 
                if(objParameters.icon != null) { icon = $().geoLocationPlugin().icons[objParameters.icon]; }
                
                
                //draw a marker on the map, if the map is complete
                if (_map != null) {
                    //console.log("drawing a position on the map");
					
					var contentString = "";
					

					
					if (type == "ENGINEER") {
					
						icon = $().geoLocationPlugin().icons.ENGINEER
						contentString = "<div style='box-sizing:border-box;width:200px;'>" +
										"<h1>Repair Crew 14</h1>" +
										"Engineers: D. Sidd, A. Smith<br/>" + 
										"Shift: 1 (06:30-16:00)<br/>" +
										"Contact: 508-255-7602<br/>" +
										"<a class='button icon phone' href='javascript:$().aeponaCallControlPlugin().connect();'>Call</a>" +
										"<a class='button icon ' href='javascript:actionSheetSMS(\"17176509761\");'>SMS</a><br/>" +
										"<div class='button-grouped'>" +
										"<a class='button green' href='javascript:$.ui.popup({title:\"Work Assignment\",message:\"Repair Crew 14 has been assigned to repair light LP340-0106\",cancelText:\"OK\",cancelOnly:true,cancelCallback: function(){ $(\"#ulServiceSchedule\").html($(\"#ulServiceSchedule\").html()+\"<li><a>Repair LP340-0106</a></li>\") },}); infowindow.close();'>Assign</a> <a class='button red' href='javascript:infowindow.close();'>Cancel</a></div>" +
										"<a class='button orange' href='javascript:$.ui.updateSideMenuElements($(\"#nav_service_inventory\"))'>View Inventory</a><br/>" +
										"<a class='button yellow' href='javascript:$.ui.updateSideMenuElements($(\"#nav_service_schedule\"))'>View Schedule</a><br/>" +
										"</div>";
										
					}
			        
					if (type == "LIGHT") {
					
						if (status == "OK") { icon = $().geoLocationPlugin().icons.GREEN; }
						if (status == "BULB_WARNING") { icon = $().geoLocationPlugin().icons.RED; }
					
						//console.log(this.markers);
						contentString =  "<div style='box-sizing:border-box;width:200px;'>ID: LP340-0102<br/>" +
										"Network: LVS-031<br/>" +
										"Region: Las Vegas<br/>" +
										
										//On/Off Control
										"<input id=\"toggle1\" checked=\"\" type=\"checkbox\" name=\"toggle1\" value=\"1\" class=\"toggle\" onchange=\"toggleLight(this.checked,'LP340-0102');\">" +
										"<label f" + "or=\"toggle1\" data-on=\"On\" data-off=\"Off\" style=\"float:left;\"><span></span></label><br style=\"clear:both\">" +
										
										//Slider Control
										/*
										"<div> Light Control<br/><p id=\"spnCurrentDimness\">0%</p>" +
										"0%  <input id=\"dimmerSlider\" type=\"range\" min=\"0\" max=\"100\" value=\"0\" onchange=\"dimmerChanged(this.value);\" /> 100%" +	
										*/
										
										
										"<div class=\"button-grouped\"><a class=\"button\" href=\"javascript:showPanel('light')\">Manage</a></div>";
					} 
					  
					
                    //The location marker is created here
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(lat,lng),
                        map: _map,
                        title: titleText,
                        icon: icon 
                    });
					
					//add the click event  
					google.maps.event.addListener(marker, 'click', function() {
						infowindow.close();
						infowindow = new google.maps.InfoWindow({
							  content: contentString,
						});
						infowindow.open(_map,marker);
						if (type == "ENGINEER") { _map.setZoom(14); } else { _map.setZoom(18); }
						_map.panTo(marker.position);
					});
					
					
					
                }
            }
		}
    };
})(af)


function highlightBadLight() {

	//infowindow.open(_map,marker);
	_map.setZoom(18); 
	_map.panTo(new google.maps.LatLng(37.382089,-121.963617));

}


function dimmerChanged(dimmerValue) {
	console.log(dimmerValue);
	$("#spnCurrentDimness").html(dimmerValue + "%");
}

var globalDestinationNumber;
function actionSheetSMS(passedDestinationNumber) {
    
    if (passedDestinationNumber == null) 
	{ passedDestinationNumber = "%2B14088396927"; }
	else
	{ passedDestinationNumber = "%2B" + passedDestinationNumber; }
	
	globalDestinationNumber = passedDestinationNumber;
    
	//$().aeponaSMSPlugin().send({destinationNumber:\"%2B14088396927\",message:\"Test Message from the Lighting Demo\"});
	
    $.ui.actionsheet("<input type='text' id='txtMessage' value='Repair Crew 14 has been assigned to repair light LP340-0106'></input><a class='button' style='width:100%;' onclick='$().aeponaSMSPlugin().send({destinationNumber:globalDestinationNumber,message:document.getElementById(\"txtMessage\").value});'>Send Message</a>");   
}

/*
Sample AF code to put into index.html

        <!-- GEOLOCATION PLUGIN PANEL SAMPLE -->
        <!-- Make sure scrolling is turned off with the style="overflow:hidden" attribute and that the panel includes the following attribute: data-load="updateMap"  -->
        <div class="panel" title="Geolocation Sample" data-footer="footer_0" data-nav="nav_0"
        id="geo" data-appbuilder-object="page" data-load="updateMap" style="overflow: hidden;">

            <!-- Include the Google Maps JavaScript Library -->
            <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"
            style=""></script>
            <script src="http://maps.gstatic.com/intl/en_us/mapfiles/api-3/15/1a/main.js"
            type="text/javascript" style=""></script>

            <!-- The Geolocation App Framework Plugin -->
            <script type="text/javascript" src="geolocationPlugin.js" style=""></script>

            <!-- Add a DIV to draw the map on -->
            <div id="map_canvas" style="width:100%;height:100%;text-align:center;">
                <h1>Loading Map</h1>
                <script>
                    var updateMap = function() { $().geoLocationPlugin().getPosition("map_canvas"); };
                </script>
            </div>

        </div>
        <!-- End of Geolocation Plugin Sample -->

*/
