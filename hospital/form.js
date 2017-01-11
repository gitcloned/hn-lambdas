
var Form = module.exports = function (name) {
    
    this.info = require("./res/forms/" + name)();
};

Form.prototype.questions = function (params) {
    return this.info.form.questions;
};

Form.prototype.dynamoDBSelectClauses = function (params) {
    
    var clause = [], questions = this.questions();
    
    for (var i=0; i<questions.length; i++) {
        
        clause.push(questions[i]["question_id"] + "_Score");
        clause.push(questions[i]["question_id"] + "_Resp");
    };
    
    return clause;
};