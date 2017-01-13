
var main = require('./index');
main.handler({ 
    name: "form",
    "FormId": "F00001",
    "ClientId": "SPPC"
}, {}, function (err, resp) {

    console.log("err: %s", err);
    console.log(resp);
})

main.handler({ 
    name: "form",
    "ClientId": "SPPC"
}, {}, function (err, resp) {

    console.log("err: %s", err);
    console.log(resp);
})
