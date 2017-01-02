
var main = require('./index');
main.handler({}, {}, function (err, resp) {
    
    console.log("err: %s", err);
    console.log(resp);
})