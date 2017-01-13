
// 'use strict';

const doc = require('dynamodb-doc');
const moment = require('moment');
const uuidV1 = require('uuid/v1');

const dynamo = new doc.DynamoDB();

var User = require("./user");

module.exports.handle = function (event, context, callback) {
    
    // console.log('Received event:', JSON.stringify(event, null, 2));

    var TableName = "HospitalUsers";
    var ClientId = "SPPC";
    var body = event.body;

    event = event || {};
    event.httpMethod = event.httpMethod || "GET";

    // console.log("got http method: %s", event.httpMethod);
    
    const done = function (err, res) { 
        callback(null, {
            statusCode: err ? '400' : '200',
            body: err ? err.message : JSON.stringify(res),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    switch (event.httpMethod) {
        
        case 'GET':
            //try {
                
                var ClientId = event.ClientId;
                var Contact = event.Contact;
                var UType = event.Type;
                var Id = event.Id;
                    
                if (!ClientId) return done({ "message": "Missing 'ClientId' cannot fetch response." });
                
                /** Get FilterExpression
                 *  */
                var FilterExpression = [ "ClientId = :client" ], ExpressionAttributeValues = {}, AttributesToGet = [];
                ExpressionAttributeValues[":client"] = ClientId;
                
                if (Contact) {
                    
                    FilterExpression.push("Contact = :contact")
                    ExpressionAttributeValues[":contact"] = Contact;
                }
                
                if (Id) {
                    
                    FilterExpression.push("Id = :id")
                    ExpressionAttributeValues[":id"] = Id;
                }
                
                if (UType) {
                    
                    FilterExpression.push("UType = :type")
                    ExpressionAttributeValues[":type"] = UType;
                }
                
                AttributesToGet.push("Id");
                AttributesToGet.push("Name");
                AttributesToGet.push("FirstName");
                AttributesToGet.push("LastName");
                AttributesToGet.push("Contact");
                AttributesToGet.push("Gender");
                AttributesToGet.push("Age");
                AttributesToGet.push("Email");
                AttributesToGet.push("Created");
                AttributesToGet.push("UType");
                
                var params = {
                    TableName: TableName,
                    //AttributesToGet: AttributesToGet,
                    FilterExpression: FilterExpression.join(" AND "),
                    ExpressionAttributeValues: ExpressionAttributeValues
                };
                    
                // console.log("querying: %j", params);

                dynamo.scan(params, function(err, res) {
                    if (err) return done(err);
                    callback(null, res && res.Items ? res.Items : []);
                });
            /*} catch(e) {
                done(e.toString());
            }*/
            break;
            
        case 'POST':
        
            try {
                // console.log("preparing item to insert");
                
                var user = new User(event);
                    
                if (!ClientId) return done({ "message": "Missing 'ClientId' cannot fetch response." });
                if (user.isInvalid()) return done({ "message": "Not a valid user. " + user.isInvalid() });

                var Item = user.item();

                // console.log("Inserting User: %j", Item);

                dynamo.putItem({ TableName: TableName, Item: Item }, done);
            } catch(e) {
                done({ message: e ? e.toString() : "Unknown error occurred while saving data" });
            }
            break;
        
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
    }
};