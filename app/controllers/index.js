$.index.open();

function navigate(e){
	var nav = require("nav");
	console.log(e.source.mod);
	var win = Alloy.createController(e.source.mod).getView(); 
	nav.setWindowRelationship(win);
}

function clearDB(){
	var reg = Alloy.createCollection('reg_info');
	var img = Alloy.createCollection('images');

	reg.reset();
	img.reset();
}