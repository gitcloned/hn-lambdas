
// 'use strict';

const doc = require('dynamodb-doc');
const moment = require('moment');
const uuidV1 = require('uuid/v1');

const dynamo = new doc.DynamoDB();

var D = require('./utils/date');

var Form = require("../../form");

module.exports.handle = function (event, context, callback) {
    
    // console.log('Received event:', JSON.stringify(event, null, 2));

    var TableName = "HospitalFormSurveyResults";
    var ClientId = "SPPC";
    var body = event.body;

    event = event || {};
    event.period = event.period || "1d";
    event.httpMethod = event.httpMethod || "GET";
    
    var dates = new D(moment.utc().toDate()).get(event.period);

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
                var body = event.body ? JSON.parse(event.body) : {};
                
                var FormId = event.FormId;
                var ClientId = event.ClientId;
                    
                if (!ClientId) return done({ "message": "Missing 'ClientId' cannot fetch response." });
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
            
        case 'POST':
        
            try {
                // console.log("preparing item to insert");
                
                var Answers = JSON.parse(body);
                var FormId = event.FormId;
                var ClientId = event.ClientId;
                var UName = event.UserName;
                var UContact = event.UserContact;
                    
                if (!ClientId) return done({ "message": "Missing 'ClientId' cannot fetch response." });
                if (!Answers || !FormId) return done({ "message": "Missing 'FormId' or 'Answers', cannot store form response." });
                if (!UName || !UContact) return done({ "message": "Missing 'User Name' or 'Contact', cannot store form response." });
                
                var ResponseId = event.ResponseId || uuidV1();
                
                var DeviceId = event.DeviceId || "unknown";
                var DeviceType = event.DeviceType || "unknown";
                var DeviceModel = event.DeviceModel || "unknown";
                var DeviceOS = event.DeviceOS || "unknown";
                
                var CTimestamp = event.Timestamp || moment.utc().format();

                var Item = {};

                Item.FormId = FormId;
                Item.ResponseId = ResponseId;
                Item.UName = UName;
                Item.UContact = UContact;
                Item.ClientId = event.ClientId || ClientId;
                // Item.Answers = Answers;
                Item.Device = {
                    Id: DeviceId,
                    Type: DeviceType,
                    Model: DeviceModel,
                    OS: DeviceOS
                };

                Item.Score = typeof event.Score === "number" ? event.Score : 0;
                Item.Sentiment = typeof event.ScoreSentiment === "number" ? event.ScoreSentiment : 0;
                Item.CTimestamp = moment.utc(CTimestamp).toDate().toISOString();
                
                if (typeof Answers === "object") {
                    
                    for (var key in Answers) {
                        if (Answers.hasOwnProperty(key)) {
                            
                            var Q = key, Score = Answers[key].Score, Resp = Answers[key].Resp;
                            Item[Q + "_Score"] = Score;
                            Item[Q + "_Resp"] = Resp;
                        }
                    }
                }

                // console.log("Inserting Form Response: %j", Item);

                dynamo.putItem({ TableName: TableName, Item: Item }, done);
            } catch(e) {
                done({ message: e ? e.toString() : "Unknown error occurred while saving data" });
            }
            break;
        
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
    }
};