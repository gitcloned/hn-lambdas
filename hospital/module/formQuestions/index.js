
// 'use strict';

const doc = require('dynamodb-doc');
const moment = require('moment');

const dynamo = new doc.DynamoDB();

var Form = require("../forms/form");

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
                    
                if (!ClientId) return done({ "message": "Missing 'ClientId' cannot fetch response." });
                if (!FormId) return done({ "message": "Missing 'FormId' cannot fetch response." });
                
                /** Get FilterExpression
                 *  */
                var FilterExpression = [ "ClientId = :client" ], ExpressionAttributeValues = {}, AttributesToGet = [];
                ExpressionAttributeValues[":client"] = ClientId;

                FilterExpression.push("FormId = :id")
                ExpressionAttributeValues[":id"] = FormId;
                
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
                    //AttributesToGet: AttributesToGet,
                    FilterExpression: FilterExpression.join(" AND "),
                    ExpressionAttributeValues: ExpressionAttributeValues
                };
                    
                // console.log("querying: %j", params);

                dynamo.scan(params, function(err, res) {
                    if (err) return done(err);
                    if (res && res.Items && !res.Items.length) done({ message: e ? e.toString() : "Unknown FormId" });
                    
                    var out = [], formInfo = res.Items[0].form, questions = JSON.parse(formInfo).questions;
                    for (var i=0; i<questions.length; i++) {
                        
                        out.push({
                            "question_id": questions[i]["question_id"],
                            "question_type": questions[i]["question_type"] || "Checkboxes",
                            "question_title": questions[i]["question_title"],
                            "required": questions[i]["required"] ? "true" : "false",
                            "choices": questions[i]["choices"] ? questions[i]["choices"].toString() : null,
                            "score_enabled": questions[i]["score_enabled"] ? "true" : "false",
                            "scores": questions[i]["scores"] ? questions[i]["scores"].toString() : null,
                            "score_weight": questions[i]["score_weight"] ? questions[i]["score_weight"].toString() : null
                        })
                    }
                    callback(null, out);
                });
            /*} catch(e) {
                done(e.toString());
            }*/
            break;
        
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
    }
};