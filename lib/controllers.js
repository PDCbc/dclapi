/**
 * This class defines the functions that will process the HTTP requests
 * to our RESTful API and return the HTTP responses.
 *
 * Requires an interface to the database to be provided as a parameter.
 */
function Controller(db) {
    this._db = db;
}

Controller.prototype.atcbydin = function(request, response) {
    var din = padDIN(request.params.din);

    this._db.getAtcFromDin(din, function(error, result) {
        var json = {"DIN": din};

        if (error) {
            response.status(404);
            json["error"] = error.message;
        } else {
            json["ATC"] = result;
        }

        response.json(json);
    });
};

Controller.prototype.classbyatc = function(request, response) {
    var atc = request.params.atc;

    this._db.getAtcDescription(atc, function(error, result) {
        var json = {"ATC": atc};

        if (error) {
            response.status(404);
            json["error"] = error.message;
        } else {
            json["class"] = result;
        }

        response.json(json);
    });
};

Controller.prototype.classbydin = function(request, response) {
    var din = padDIN(request.params.din);

    var atcLevel = request.query.atcLevel;
    if (typeof atcLevel === "undefined") {
        atcLevel = 2;
    }

    var json = {"DIN": din, "atcLevel": atcLevel};

    // Nested functions will have a different 'this', so have to keep
    // a reference.
    var self = this;

    self._db.getAtcFromDin(din, function(error, result) {
        if (error) {
            response.status(404);
            json["error"] = error.message;
            return response.json(json);
        }

        var atc = trimAtcCode(result, atcLevel);

        self._db.getAtcDescription(atc, function(error, result) {
            if (error) {
                response.status(404);
                json["error"] = error.message;
                return response.json(json);
            }

            json["class"] = result;
            response.json(json);
        });
    });
};

/**
 * Pad the beginning with zeros to 8 characters.
 */
function padDIN(din) {
    var padding = "00000000";
    return padding.substring(0, padding.length - din.length) + din;
}

function trimAtcCode(atcCode, level) {
    if (level < 1 || level > 5) {
        throw new Error("Invalid ATC level: " + level + " (must be 1-5)");
    }

    var endIndex = undefined;

    if (level == 1) {
        endIndex = 1;
    } else if (level == 2) {
        endIndex = 3;
    } else if (level == 3) {
        endIndex = 4;
    } else if (level == 4) {
        endIndex = 5;
    } else if (level == 5) {
        endIndex = 7;
    }

    return atcCode.slice(0, endIndex);
}

exports.Controller = Controller;
exports.padDIN = padDIN;
exports.trimAtcCode = trimAtcCode;
