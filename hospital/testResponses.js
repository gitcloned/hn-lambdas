
var main = require('./index');
main.handler({ 
    name: "responses",
    "FormId": "F00001"
}, {}, function (err, resp) {

    console.log("err: %s", err);
    console.log(resp);
})
