/**
 * This class defines the functions that will process the HTTP requests
 * to our RESTful API and return the HTTP responses.
 *
 * Requires an interface to the database to be provided as a parameter.
 */
function Controller(db) {
    this._db = db;
}

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
