var azure = require('azure-storage');
var uuid = require('node-uuid');
var entityGen = azure.TableUtilities.entityGenerator;

module.exports = CPA;

function CPA(storageClient, tableName, partitionKey) {
  this.storageClient = storageClient;
  this.tableName = tableName;
  this.partitionKey = partitionKey;
  this.storageClient.createTableIfNotExists(tableName, function tableCreated(error) {
    if(error) {
      throw error;
      console.log(error);
    }
  });
};

CPA.prototype = {
        /* continuationToken:
         * {"nextPartitionKey":"1!8!Z2VvY3Bh",
         *  "nextRowKey":"1!48!MjNhMDZiNjUtZmM0MC00ZDk3LWE3YWMtMWIxOTE0MGNkNTYz",
         *  "targetLocation":0}
         */
  find: function(query, callback) {
    self = this;
    function nextPage(entries, continuationToken, callback){
      continuationToken.getNextPage(function(error, results, newContinuationToken){
        entries = entries.concat(results);
        if(newContinuationToken.nextPartitionKey){
          nextPage(entries,newContinuationToken, callback)
        }  else {
          callback(entries)
        }
      })
    }; //end function nextPage
    
    self.storageClient.queryEntities(this.tableName, query, null, function entitiesQueried(error, result) {
      if(error) {
        callback(error);
      } else {
        if(result.continuationToken){
          nextPage(result.entries, result.continuationToken.nextPartitionKey, callback);
        } else {
          callback(null, result.entries);
        }
        
      }
    });
  },

  addItem: function(item, callback) {
    self = this;
    // use entityGenerator to set types
    // NOTE: RowKey must be a string type, even though
    // it contains a GUID in this example.
    if( parseFloat(item.lat)!==NaN && parseFloat(item.lng)!==NaN ){
          var itemDescriptor = {
            PartitionKey: entityGen.String(self.partitionKey),
            RowKey: entityGen.String(uuid()),
	          name: entityGen.String(item.name.toUpperCase()),
            lat: entityGen.String(item.lat),
	          lng: entityGen.String(item.lng),
            verified: entityGen.Boolean(false)
          };
          self.storageClient.insertEntity(self.tableName, itemDescriptor, function entityInserted(error) {
            if(error){  
                callback(error);
            }
            callback(null);
          });
      
    } else {
      callback(new Error("Validation error!") );
    }

  },

  updateItem: function(rKey, callback) {
    self = this;
    self.storageClient.retrieveEntity(self.tableName, self.partitionKey, rKey, function entityQueried(error, entity) {
      if(error) {
        callback(error);
      }
      entity.completed._ = true;
      self.storageClient.updateEntity(self.tableName, entity, function entityUpdated(error) {
        if(error) {
          callback(error);
        }
        callback(null);
      });
    });
  }
}