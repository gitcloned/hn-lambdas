'use strict';

exports.handler = function (event, context, callback) {

    console.log("got event: %s", event.name);
    event.name = event.name || "summary";

    if (event.name === "summary") {

        var summary = require('./module/summary/index');

        return summary.handle(event, context, callback);
    } else if (event.name === "survey") {

        var survey = require('./module/survey/index');

        return survey.handle(event, context, callback);
    } else
        callback("Invalid operation, specify a valid event 'name'.");
};
