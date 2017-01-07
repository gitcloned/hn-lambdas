
var main = require('./index');
main.handler({ 
    name: "survey"
}, {}, function (err, resp) {

    console.log("err: %s", err);
    console.log(resp);
})