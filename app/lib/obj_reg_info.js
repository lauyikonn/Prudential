exports.sync = function(){
	var reg = Alloy.createCollection('reg_info');
	var rid = reg.getReadyReg();
	if(typeof rid === "undefined"){
		console.log("reg is up to date");
	}else{
		syncToServer(rid);
	}
};

function recallSync(){
	var reg = Alloy.createCollection('reg_info');
	var rid = reg.getReadyReg();
	if(typeof rid === "undefined"){
		console.log("reg is up to date");
	}else{
		console.log("next reg for sync");
		syncToServer(rid);
	}
}

var syncToServer = function(rid){
	var reg = Alloy.createCollection('reg_info');
	var reg_info = reg.getRegById(rid);
	var url = "http://54.169.180.5/prudential/api/data_save?user=prudential&key=06b53047cf294f7207789ff5293ad2dc";
		var client = Ti.Network.createHTTPClient({
		     // function called when the response data is available
		     onload : function(e) {
		       var res = JSON.parse(this.responseText);
		       if(res.status == "success"){
		       		reg.update(rid, 3);
		       		//common.createCustomAlert($.photo,"SUCCESSFUL","The Policy have successful completed");
		       		console.log("succes sync reg, and start sending images");
		       		API_SentImage(rid, res.data.last_id);
		       }
		     },
		     // function called when an error occurs, including a timeout
		     onerror : function(e) {
				console.log("sync reg fail, back to index, maybe offline mode");
		     },
		     timeout : 50000  // in milliseconds
		 });
		 // Prepare the connection.
		 client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		 client.open("POST", url);
		 //client.setRequestHeader("enctype", "multipart/form-data");
		 // Send the request.
		 console.log(reg_info);
		 
		 var proposal_no = '';
		 var policy_no = '';
		 
		 if(typeof reg_info.proposal_no === undefined || reg_info.proposal_no === null || reg_info.proposal_no == "undefined"){
		 	proposal_no = '';
		 }else{
		 	proposal_no = reg_info.proposal_no;
		 }
		 
		 if(typeof reg_info.policy_no === undefined || reg_info.policy_no === null || reg_info.policy_no == "undefined"){
		 	policy_no = '';
		 }else{
		 	policy_no = reg_info.policy_no;
		 }
		 
		 console.log(proposal_no+" - "+policy_no);
		 
		 client.send({
		 	proposal_no	: proposal_no,
		 	policy_no 	: policy_no,
			agent_id	 : reg_info.agent_id,
			agent_name 	: reg_info.agent_name,
			udid	     : reg_info.udid,
			type	  	 : reg_info.type,
			category	  	 : reg_info.category,
			doc_type	  	 : reg_info.doc_type,
			processing		 : "processing"
		 }); 
};

var API_SentImage = function(rid, reg_key){
	var img = Alloy.createCollection('images');
	var reg = Alloy.createCollection('reg_info');
	var image = img.getImgById(rid);
	
	var url = "http://54.169.180.5/prudential/api/uploadImagesApi?user=prudential&key=06b53047cf294f7207789ff5293ad2dc";
	if(typeof image.id=== "undefined"){
		
		var url = "http://54.169.180.5/prudential/api/checkIfLast?user=prudential&key=06b53047cf294f7207789ff5293ad2dc";
		var client = Ti.Network.createHTTPClient({
		     // function called when the response data is available
		     onload : function(e) {
		       var res = JSON.parse(this.responseText);
		       if(res.status == "success"){
		       		reg.update(rid, 2);
					console.log("policy update completed");
					recallSync();
		       }
		     },
		     // function called when an error occurs, including a timeout
		     onerror : function(e) {
		     	console.log("reg sync fail - status completed");
		     },
		     timeout : 50000  // in milliseconds
		 });
		 // Prepare the connection.
		 client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		 client.open("POST", url);
		 //client.setRequestHeader("enctype", "multipart/form-data");
		 // Send the request.
		 client.send({
		 	processing	: "completed",
		 	reg_key		: reg_key
		 }); 
		return ;
	}else{
	var client = Ti.Network.createHTTPClient({
		     // function called when the response data is available
		     onload : function(e) {
		       var res = JSON.parse(this.responseText);
				
		       if(res.status == "success"){
		       		img.update(1, image.id);
		       		img.deleteRow(image.id);
		       		API_SentImage(rid, reg_key);
		       		console.log('next image');
		       }
		     },
		     // function called when an error occurs, including a timeout
		     onerror : function(e) {
		     	console.log("image upload fail");
		     },
		     timeout : 50000  // in milliseconds
		 });
		 // Prepare the connection.
		 //client.setRequestHeader("enctype", "multipart/form-data");
		 //client.setRequestHeader("Content-Type", "image/png");
		 client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		 client.open("POST", url);
		 
		 client.send({
		 	Filedata	: image.blob,
		 	reg_key			: reg_key
		 });
	}
};