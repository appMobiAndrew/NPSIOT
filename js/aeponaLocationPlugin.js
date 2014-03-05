//Aepona Location Service App Framework Plugin 

/*
Copyright (c) 2014 Intel(R) Corporation

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


//This object is called using $().aeponaLocationPlugin()
(function($){
    $.fn.aeponaLocationPlugin=function(){
        
        terminalLocationData = null;
        
        return {

            //deviceAddressArray:["7176509761","977551753945","441234567890","447977156002","917176509761"],
            
            deviceAddressArray:["7176509761","4255034255","9787581795","2088675357","6027236401","2062261191"],
            
            locationQueryBaseURL: "https://developer.aepona.com/services/TerminalLocationService/OneAPIRESTv2/sandbox/2_0/location/queries/location?requestedAccuracy=500&Authorization=Basic%20U2Vuc29yRGVtbzpeNXI4a3BWIUI0bXE=&Accept=application/json",
            
		
			//This is just a simple test function 
			helloWorld:function() {
			
				alert("hello world");
			
			},
            
            getLocations: function(objParameters) {
                console.log("in getLocations");  
                
                //make sure a parameters object was passed
                if (objParameters == null) { objParameters = {}; }
                
                //use the numbers stored in the object if no numbers are passed
                var arrPhoneNumbers =  $().aeponaLocationPlugin().deviceAddressArray;
                if (objParameters.arrPhoneNumbers != null) { arrPhoneNumbers = objParameters.arrPhoneNumbers }
                
                //figure out what to call back with 
                var callbackFunction = function(objData) { console.log(objData); }
                if (objParameters.callback != null) { callbackFunction = objParameters.callback; }
                
                //call to Aepona to get the geolocation of these devices
                $.getJSON($().aeponaLocationPlugin().buildQueryURL(arrPhoneNumbers),{},function(data){
                    //data received from Aepona
                    //console.log("data received");
                    
                    //save the data to the object
                    $().aeponaLocationPlugin.terminalLocationData = data.terminalLocationList.terminalLocation;
                    
                    //console.log($().aeponaLocationPlugin.terminalLocationData);
                    
                    //execute the callback
                    callbackFunction(data.terminalLocationList.terminalLocation);
                    
                });
            },
            
            buildQueryURL: function(arrPhoneNumbers) {
                //build the query URL by adding in the telephone numbers for all the devices to be queried
                //console.log("in buildQueryURL");
                
                //start with the base URL
                var completedQuery = $().aeponaLocationPlugin().locationQueryBaseURL;
                
                //use the numbers stored in the object if no numbers are passed
                if (arrPhoneNumbers == null) { arrPhoneNumbers =  $().aeponaLocationPlugin().deviceAddressArray; }
                
                //sequentially add each phone number
                arrPhoneNumbers.forEach(function(entry) {
                    //console.log(entry);
                    completedQuery=completedQuery + "&address=" + entry;
                });
                
                //return the completed URL
                //console.log(completedQuery);
                return completedQuery
                
            },
            
            
            
            
        }
        
    };
    
    //execute following load
    $().aeponaLocationPlugin().getLocations();
    
})(af)
            
            
            
            