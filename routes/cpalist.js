var azure = require('azure-storage');
var async = require('async');

module.exports = CPAList;

function CPAList(cpa) {
  this.cpa = cpa;
}

CPAList.prototype = {
  show: function(req, res) {
    self = this;
    var query = new azure.TableQuery()
      .where('verified eq ?', false);
    self.task.find(query, function itemsFound(error, items) {
      res.render('index',{title: 'CPA List ', tasks: items});
    });
  },

  add: function(req,res) {
    var self = this
    var item = req.body.item;
    self.task.addItem(item, function itemAdded(error) {
      if(error) {
        throw error;
      }
      res.redirect('/');
    });
  },

  verify: function(req,res) {
    var self = this;
    var verifiedCPAs = Object.keys(req.body);
    async.forEach(verifiedCPAs, function taskIterator(verifiedCPA, callback) {
      self.task.updateItem(verifiedCPA, function itemsUpdated(error) {
        if(error){
          callback(error);
        } else {
          callback(null);
        }
      });
    }, function goHome(error){
      if(error) {
        throw error;
      } else {
       res.redirect('/');
      }
    });
  }
}

