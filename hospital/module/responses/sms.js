
var request = require('request');

var sms = module.exports.sms = function (to, body, done) {
    
    var params = {
        'apiKey': process.env.textLocalAPIKey,
        'group_id': '717418'
    };
    
    params.message = body;
    params.sender = 'TXTLCL';
    
    console.log("sending sms to: %s", to)

    request({
        'url': 'http://api.textlocal.in/send?apiKey=' + params.apiKey + '&sender=TXTLCL&numbers=' + to + '&message=' + params.message,
        'method': 'GET'/*,
        json: true,
        body: {
                apiKey: 'q4af6Qst/1w-6ETBnRGXNAwJqDkkUbClfjhcJ2QDMe',
                sender: 'TXTLCL',
                group_id: '717418',
                message: 'test'
        }*/
    }, function(err, resp, body) {
        if (err) console.log(err);
        //console.log(body);
        //console.log(resp);
        done(null)
    });
};

module.exports.nresp = function (to, maxScore, score, from, form, done) {
    
    var midScore = maxScore * 0.6;
    
    console.log("Got sms, maxScore: %s, score: %s", maxScore, score)
    
    if (score < midScore) {
        
        console.log("Score is bad");
        
        var sm = score / midScore;
        
        if (sm < 1 && sm > 0.5) {
            
            console.log("Score is bad 1");
            console.log(from)
            
            // bad resp
            
            /*
            var resp = [];
            for (var key in Item) {
                if (Item.hasOwnProperty(key)) {
                    
                    if (key.indexOf("_Resp") > -1) {
                        
                        resp.push(key.split("_Resp")[0] + ": '" + Item[key] + "'");
                    }
                }
            }*/
            
            var messsage = "'" + from.Name + "' has provided a negative feedback. Contact: (" + from.Contact + ")";
            console.log(messsage);
            
            // console.log("sending sms: %s, type: %s", messsage, typeof sms);
            
            sms(to, messsage, done);
            
        } else if (sm <= 0.5) {
            
            console.log("Score is bad 2");
            
            var messsage = "'" + from.Name + "' has provided a very dissatisified feedback. Contact: (" + from.Contact + ")";
            
            sms(to, message, done);
        }
    }
    else
        done(null); 
};
