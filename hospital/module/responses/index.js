
// 'use strict';

const doc = require('dynamodb-doc');
const moment = require('moment');
const uuidV1 = require('uuid/v1');
const async = require('async');
const message = require('./sms');
const email = require('./mail');

const dynamo = new doc.DynamoDB();
// const sql = require('dynamodb-sql')(dynamo);

var D = require('./utils/date');

var Form = require("../../form");

module.exports.handle = function (event, context, callback) {
    
    // console.log('Received event:', JSON.stringify(event, null, 2));

    var TableName = "HospitalFormSurveyResults";
    var ClientId = "SPPC";
    var body = event.body;
    
    var env = event.env;
    if (env !== "PROD")
        TableName += "_" + env;

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
            try {
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
            } catch(e) {
                done(e.toString());
            }
            break;
            
        case 'POST':
        
            //try {
                // console.log("preparing item to insert");
                
                body = body || null;
                
                var Answers = JSON.parse(body);
                var FormId = event.FormId;
                var ClientId = event.ClientId;
                var UName = event.UserName;
                var UContact = event.UserContact;
                var MaxS = parseFloat(event.MaxScore || "0");
                var EmailN = event.EmailN || null;
                var SMSN = event.SMSN || null;
                    
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
                
                var TotalScore = 0;

                Item.Score = typeof event.Score === "number" ? event.Score : 0;
                Item.Sentiment = typeof event.ScoreSentiment === "number" ? event.ScoreSentiment : 0;
                Item.CTimestamp = moment.utc(CTimestamp).toDate().toISOString();
                
                if (typeof Answers === "object") {
                    
                    for (var key in Answers) {
                        if (Answers.hasOwnProperty(key)) {
                            
                            var Q = key, Score = Answers[key].Score, Resp = Answers[key].Resp;

                            if (typeof Resp === "undefined")
                                Resp = null;

                            if (typeof Resp === "string" && !Resp.trim().length)
                                Resp = null;

                            Item[Q + "_Score"] = Score;
                            Item[Q + "_Resp"] = Resp;
                            
                            TotalScore += Score;
                        }
                    }
                }
                
                var ops = [];
                
                if (MaxS > 0 && SMSN != null && SMSN.trim().length > 0) {
                    
                    // console.log("Inserting for SMS: %s", SMSN, MaxS, TotalScore);
                    
                    
                    ops.push(function(cb1) {
                       
                       message.nresp(SMSN, MaxS, TotalScore, { Name: UName, Contact: UContact }, Item, function(err, resp) {
                           
                           cb1(null);
                       }); 
                    });
                    
                    
                    ops.push(function(cb1) {
                       
                       email.nresp(EmailN, MaxS, TotalScore, { Name: UName, Contact: UContact }, Item, ClientId, function(err, resp) {
                           
                           cb1(null);
                       }); 
                    });
                }

                // console.log("Inserting Form Response: %j", Item);
                
                ops.push(function(cb2) {
                    
                    dynamo.putItem({ TableName: TableName, Item: Item }, function(err, resp) {
                    
                        // if (err) console.log(err);
                        
                        if (err) return cb2(err);
                        
                        cb2(null, "ok");
                    });                    
                });
                
                async.parallel(ops, function(err, resp) {
                        
                    if (err) return done(err);
                    
                    callback(null, "ok");
                });
            //} catch(e) {
            //    done({ message: e ? e.toString() : "Unknown error occurred while saving data" });
            //}
            break;
        
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
    }
};
