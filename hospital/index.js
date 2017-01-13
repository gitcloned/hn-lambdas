'use strict';

exports.handler = function (event, context, callback) {

    console.log("got event: %s", event.name);
    event.name = event.name || "summary";

    if (event.name === "summary") {

        var summary = require('./module/summary/index');

        return summary.handle(event, context, callback);
    } else if (event.name === "responses") {

        var survey = require('./module/responses/index');

        return survey.handle(event, context, callback);
    } else if (event.name === "form") {

        var survey = require('./module/form/index');

        return survey.handle(event, context, callback);
    } else if (event.name === "users") {

        var survey = require('./module/users/index');

        return survey.handle(event, context, callback);
    } else
        callback("Invalid operation, specify a valid event 'name'.");
};
