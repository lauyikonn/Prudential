var common = require("common");

exports.sentAPI = function(rid, $){
	
	var reg = Alloy.createCollection('reg_info');
	var reg_info = reg.getRegById(rid);
	var url = "http://54.169.180.5/prudential/api/data_save?user=prudential&key=06b53047cf294f7207789ff5293ad2dc";
	//var url = "http://smorgasbork.com/httpecho.php";
		var client = Ti.Network.createHTTPClient({
		     // function called when the response data is available
		     onload : function(e) {
		       var res = JSON.parse(this.responseText);
		       if(res.status == "success"){
		       		//common.createCustomAlert($.photo,"SUCCESSFUL","The Policy have successful completed");
		       		console.log("succes sync reg, and start sending images");
		       		API_SentImage(rid, res.data.last_id, $);
		       }
		     },
		     // function called when an error occurs, including a timeout
		     onerror : function(e) {
	       		$.loadingBar.height = 0;
				$.activityIndicator.hide();
				common.createCustomAlert($.photo,"ERROR","Offline Mode", "index");
				console.log("sync reg fail, back to index, maybe offline mode");
		     },
		     timeout : 50000  // in milliseconds
		 });
		 // Prepare the connection.
		 client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		 //client.setRequestHeader('User-Agent','Mozilla/5.0');
		 client.open("POST", url);
		 
		 //client.setRequestHeader("enctype", "multipart/form-data");
		 // Send the request.
		 
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
		 	policy_no	: policy_no,
			agent_id	 : reg_info.agent_id,
			agent_name 	: reg_info.agent_name,
			udid	     : reg_info.udid,
			type	  	 : reg_info.type,
			category	  	 : reg_info.category,
			doc_type	  	 : reg_info.doc_type,
			processing		 : "processing",
			scan_date		: reg_info.capture_date
		 }); 
};

exports.loadImage = function(view, controller){
	var img = Alloy.createCollection('images');
	var image_arr = img.getImgById();
	
	//for (var i = 0; i < image_arr.length; ++i) {
	    var imageview1 = Ti.UI.createImageView({
			image : image_arr.blob,
			width : Ti.UI.FILL,
		});
		var view4img = controller.UI.create("view", {classes:['listing_item']});
		view4img.add(imageview1);
		view.add(view4img);
	//}
};

exports.showCamera = function($, rid){
	Titanium.Media.showCamera({
        //we got something
        success:function(event)
        {
            //getting media
            var image = event.media;
            var img = Alloy.createCollection('images');
            //checking if it is photo
            if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
              	var image_item = [];
                var nativePath = event.media.nativePath;

			 	var currentTime = new Date();
			 	var tmp_filename = currentTime.getTime();
			 	var imageFile  = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "t"+tmp_filename+".jpg");
        		
        		var blob = event.media;
        		
        		/*imageFile.write(blob);
        		
        		blob = imageFile.read();
        		console.log(imageFile.nativePath);*/
        		if(blob.width > blob.height){
        			var newWidth = 320;
        			var ratio =   320 / blob.width;
        			var newHeight = blob.height * ratio;
        		}else{
        			var newHeight = 320;
        			var ratio =   320 / blob.height;
        			var newWidth = blob.width * ratio;
        		}
            	/*var ImageFactory = require('ti.imagefactory');
				ImageFactory.imageAsResized(blob, { width:newWidth, height:newHeight, quality:ImageFactory.QUALITY_LOW});
				*/
				blob = blob.imageAsResized(newWidth, newHeight);
                
				//add image into view
				console.log(blob.width);
				console.log(blob.mimeType);
				console.log(blob.name);
				console.log(blob.nativePath);
				var imageview1 = Ti.UI.createImageView({
					image : blob,
					width : Ti.UI.FILL,
				});
				
				
				
				//var resizeblob = Ti.Utils.base64encode(blob);
				//var decode = Ti.Utils.base64decode(resizeblob);
				//console.log(blob.width);
				//console.log(blob.mimeType);
				/*
				var my = {
					mod : require('SlowAES/Ti.SlowAES')
				};
				
				var crypto = new my.mod();
				
				var txtToEncrypt = resizeblob.toString();
				var txtSecret = "secret that cannot be told";
				//Demonstrate how to encrypt a value
				var encryptedValue = crypto.encrypt(txtToEncrypt,txtSecret);

				//Create a new instance of the SlowAES module
				var crypto = new my.mod();
				*/
				var image_item = {
					rid: rid,
					blob: blob
				};
				console.log(image_item.blob.mimeType);
				var returnid = img.addImages(image_item);
				imageFile.deleteFile();
				
				var view = $.UI.create('View', {classes: ["listing_item"]});
				var close = $.UI.create('ImageView',{image: "/images/icon_remove.png", mod: returnid, right: 0, top: 0, zIndex: 10, width: 35, height: 35});
				
				close.addEventListener("click", function(e){
					console.log(e.source.mod);
					$.images_container.remove(view);
					img.deleteRow(e.source.mod);
				});
				
				
				view.add(close);
				view.add(imageview1);
				
				$.images_container.add(view);
				
				//images_container.push(image_item);
				//var image2=Titanium.Utils.base64decode(resizeblob); 
				//imageFile.write(image2);
            }
        },
        cancel:function(){
            //do somehting if user cancels operation
        },
        error:function(error) {
            //error happend, create alert
            var a = Titanium.UI.createAlertDialog({title:'Camera'});
            //set message
            if (error.code == Titanium.Media.NO_CAMERA){
                a.setMessage('Device does not have camera');
            }else{
                a.setMessage('Unexpected error: ' + error.code);
                }
 
                // show alert
            a.show();
        },
        mediaTypes:Ti.Media.MEDIA_TYPE_PHOTO,
        allowImageEditing:true,
        saveToPhotoGallery:false
    });
};

var API_SentImage = function(rid, reg_key, $){
	var img = Alloy.createCollection('images');
	var reg = Alloy.createCollection('reg_info');
	var image = img.getImgById(rid);
	
	var url = "http://54.169.180.5/prudential/api/uploadImagesApi?user=prudential&key=06b53047cf294f7207789ff5293ad2dc";
	if(typeof image.id=== "undefined"){
		
		var url = "http://54.169.180.5/prudential/api/checkIfLast?user=prudential&key=06b53047cf294f7207789ff5293ad2dc";
		var client = Ti.Network.createHTTPClient({
		     // function called when the response data is available
		     onload : function(e) {
		     	console.log(this.responseText);
		       var res = JSON.parse(this.responseText);
		       if(res.status == "success"){
		       		reg.update(rid, 2);
		       		$.loadingBar.height = 0;
					$.activityIndicator.hide();
					console.log("policy update completed");
		       		common.createCustomAlert($.photo,"SUCCESSFUL","The Policy have successful completed", "index");
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
		     	console.log(this.responseText);
		       var res = JSON.parse(this.responseText);
				
		       if(res.status == "success"){
		       		img.update(1, image.id);
		       		img.deleteRow(image.id);
		       		API_SentImage(rid, reg_key, $);
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