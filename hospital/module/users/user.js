
const uuidV1 = require('uuid/v1');
const moment = require('moment');

var User = module.exports = function (params) {
    
    if (params && typeof params === "object") {
        
        this.Id = params.Id || uuidV1();
        this.ClientId = params.ClientId;
        this.FirstName = params.FirstName;
        this.LastName = typeof params.LastName === "string" ? params.LastName : null;
        this.Age = typeof params.Age === "number" ? params.Age : -1;
        this.Gender = ["Male", "Female"].indexOf(params.Gender) > -1 ? params.Gender : "NA";
        this.Email = typeof params.Email === "string" ? params.Email : null;
        this.Contact = params.Contact;
        this.Created = params.Created || moment.utc().toDate();
        this.UType = params.UType || "User";
        this.Name = params.Name || [this.FirstName, this.LastName || " "].join(" ");
    }
}

User.prototype.isInvalid = function () {
    
    if (!this.Id) return "Does not have User Id";
    if (!this.ClientId) return "Does not have Client Id";
    if (!this.FirstName) return "Does not have mandatory attribute 'FirstName'";
    if (!this.Contact) return "Does not have mandatory attribute 'Contact'";
    
    return false;
}

User.prototype.item = function (params) {
    
    var Item = {}, cnt = 1;
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            Item[key] = this[key]
            // console.log(key)
            // if (cnt++ > 3) break;
        }
    }
    
    return Item;
}