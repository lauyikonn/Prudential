var args = arguments[0] || {};
var reg_info = require("obj_reg_info");
reg_info.sync();

///////////function////////////
//function for slide to the page
function goSlide(event){
	var index = event.source.mod;	
	var arrViews = $.scrollableView.getViews();
	
	activeTab(index);
	//setTitle(index);
	
	$.scrollableView.scrollToView(arrViews[index]);
}

function nav_back(e){
	var nav = require("nav");
	nav.removeWindowRelationship();
}

function activeTab(index){
	switch(index){
		case "0" || 0:
			console.log(index);
			$.lb0.backgroundColor = "#ffffff";
			$.lb1.backgroundColor = "#cccccc";
			$.lb2.backgroundColor = "#cccccc";
			break;
		case "1" || 1:
			console.log(index);
			$.lb0.backgroundColor = "#cccccc";
			$.lb1.backgroundColor = "#ffffff";
			$.lb2.backgroundColor = "#cccccc";
			break;
		case "2" || 2:
			console.log(index);
			$.lb0.backgroundColor = "#cccccc";
			$.lb1.backgroundColor = "#cccccc";
			$.lb2.backgroundColor = "#ffffff";
			break;
	}
	console.log(index+" active tab");
}

//when scrollend event fire, move the hover to correct place. 
function scrollend(event){
	//console.log(event.currentPage);
	//activeTab(event.currentPage);
}

//////////////eventListener///////////
$.scrollableView.addEventListener("scrollend", scrollend);