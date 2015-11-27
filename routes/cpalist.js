var azure = require('azure-storage');
var async = require('async');
var CPA_REGEX = '/(^[a-z]{1}\d{4}[a-z]{3}$|^\d{4}$)/gmi'

module.exports = CPAList;

function CPAList(cpa) {
  this.CPA = cpa;
}

CPAList.prototype = {
  show: function(req, res) {
    self = this;
    var query = new azure.TableQuery()
      .where('lat ne ?', '');
    self.CPA.find(query, function itemsFound(error, items) {
      res.render('list',{title: 'CPA List ', cpas: items});
    });
  },

  add: function(req,res) {
    var self = this
    var item = req.body;
    // postal code regex
    var re = /(^[a-z]{1}[1-9]\d{3}[a-z]{3}$|^[1-9]\d{3}$)/gi;
    var msg = {
      type: "success",
      intro: " ",
      message: "Guardado."
    };
    
    //validate
    if (parseFloat(item.lat)!==NaN &&
        parseFloat(item.lng)!==NaN &&
        item.name.match(re)  ){
        self.CPA.addItem(item, function itemAdded(error) {
        if(error) {
          //throw error;
          msg ={
           type: "danger",
           intro: "Validation error: ",
            message: error
          }
        }
        });
    } else {
      //validation error
      msg ={
        type: "danger",
        intro: "Error de validación: ",
        message: "El código postal no es válido."
      }
    }
    req.session.flash = msg;
    res.redirect(303, '/');
  },

  verify: function(req,res) {
    var self = this;
    var verifiedCPAs = Object.keys(req.body);
    async.forEach(verifiedCPAs, function cpaIterator(verifiedCPA, callback) {
      self.CPA.updateItem(verifiedCPA, function itemsUpdated(error) {
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

