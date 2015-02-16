var args = arguments[0] || {};
var reg = Alloy.createCollection('reg_info');
var agent_id = Ti.App.Properties.getString('agent_id');
var agent_name = Ti.App.Properties.getString('agent_name');

$.agent_id.value = agent_id;
$.agent_name.value = agent_name;

function nav_back(e){
	var nav = require("nav");
	nav.removeWindowRelationship();
}

function categoryPicked(e){
	var selected_row = $.category.getSelectedRow(0);
	var category_row = selected_row.title;
	
	 if($.type.columns[0]) {
        var col = $.type.columns[0];
        var len = col.rowCount;
            for(var x = len-1; x >= 0; x-- ){
                    var row = col.rows[x];
                    col.removeRow(row);
            }
    }
	
	if(category_row == "New Business Submission"){
		var pickerRow = Ti.UI.createPickerRow({title:'New Application'});
		$.type.add(pickerRow);
	}else{
		var pickerRow = Ti.UI.createPickerRow({title:'Outstanding Requirement'});
		$.type.add(pickerRow);
	}
}

function nav_photo(e){
	var common = require("common");
	var reg = Alloy.createCollection('reg_info');
	var proposal_no = $.proposal_no.value;
	
	agent_id = $.agent_id.value;
	agent_name = $.agent_name.value;
	
	var selected_row = $.category.getSelectedRow(0);
	var category_row = selected_row.title;
	
	var typeSel_row = $.type.getSelectedRow(0);
	var type = typeSel_row.title;
	console.log(type);
	if(typeof proposal_no === "undefined" || proposal_no == ""){
		common.createCustomAlert($.new_policy, "ERROR","Proposal Number cannot be empty");
		return ;
	}
	
	if(proposal_no.length > 9){
		common.createCustomAlert($.new_policy, "ERROR","Proposal Number cannot more than 9 digits");
		return ;
	}
	
	if(agent_id){
		Ti.App.Properties.setString('agent_id', agent_id);
	}
	
	if(agent_name){
		Ti.App.Properties.setString('agent_name', agent_name);
	}
	
	var returnid = reg.addReg({
		proposal_no: proposal_no,
	    agent_id: agent_id,
	    agent_name: agent_name,
	    udid: Titanium.Platform.id,
	    type: 1,
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

$.proposal_no.addEventListener('change', function(e){
    if(e.value.length > 9) {
        $.proposal_no.value = e.value.substr(0, 9);
        $.proposal_no.setSelection(9, 9);
    }
});
