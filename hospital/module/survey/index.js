
'use strict';

const doc = require('dynamodb-doc');

const dynamo = new doc.DynamoDB();

module.exports.handle = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    var TableName = "HospitalFormSurveyResults";
    var ClientId = "SPPC";
    var PatientId = "P000001";

    event = event || {};
    event.httpMethod = event.httpMethod || "GET";

    console.log("got http method: %s", event.httpMethod);
    console.log("got http body: %j", event.body);

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

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
            var body = JSON.parse(event.body);
            var Answers = body.Answers;

            var Item = {};

            Item.PatientId = PatientId;
            Item.ClientId = ClientId;
            Item.Answers = Answers;

            Item.Score = 10;
            Item.ScoreSentiment = 0;

            console.log("Inserting Form Response: %j", Item);

            dynamo.putItem({ TableName: TableName, Item: Item }, done);
            break;
        case 'PUT':
            var body = JSON.parse(event.body);
            var Item = body.Item;
            dynamo.putItem({ TableName: TableName, Item: Item }, done);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
