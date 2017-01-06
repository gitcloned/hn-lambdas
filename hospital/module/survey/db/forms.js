
var AWS = require("aws-sdk");

AWS.config.update({
	region: "us-east-1"
});

var Forms = module.exports = function () {
    
    this.TableName = "sppc-forms-srurvey-results";
    this.db = new AWS.DynamoDB();
};

Forms.prototype.query = function (params, callback) {
  
    params = params || {};
	
	var keyCondition = [], ctr = 0, expr = {};
	for (var key in params) {
		if (params.hasOwnProperty(key)) {
			
			keyCondition.push(key + " = :" + "val" + (ctr).toString());
			expr[":" + "val" + (ctr).toString()] = { "S": params[key] };
			
			ctr = ctr + 1;
		}
	}
    
    params = { TableName: this.TableName, KeyConditionExpression: keyCondition.join(" AND "), ExpressionAttributeValues: expr };
    
    console.log("querying db, table: %s, params: %j", this.TableName, params);
    
    this.db.query(params, callback);
};

Forms.prototype.insert = function (params, callback) {
  
	params = { TableName: this.TableName, Item: params };
    
    console.log("inserting into db, table: %s, params: %j", this.TableName, params.Item);
    
    this.db.put(params, callback);
};