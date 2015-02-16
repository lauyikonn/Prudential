var windowCabinet = [];
var currentWindow = '';

exports.setWindowRelationship = function(current){
 	 current.open();//{transition:Ti.UI.iPhone.AnimationStyle.CURL_DOWN}

	 currentWindow = current;
	 var tempArr = windowCabinet;
	 tempArr.push(current);
	 
	 windowCabinet = tempArr;
	 console.log("set"+currentWindow);
};

exports.removeWindowRelationship = function(){
	console.log("close"+currentWindow);
   	currentWindow.close({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
    var tempArr = windowCabinet;
	tempArr.splice((tempArr.length-1), 1);
	windowCabinet = tempArr;
	currentWindow = tempArr[(tempArr.length-1)];
};

exports.removeAllWindow = function(){
	 var tempArr = windowCabinet;
	 if(tempArr.length > 0){
	 	for(var a=0; a < tempArr.length; a++){
	 		tempArr[a].close();
	 	}
	 }
};