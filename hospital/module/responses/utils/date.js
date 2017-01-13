
var moment = require('moment').utc;

var to2Digit = function (num) {

    num = parseInt(num);
    return (num.toString().length > 2 ? "0" : "") + num;
}

var D = function D(date) {

    this.date = date;
}


D.prototype.getYTD = function () {

    return {
        $gte: new Date("01/01/" + this.date.getFullYear()),
        $lte: this.date
    };
}

D.prototype.getQTD = function () {

    return {
        $gte: new Date(Math.floor(this.date.getMonth() / 3) + 1 + "/01/" + this.date.getFullYear()),
        $lte: this.date
    };
}

D.prototype.getMTD = function () {

    return {
        $gte: new Date(this.date.getMonth() + 1 + "/01/" + this.date.getFullYear()),
        $lte: this.date
    };
}

D.prototype.getRange = function (range, num) {

    var start = moment(this.date);

    switch (range) {

        case "y":
            start = start.subtract(num, "years");
            break;
        case "q":
            start = start.subtract(num, "quarters");
            break;
        case "m":
            start = start.subtract(num, "months");
            break;
        case "d":
            start = start.subtract(num, "days");
            break;
    }

    return {
        $gte: start.toDate(),
        $lte: this.date
    };
}

D.prototype.getMOM = function () {

    var m = this.date.getMonth() + 1, dates = [];

    for (var i = 0; i < m; i++) {

        dates.push(
            moment(new Date(to2Digit(i + 2) + "/01/" + this.date.getFullYear())).subtract(1, "d").toDate());
    }

    return {
        $in: dates
    };
}

D.prototype.get = function (period) {

    // console.log(" geting date for period; %s", period);

    period = period ? period : "";
    period = period.toLowerCase();

    switch (period) {

        case "ytd":
            return this.getYTD();
        case "mtd":
            return this.getMTD();
        case "qtd":
            return this.getQTD();
    }

    var num = parseInt(period);

    // console.log(" geting date for period, num; %s", num);

    if (!isNaN(num)) {

        var type = period.replace(num.toString(), "");
        switch (type) {

            case "m":
            case "q":
            case "d":
            case "y":
                return this.getRange(type, num);
        }
    };

    switch (period) {

        case "mom":
            return this.getMOM();
        case "qoq":
            return this.getQOQ();
    }

    // console.log(" returning date");

    return this.date;
}

module.exports = D;