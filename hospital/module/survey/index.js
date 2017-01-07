
// 'use strict';

const doc = require('dynamodb-doc');
const moment = require('moment');
const uuidV1 = require('uuid/v1');
const marshalItem = require('dynamodb-marshaler').marshalItem;

const dynamo = new doc.DynamoDB();

module.exports.handle = function (event, context, callback) {
    
    console.log('Received event:', JSON.stringify(event, null, 2));

    var TableName = "HospitalFormSurveyResults";
    var ClientId = "SPPC";
    var PatientId = "P000001";
    var body = event.body;

    event = event || {};
    event.httpMethod = event.httpMethod || "GET";

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
        case 'DELETE':
            var body = JSON.parse(event.body);
            var Key = body.Key;
            dynamo.deleteItem({ TableName: TableName, Key: Key }, done);
            break;
        case 'GET':
            var body = event.body ? JSON.parse(event.body) : {};
            body.TableName = TableName;
            dynamo.scan(body, done);
            break;
        case 'POST':
        
            try {
                console.log("preparing item to insert");
                
                var Answers = JSON.parse(body);
                var FormId = event.FormId;
                
                if (!Answers || !FormId) return done({ "message": "Missing 'FormId' or 'Answers', cannot store form response." });
                
                var ResponseId = event.ResponseId || uuidV1();
                
                var DeviceId = event.DeviceId || "unknown";
                var DeviceType = event.DeviceType || "unknown";
                var DeviceModel = event.DeviceModel || "unknown";
                var DeviceOS = event.DeviceOS || "unknown";
                
                var Timestamp = event.Timestamp || moment.utc().format();

                var Item = {};

                Item.FormId = FormId;
                Item.ResponseId = ResponseId;
                Item.PatientId = event.PatientId || PatientId;
                Item.ClientId = event.ClientId || ClientId;
                Item.Answers = Answers;
                Item.Device = {
                    Id: DeviceId,
                    Type: DeviceType,
                    Model: DeviceModel,
                    OS: DeviceOS
                };

                Item.Score = event.Score;
                Item.ScoreSentiment = event.ScoreSentiment;
                
                Item.Timestamp = moment.utc(Timestamp).toDate().toISOString();
                
                Item = marshalItem(Item)
                
                Item.FormId = { "S": FormId };

                console.log("Inserting Form Response [%s]: %j", TableName, Item);

                dynamo.putItem({ TableName: TableName, Item: Item }, function (err, res) {
                    
                    console.log("got response")
                    if (err) console.log("Error occurred while writing to db: %s", err);
                    console.log("Inserted to db, res: %j", res);
                    
                    done(err, res);
                });
            } catch(e) {
                done({ message: e ? e.toString() : "Unknown error occurred while saving data" });
            }
            break;
        case 'PUT':
            var body = JSON.parse(event.body);
            var Item = body.Item;
            dynamo.put({ TableName: TableName, Item: Item }, done);
            break;
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
    }
};
