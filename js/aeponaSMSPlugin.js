//Aepona SMS App Framework Plugin 

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


//This object is called using $().aeponaSMSPlugin()
(function($){
    $.fn.aeponaSMSPlugin=function(){
        
        return {


			//This is just a simple test function 
			helloWorld:function() {
			
				alert("This plugin will allow apps to send SMS messages using the Aepona SMS service");
			
			},
			
			send:function (objParameters) {
				//This method actually sends the SMS
				console.log("in send");
				
				//The send method takes one parameter object with the following attributes: destinationNumber, message, callback
				var destinationNumber = "";
				var passedMessage = "";
                var callback = function() {};  //code to call following the SMS
				
				//default
                passedMessage = preSetSMSMessage;
                destinationNumber = "%2B" + preSetSMSNumber;
                //destinationNumber = "%2B12062261191";  //Caesar
                
				
				//parse out the parameters
				if (objParameters != null) {
					if (objParameters.destinationNumber != null) { destinationNumber = objParameters.destinationNumber;}
					if (objParameters.message != null) { passedMessage = objParameters.message;}
				}
                
                console.log(destinationNumber);
                console.log(passedMessage);
                		
				
                //post the SMS request
                $.ajax({
                    type:"POST",
                    url:"https://developer.aepona.com/services/SendSmsService/OneAPIRESTv2/live/2_0/smsmessaging/outbound/12345/requests",
                    data:{address:destinationNumber, senderAddress:"12345", message:passedMessage},
                    headers:{Authorization:"Basic U2Vuc29yRGVtbzpeNXI4a3BWIUI0bXE="},
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


var preSetSMSNumber  =  "12062261191";
var preSetSMSMessage =  "I have all the Aepona working in the demo finally";
			
			
            