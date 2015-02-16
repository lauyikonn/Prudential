var args = arguments[0] || {};
var reg = Alloy.createCollection('reg_info');
var agent_id = Ti.App.Properties.getString('agent_id');
var agent_name = Ti.App.Properties.getString('agent_name');

$.agent_id.value = agent_id;
$.agent_name.value = agent_name;

$.category_pk.height = 0;
$.category_pk.hide();

function nav_back(e){
	var nav = require("nav");
	nav.removeWindowRelationship();
}

function openCategory()
{
	$.category_pk.height = Ti.UI.SIZE;
	$.category_pk.show();
}

function openType(){
}

function typePicked(e){
}

function categoryPicked(e){
	$.category_pk.hide();
	$.category_pk.height = 0;
	var selected_row = $.category_pk.getSelectedRow(0);
	$.category_tf.value = selected_row.title;
	var category_row = selected_row.title;
	
	if(category_row == "New Claim Submission"){
		$.type_tf.value = "New Application";
	}else{
		$.type_tf.value = "Outstanding Requirement";
	}
}

function nav_photo(e){
	var common = require("common");
	var reg = Alloy.createCollection('reg_info');
	var policy_no = $.policy_no.value;
	var category_row = $.category_tf.value;
	var type = $.type_tf.value;
	
	agent_id = $.agent_id.value;
	agent_name = $.agent_name.value;
	
	if(typeof policy_no === "undefined" || policy_no == ""){
		common.createCustomAlert($.new_policy, "ERROR","Policy Number cannot be empty");
		return ;
	}
	
	if(policy_no.length > 8){
		common.createCustomAlert($.new_policy, "ERROR","Proposal Number cannot more than 8 digits");
		return ;
	}
	
	if(agent_id){
		Ti.App.Properties.setString('agent_id', agent_id);
	}
	
	if(agent_name){
		Ti.App.Properties.setString('agent_name', agent_name);
	}
	
	var returnid = reg.addReg({
		policy_no: policy_no,
	    agent_id: agent_id,
	    agent_name: agent_name,
	    udid: Titanium.Platform.id,
	    type: 3,
	    status: 0,
	    capture_date: getDate(),
	    category: category_row,
	    doc_type: type
	});
	var nav = require("nav");
	var win = Alloy.createController("_add_photo",{id: returnid}).getView(); 
	nav.setWindowRelationship(win);
}

function getDate() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
 
    if (hours < 10) { hours = "0" + hours;} 
    if (minutes < 10) { minutes = "0" + minutes;}
    if (seconds < 10) { seconds = "0" + seconds;}
 
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
 
}

$.policy_no.addEventListener('change', function(e){
    if(e.value.length > 8) {
        $.policy_no.value = e.value.substr(0, 8);
        $.policy_no.setSelection(8, 8);
    }
});
