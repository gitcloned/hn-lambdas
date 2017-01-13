
// 'use strict';

const doc = require('dynamodb-doc');
const moment = require('moment');
const uuidV1 = require('uuid/v1');

const dynamo = new doc.DynamoDB();

var D = require('./utils/date');

var Form = require("../../form");

module.exports.handle = function (event, context, callback) {
    
    console.log('Received event:', JSON.stringify(event, null, 2));

    var TableName = "HospitalFormSurveyResults";
    var ClientId = "SPPC";
    var body = event.body;

    event = event || {};
    event.period = event.period || "1d";
    event.httpMethod = event.httpMethod || "GET";
    
    var dates = new D(moment.utc().toDate()).get(event.period);

    console.log("got http method: %s", event.httpMethod);
    
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
                var body = event.body ? JSON.parse(event.body) : {};
                
                var FormId = event.FormId;
                    
                if (!FormId) return done({ "message": "Missing 'FormId' cannot fetch response." });
                
                var form = new Form(FormId);

                /** Get FilterExpression
                 *  */
                var FilterExpression = [ "FormId = :form" ], ExpressionAttributeValues = {}, AttributesToGet = form.dynamoDBSelectClauses();
                FilterExpression.push("CTimestamp > :gte");
                
                ExpressionAttributeValues[":gte"] = dates.$gte.toISOString();
                ExpressionAttributeValues[":form"] = FormId;
                
                AttributesToGet.push("ResponseId");
                AttributesToGet.push("Timestamp");
                AttributesToGet.push("Score");
                
                var params = {
                    TableName: TableName,
                    //AttributesToGet: AttributesToGet,
                    FilterExpression: FilterExpression.join(" AND "),
                    ExpressionAttributeValues: ExpressionAttributeValues
                };
                    
                console.log("querying: %j", params);

                dynamo.scan(params, function(err, res) {
                    if (err) return done(err);
                    callback(null, res && res.Items ? res.Items : []);
                });
            /*} catch(e) {
                done(e.toString());
            }*/
            break;
        
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
    }
};