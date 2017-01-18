
const uuidV1 = require('uuid/v1');

var Form = module.exports = function (params) {
    
    if (params && typeof params === "object") {
        
        this.FormId = params.Id || params.FormId || uuidV1();
        this.ClientId = params.ClientId;
        this.Name = params.Name;
        this.Desc = typeof params.Desc === "string" ? params.Desc : null;
        this.FType = params.FType || "Active";
        this.Password = params.Password || null;
        this.form = params.form;
    }
}

Form.prototype.isInvalid = function () {
    
    if (!this.FormId) return "Does not have Form Id";
    if (!this.ClientId) return "Does not have Client Id";
    if (!this.Name) return "Does not have mandatory attribute 'Name'";
    if (!this.form) return "Does not have mandatory attribute 'form'";
    
    return false;
}

Form.prototype.isInvalidInstance = function () {
    
    if (!this.FormId) return "Does not have Form Id";
    if (!this.ClientId) return "Does not have Client Id";
    
    return false;
}

Form.prototype.item = function (removeEmpty) {
    
    var Item = {}, cnt = 1;
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            
            if (removeEmpty && (typeof this[key] === "undefined" || this[key] === null || this[key] === "")) continue;
            Item[key] = this[key]
            // console.log(key)
            // if (cnt++ > 3) break;
        }
    }
    
    return Item;
}