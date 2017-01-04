
var Forms = require("./db/forms");
var forms = new Forms();

module.exports.handle = (event, context, callback) => {
    
    var method = event.method || "GET";
    
    if (["GET", "PUT", "POST"].indexOf(method) === -1)
        return callback("Invalid method for survey function.");
        
    var params = {};
    
    for (key in event) {
        if (event.hasOwnProperty(key)) {
            
            params[key] = event[key];
        }
    }
    
    if (method === "GET") {
        forms.query(params, callback);
    } else 
        callback(null, {});
};