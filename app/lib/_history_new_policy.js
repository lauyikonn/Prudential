var common = require("common");

exports.showList = function($, type){
	var reg = Alloy.createCollection('reg_info');
	var lists = reg.getRegList(type);
	var status_arr = new Array("Not Valid","Pending","Success","Uploading");
	//console.log(lists);
	for (var i=0; i<lists.length; i++) {
		var val = lists[i];
		var proposal_val = '';
		var proposal_text = '';
		if(typeof val.proposal_no === "undefined" || val.proposal_no=="undefined"){
			proposal_text = "Policy Number: "+val.policy_no;
			proposal_val = val.policy_no;
		}else{
			proposal_text = "Proposal Number: "+val.proposal_no;
			proposal_val = val.proposal_no;
		}
		
		var row = $.UI.create('TableViewRow', {
			classes: ["reg_tvrow"]
		});
		
		var proposal_label = Ti.UI.createLabel({
				left: "20dp",
				text: proposal_text,
				textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
				color: "#ff0000",
				top: "20dp",
				font:{
					fontSize: "20dp"
				}
		});
		
		var agent_name_label = Ti.UI.createLabel({
				left: "20dp",
				text: "Agent Name: "+val.agent_name,
				textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
				font:{
					fontSize: "11dp"
				}
		});
		
		var category_label = Ti.UI.createLabel({
				left: "20dp",
				text: "Category: "+val.category,
				textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
				font:{
					fontSize: "11dp"
				}
		});
		
		var doc_type = Ti.UI.createLabel({
				left: "20dp",
				text: "Doc Type: "+val.doc_type,
				textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
				font:{
					fontSize: "11dp"
				}
		});
		
		var status = Ti.UI.createLabel({
				left: "20dp",
				text: "Status: "+status_arr[val.status],
				textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
				font:{
					fontSize: "11dp"
				}
		});
		
		var capture_date_label = Ti.UI.createLabel({
				left: "20dp",
				text: val.capture_date,
				textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
				bottom: "20dp",
				font:{
					fontSize: "11dp"
				}
		});
		
		var separator = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: "1px",
			backgroundColor: "#cccccc"
		});
			
		row.add(proposal_label);
		row.add(agent_name_label);
		row.add(category_label);
		row.add(doc_type);
		row.add(status);
		row.add(capture_date_label);
		row.add(separator);
		
		$.tableview.appendRow(row);
		row = null;
	}
	//$.tableview.search = $.searchView;
};