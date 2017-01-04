
var AWS = require("aws-sdk");

var Forms = module.exports = function () {
    
    this.TableName = "sppc-forms-srurvey-results";
    this.db = new aws.DynamoDB();
};

Forms.prototype.query = function (params, callback) {
  
    params = params || {};
    
    params.TableName = this.TableName;
    
    console.log("querying db, table: %s, params: %j", this.TableName, params);
    
    forms.query(params, callback);
};