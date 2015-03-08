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
    var din = request.params.din;

    // Pad beginning with zeros to 8 characters
    var padding = "00000000";
    din = padding.substring(0, padding.length - din.length) + din;

    this._db.getAtcFromDin(din, function(error, result) {
        var json = {"DIN": din};

        if(error) {
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

module.exports = {Controller: Controller};
