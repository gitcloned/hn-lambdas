
var main = require('./index');
main.handler({ 
    name: "survey",
    httpMethod: "POST",
    "FormId": "F00001",
    "ResponseId": "asas",
    "PatientId": "P000001",
    "ClientId": "SPPC",
    "body": "{}",
    "DeviceId": "5bd76b07a3707cd2",
    "DeviceType": "AndroidDevice",
    "DeviceModel": "Android SDK built for x86",
    "DeviceOS": "3.10.0+",
    "Timestamp": "2017-01-07T16:12:00.000Z"
}, {}, function (err, resp) {

    console.log("err: %s", err);
    console.log(resp);
})