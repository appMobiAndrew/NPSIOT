//Aepona Voice Call Control App Framework Plugin 

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


//This object is called using $().aeponaCallControlPlugin()
(function($){
    $.fn.aeponaCallControlPlugin=function(){
        
        return {


			//This is just a simple test function 
			helloWorld:function() {
			
				alert("This plugin will allow apps to connect a voice call between two phone numbers the Aepona call control service");
			
			},
			
			connect:function (objParameters) {
				//This method actually connects the participants
				console.log("in connect");
				
				//The send method takes one parameter object with the following attributes: name0, phone0, name1, phone1, name2, phone2, callback
                var callback = function() {};  //code to call following the connection
				var objParticipants = { "callSessionInformation": { "participant": [] } };

				//Load the default call participants
				objParticipants = preSetCallData;

                
				//parse out the parameters for the call to be connected if parameters are passed
				if (objParameters != null) {
                    
                    console.log("parsing parameters");
					
					objParticipants.callSessionInformation.participant = [];
                    
					if (objParameters.phone0 != null && objParameters.name0 != null) {
                        objParticipants.callSessionInformation.participant.push({"participantAddress":"tel:+" + objParameters.phone0,"participantName":objParameters.name0});
					}
                    
					if (objParameters.phone1 != null && objParameters.name1 != null) {
						objParticipants.callSessionInformation.participant.push({"participantAddress":"tel:+" + objParameters.phone1,"participantName":objParameters.name1});
					}
                    
					if (objParameters.phone2 != null && objParameters.name2 != null) {
						objParticipants.callSessionInformation.participant.push({"participantAddress":"tel:+" + objParameters.phone2,"participantName":objParameters.name2});
					}
				}
                
                console.log(objParticipants);
              
				//Aepona Voice Call Control (VCC) Service
                $.ajax({
                    type:"POST",
                    url:"https://developer.aepona.com/ThirdPartyCallService/sip/1/thirdpartycall/callSessions",
					data: JSON.stringify(objParticipants) ,
					headers:{Authorization:"Basic anQwNTk0Omp0MTk4NjE0"},
					contentType:"application/json",
					dataType:'json',
					cache: false,
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
			
		}
			
    };
    
})(af)



//{phone0:\"17175537619\",phone1:\"14088396927\",name0:\"Andrew\",name1:\"David\"}

//Change this variable to alter the default 
var preSetCallData =  { "callSessionInformation": 
					{ "participant": [
						{
							"participantAddress": "tel:+14088396927",
							"participantName": "David Sidd Cell"
						},
						{
							"participantAddress": "tel:+12062261191",
							"participantName": "Caesar Winebrenner Cell"
						}
					] } 
				};
          