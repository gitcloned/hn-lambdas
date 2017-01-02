'use strict';

console.log('Loading function');

var FS = require('fs');
var PATH = require('path');

var getAllForms = function(done) {
    
    var forms = [];
  
    FS.readdir("forms", function(err, filenames) {
        
        if (err) {
            onError(err);
            return;
        }
        
        filenames.forEach(function(filename) {
            
            var form = require(PATH.join("forms", filename.split(".")[0]));
            forms.push(form());
        });
        
        return done(null, forms);
    });
};

exports.handler = (event, context, callback) => {
    
    getAllForms(function (err, forms) {
       
        callback(err, forms); 
    });
};
