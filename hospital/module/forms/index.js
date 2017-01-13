
// 'use strict';

const doc = require('dynamodb-doc');
const moment = require('moment');

const dynamo = new doc.DynamoDB();

var Form = require("./form");

module.exports.handle = function (event, context, callback) {
    
    // console.log('Received event:', JSON.stringify(event, null, 2));

    var TableName = "HospitalForms";
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
                var FormId = event.FormId;
                var FType = event.Type === "Archived" ? event.Type : "Active";
                    
                if (!ClientId) return done({ "message": "Missing 'ClientId' cannot fetch response." });
                
                /** Get FilterExpression
                 *  */
                var FilterExpression = [ "ClientId = :client" ], ExpressionAttributeValues = {}, AttributesToGet = [];
                ExpressionAttributeValues[":client"] = ClientId;
                
                if (FormId) {
                    
                    FilterExpression.push("FormId = :id")
                    ExpressionAttributeValues[":id"] = FormId;
                }
                
                if (FType) {
                    
                    FilterExpression.push("FType = :FType")
                    ExpressionAttributeValues[":FType"] = FType;
                }
                
                if (event.Select) AttributesToGet = event.Select.split(",");
                else {
                    AttributesToGet.push("Id");
                    AttributesToGet.push("Name");
                    AttributesToGet.push("Desc");
                    AttributesToGet.push("ClientId");
                    AttributesToGet.push("form");
                }
                
                var params = {
                    TableName: TableName,
                    // AttributesToGet: AttributesToGet,
                    FilterExpression: FilterExpression.join(" AND "),
                    ExpressionAttributeValues: ExpressionAttributeValues
                };
                    
                // console.log("querying: %j", params);

                dynamo.scan(params, function(err, res) {
                    if (err) return done(err);
                    
                    var out = []
                    for (var j=0; j<res.Items.length; j++) {
                    
                        var form = res.Items[j], formInfo = form.form, props = JSON.parse(formInfo).survey_properties;
                        out.push({
                            "FormId": form["FormId"],
                            "Name": form.Name,
                            "Description": form.Desc,
                            "IntoMessage": props ? props["intro_message"] : null,
                            "EndMessage": props ? props["end_message"] : null
                        })
                    }
                    callback(null, out);
                });
            /*} catch(e) {
                done(e.toString());
            }*/
            break;
            
        case 'POST':
        
            // try {
                // console.log("preparing item to insert");
                
                var form = new Form(event);
                    
                if (!ClientId) return done({ "message": "Missing 'ClientId' cannot fetch response." });
                if (form.isInvalid()) return done({ "message": "Not a valid form. " + form.isInvalid() });

                var Item = form.item();

                // console.log("Inserting Form: %j", Item);

                dynamo.putItem({ TableName: TableName, Item: Item }, done);
            // } catch(e) {
            //     done({ message: e ? e.toString() : "Unknown error occurred while saving data" });
            // }
            break;
            
        case 'DELETE':
        
            try {
                // console.log("preparing item to insert");
                
                event.FType = "Archived";
                var form = new Form(event);
                    
                if (!ClientId) return done({ "message": "Missing 'ClientId' cannot fetch response." });
                if (form.isInvalidInstance()) return done({ "message": "Not a valid form to DELETE. " + form.isInvalidInstance() });

                var Item = form.item();

                // console.log("Inserting User: %j", Item);

                dynamo.putItem({ TableName: TableName, Item: Item }, done);
            } catch(e) {
                done({ message: e ? e.toString() : "Unknown error occurred while saving data" });
            }
            break;
            
        case 'PUT':
        
            try {
                // console.log("preparing item to insert");
                
                var form = new Form(event);
                    
                if (!ClientId) return done({ "message": "Missing 'ClientId' cannot fetch response." });
                if (user.isInvalidInstance()) return done({ "message": "Not a valid form to DELETE. " + form.isInvalidInstance() });

                var Item = form.item();

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