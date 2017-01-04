
var FS = require('fs');
var PATH = require('path');

var getAllForms = function(done) {
    
    var forms = [];
  
    FS.readdir("res/forms", function(err, filenames) {
        
        if (err) {
            onError(err);
            return;
        }
        
        filenames.forEach(function(filename) {
            
            var form = require("./res/forms/" + filename.split(".")[0]);
            forms.push(form());
        });
        
        return done(null, forms);
    });
};

module.exports.handle = (event, context, callback) => {
    
    getAllForms(function (err, forms) {
       
        callback(err, {"forms": forms}); 
    });
};