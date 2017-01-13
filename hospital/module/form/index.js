
// 'use strict';


var Form = require("../../form");

module.exports.handle = function (event, context, callback) {
    
    console.log('Received event:', JSON.stringify(event, null, 2));

    var TableName = "HospitalFormSurveyResults";
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
        
        case 'GET':
            //try {
                var body = event.body ? JSON.parse(event.body) : {};
                
                var FormId = event.FormId;
                var ClientId = event.ClientId;
                    
                if (!ClientId) return done({ "message": "Missing 'ClientId' cannot fetch response." });
                
                if (FormId) {
                    var form = new Form(FormId);
                    var questions = form.questions();
                    
                    var out = [];
                    for (var i=0; i<questions.length; i++) {
                        
                        out.push({
                            "question_id": questions[i]["question_id"],
                            "question_type": questions[i]["question_type"] || "Checkboxes",
                            "question_title": questions[i]["question_title"],
                            "required": questions[i]["required"] ? questions[i]["required"] : false,
                            "choices": questions[i]["choices"] ? questions[i]["choices"].toString() : ""
                        })
                    }
                    
                    callback(null, out);    
                } else {
                    
                    require("../summary").getAllForms(function (err, forms) {
                        
                        if (err) return done(err);
                        
                        var out = [];
                        for (var i=0; i<forms.length; i++) {
                            
                            out.push({
                                "id": forms[i].id,
                                "name": forms[i].name
                            });
                        }
                        
                        callback(null, out);
                    });
                }
                
            /*} catch(e) {
                done(e.toString());
            }*/
            break;
        
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
    }
};