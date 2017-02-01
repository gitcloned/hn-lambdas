const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const formQues = require('../formQuestions/index');

var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'SPPC | Healthnyx Survey Forms',
        link: 'http://sppc.in/'
    }
});

const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.gmailAccount,
        pass: process.env.gmailPassword
    },
});

function sendEmail(to, client, subject, message, done) {
    
    const mailOptions = {
        from: process.env.mailFrom,
        to: to,//process.env[client + "_adminEmailGroup"],
        subject: subject,
        html: message,
    };
    
    console.log({
        from: process.env.mailFrom,
        to: process.env[client + "_adminEmailGroup"],
        subject: subject,
	to: to
    });
    transport.sendMail(mailOptions, function (error) {
        if (error) {
            console.log(error);
        }
        
        return done(null);
    });
};

module.exports.nresp = function (to, maxScore, score, from, form, client, done) {
    
    var midScore = maxScore * 0.6;
    
    if (score < midScore) {
        
        formQues.handle({ FormId: form.FormId, ClientId: client, select: 'detail' }, {}, function (err, questions) {
            
            if (err) questions = [];
        
            var email = {
                body: {
                    name:' ',
                    intro: '"' + from.Name + '" has filled an unsatisfactory response.',
                    table: {
                        data: [],
                        columns: {
                            // Optionally, customize the column widths
                            customWidth: {
                                item: '20%',
                                price: '15%'
                            },
                            // Optionally, change column text alignment
                            customAlignment: {
                                price: 'right'
                            }
                        }
                    },
                    outro: 'Thank You. Patient Contact: ' + from.Contact
                }
            };
            
            for (var key in form) {
                if (form.hasOwnProperty(key)) {
                    
                    if (key.indexOf("_Resp") > -1) {
                        
                        var qid = key.split("_Resp")[0], qt = qid;
                        for (var i=0; i<questions.length; i++) {
                            
                            if (qid === questions[i].question_id) {
                                
                                qt = questions[i].question_title;
                                break;
                            }
                        }
                        
                        email.body.table.data.push({
                            "Question": qt,
                            "Response":  form[key]
                        })
                    }
                }
            }
            
            // Generate an HTML email with the provided contents
            var emailBody = mailGenerator.generate(email);
            
            var sm = score / midScore;
            
            if (sm < 1) {
                
                sendEmail(to, client, 'Patient has filled an unsatisfactory response.', emailBody, done)
            } else done(null);
        });
    }
    else
        done(null); 
};
