var args = arguments[0] || {};
var rid = args.id;
var method = require("lib_add_photo");
//reg_info.sync();

if (Ti.Platform.name === 'iPhone OS'){
  $.activityIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
}
else {
  $.activityIndicator.style = Ti.UI.ActivityIndicatorStyle.BIG;
}

$.activityIndicator.hide();
$.loadingBar.height = 0;
$.loadingBar.hide();

//var common = require("common");
//common.createCustomAlert($.photo,"SUCCESSFUL","The Policy have successful completed");
//method.loadImage($.images_container, $);

function back(e){
	var img = Alloy.createCollection('images');
	//img.closeConnection();
	var nav = require("nav");
	nav.removeWindowRelationship();
}

function image_submit(){
	$.loadingBar.height = Ti.UI.FILL;
	$.loadingBar.show();
	$.activityIndicator.show();
	
	var img = Alloy.createCollection('images');
	var reg = Alloy.createCollection('reg_info');
	var returnArray = img.getImgById(rid);
	var common = require("common");
	
	//set reg_info status to "ready" to sync.
	reg.update(rid, 1);
	console.log("local db reg update status to 1");
	if(typeof returnArray === 'undefined' && returnArray.length == 0){
		$.activityIndicator.hide();
		$.loadingBar.height = 0;
		common.createCustomAlert($.photo, "ERROR", "There is no image to submit");
	}else{
		if(Titanium.Network.online){
			method.sentAPI(rid, $);
		}else{
			$.loadingBar.height = 0;
			$.activityIndicator.hide();
			common.createCustomAlert($.photo,"ERROR","Offline Mode", "index");
			console.log("offline mode");
		}
	}
}

function takephoto(){
	method.showCamera($, rid);
}

/*
 * Eventlistener  
 * 
 * 
 * 
 * */

$.photo.addEventListener("close", function(){
	var img = Alloy.createCollection('images');
	//img.closeConnection();
});
