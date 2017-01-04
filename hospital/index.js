'use strict';

var summary = require('./module/summary/index');
var survey = require('./module/survey/index');

exports.handler = (event, context, callback) => {
    
    event.name = event.name || "summary";
    
    if (event.name === "summary") {
    
        return summary.handle(event, context, callback);
    } else if (event.name === "survey") {
    
        return survey.handle(event, context, callback);
    } else
        callback("Invalid operation, specify a valid event 'name'.");
};
