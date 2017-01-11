
// 'use strict';

const doc = require('dynamodb-doc');
const moment = require('moment');
const uuidV1 = require('uuid/v1');

const dynamo = new doc.DynamoDB();

var D = require('./utils/date');

module.exports.handle = function (event, context, callback) {
    
    console.log('Received event:', JSON.stringify(event, null, 2));

    var TableName = "HospitalFormSurveyResults";
    var ClientId = "SPPC";
    var body = event.body;

    event = event || {};
    event.period = event.period || "1d";
    
    var dates = new D(moment.utc().toDate()).get(period);

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
            var body = event.body ? JSON.parse(event.body) : {};

            /** Get FilterExpression
             *  */
            var FilterExpression = [], ExpressionAttributeValues = {}, AttributesToGet = [];
            FilterExpression.push("Timestamp > :gte");
            ExpressionAttributeValues[":gte"] = { "S": dates.$gte.toISOString() };

            dynamo.scan(body, done);
            break;
        
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
    }
};