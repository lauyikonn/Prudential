var tmp_db;

exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
		    "rid": "INTEGER",
		    "image_blob": "BLOB",
		    "status": "INTEGER",
		},
		adapter: {
			type: "sql",
			collection_name: "images",
			idAttribute: 'id'
		}
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
			addImages : function(entry) {
				var collection = this;
				
				db = Ti.Database.open(collection.config.adapter.db_name);
				db.execute("INSERT INTO "+ collection.config.adapter.collection_name + "(rid, image_blob, status) VALUES (?, ?, 0)", entry.rid, Ti.Utils.base64encode(entry.blob));
				var lastid = db.getLastInsertRowId();
				db.close();
				return lastid;
           },
           getImgById: function(rid){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name +" where rid = "+rid+" and status = 0 order by id DESC limit 0, 1";
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                var res = db.execute(sql);
                var media, id;
                var count = 0;
                while (res.isValidRow()){
					media = Ti.Utils.base64decode(res.fieldByName('image_blob'));
					id = res.fieldByName('id');
					res.next();
					count++;
				}
				console.log("total image"+count);
				res.close();
                db.close();
                return {blob: media, id: id};
			},
           ImageCommit : function(arr) {
           		if(tmp_db){
	           		tmp_db.execute("COMMIT");
	                var lastid = db.getLastInsertRowId();
		            tmp_db.close();
		            tmp_db = null;
		            console.log("lastid"+lastid);
		            return lastid;
	            }else{
	            	return 0;
	            }
           },
           closeConnection : function(){
           		if(tmp_db){
           			tmp_db.execute("ROLLBACK");
           			tmp_db.close();
	            	tmp_db = null;
           		}
           },
           reset : function(){
           		var collection = this;
           		db = Ti.Database.open(collection.config.adapter.db_name);
           		sql_query = "delete from "+collection.config.adapter.collection_name;
           		db.execute(sql_query);
           		db.close();
           },
           update : function(status, id){
           		var collection = this;
           		db = Ti.Database.open(collection.config.adapter.db_name);
           		sql_query = "update "+collection.config.adapter.collection_name+" set status =? where id=?";
           		db.execute(sql_query, status, id);
           		db.close();
           },
           resetStatus : function(rid){
           		var collection = this;
           		db = Ti.Database.open(collection.config.adapter.db_name);
           		sql_query = "update "+collection.config.adapter.collection_name+" set status = 0 where rid=?";
           		db.execute(sql_query, rid);
           		db.close();
           },
           deleteByRid : function(rid){
           		var collection = this;
           		db = Ti.Database.open(collection.config.adapter.db_name);
           		sql_query = "DELETE FROM "+collection.config.adapter.collection_name+" where rid=?";
           		db.execute(sql_query, rid);
           		db.close();
           },
           deleteRow : function(id){
           		var collection = this;
           		db = Ti.Database.open(collection.config.adapter.db_name);
           		sql_query = "DELETE FROM "+collection.config.adapter.collection_name+" where id=?";
           		db.execute(sql_query, id);
           		db.close();
           }
		});

		return Collection;
	}
};