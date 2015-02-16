exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
		    "proposal_no": "TEXT",
		    "category":"TEXT",
		    "policy_no": "TEXT",
		    "agent_id": "TEXT",
		    "agent_name": "TEXT",
		    "udid": "TEXT",
		    "type": "INTEGER",
		    "doc_type": "TEXT",
		    "capture_date": "TEXT",
		    "status": "INTEGER"	//0 = pending, 1 = ready, 2 = sync to server
		},
		adapter: {
			type: "sql",
			collection_name: "reg_info",
			idAttribute: 'id'
		},
    	
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			getRegList: function(type){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name +" where status != 0 and type ="+type+" order by id DESC";
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var listArr = []; 
                var count = 0;
                while (res.isValidRow()){
					listArr[count] = { 
							id: res.fieldByName('id'),
						    proposal_no: res.fieldByName('proposal_no'),
						    policy_no: res.fieldByName("policy_no"),
						    agent_id: res.fieldByName('agent_id'),
						    agent_name: res.fieldByName('agent_name'),
						    udid: res.fieldByName('udid'),
						    type: res.fieldByName('type'),
						    capture_date: res.fieldByName("capture_date"),
						    doc_type: res.fieldByName("doc_type"),
						    category: res.fieldByName("category"),
						    status: res.fieldByName("status"),
					};	
					console.log(res.fieldByName("category")); 
					res.next();
					count++;
				} 
			 
				res.close();
                db.close();
                return listArr;
			},getReadyReg: function(){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name +" where status=1 order by id DESC limit 0, 1";
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var rid; 
                var count = 0;
                while (res.isValidRow()){
					rid = res.fieldByName('id');	
					 
					res.next();
					count++;
				} 
			 
				res.close();
                db.close();
                return rid;
			},
			getRegById: function(id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name +" where id="+id+" order by id DESC";
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var listArr; 
                var count = 0;
                while (res.isValidRow()){
					listArr = { 
						id: res.fieldByName('id'),
					    proposal_no: res.fieldByName('proposal_no'),
					    policy_no: res.fieldByName("policy_no"),
					    agent_id: res.fieldByName('agent_id'),
					    agent_name: res.fieldByName('agent_name'),
					    udid: res.fieldByName('udid'),
					    type: res.fieldByName('type'),
					    category: res.fieldByName('category'),
					    doc_type: res.fieldByName('doc_type'),
					    capture_date: res.fieldByName('capture_date'),
					};	
					 
					res.next();
					count++;
				} 
			 
				res.close();
                db.close();
                return listArr;
			},
			updateStatusById:function(id, status){
				var collection = this;
                db = Ti.Database.open(collection.config.adapter.db_name);
		    	sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET status="+status+" WHERE id="+ id;
		    	
			},
			addReg : function(entry) {
				var collection = this;
                db = Ti.Database.open(collection.config.adapter.db_name);
		    
	            db.execute("BEGIN");
	       		sql_query = "INSERT INTO "+ collection.config.adapter.collection_name + "(proposal_no, agent_id, agent_name,udid, type, status, capture_date, policy_no, category, doc_type) VALUES ('"+entry.proposal_no+"', '"+entry.agent_id+"', '"+entry.agent_name+"', '"+entry.udid+"', '"+entry.type+"', '"+entry.status+"', '"+entry.capture_date+"', '"+entry.policy_no+"', '"+entry.category+"', '"+entry.doc_type+"')";
	       		console.log(sql_query);
				/*var colour = Alloy.createModel(collection.config.adapter.collection_name, {
			        proposal_no: entry.proposal_no,
				    agent_id: entry.agent_id,
				    agent_name: entry.agent_name,
				    udid: entry.udid,
				    type: entry.type
			    });
			    colour.save();*/
			    db.execute(sql_query);
                db.execute("COMMIT");
                var lastid = db.getLastInsertRowId();
	            db.close();
	            return lastid;
           },
           reset : function(){
           		var collection = this;
           		db = Ti.Database.open(collection.config.adapter.db_name);
           		sql_query = "delete from "+collection.config.adapter.collection_name;
           		db.execute(sql_query);
           		db.close();
           },
           update : function(id, status){
           		console.log("reg_info status updated");
           		var collection = this;
           		db = Ti.Database.open(collection.config.adapter.db_name);
           		sql_query = "update "+collection.config.adapter.collection_name+" set status =? where id=?";
           		db.execute(sql_query, status, id);
           		db.close();
           		return 1;
           }
		});

		return Collection;
	}
};