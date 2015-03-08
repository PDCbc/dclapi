/**
 * This class defines the functions that will process the HTTP requests
 * to our RESTful API and return the HTTP responses.
 *
 * Requires an interface to the database to be provided as a parameter.
 */
function Controller(db) {
    this._db = db;
}

function respondWithJSON(response, json) {
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(json));
}

Controller.prototype.test = function(request, response) {
    respondWithJSON(response, {message: "Hello world"});
};

Controller.prototype.classbyatc = function(request, response) {
    var atc = request.params.atc;

    this._db.getAtcDescription(atc, function(error, result) {
        if (error) {
            // TODO: error code, better error message
            respondWithJSON(response, {"Error": "No description found"});
        } else {
            respondWithJSON(response, {"ATC": atc, "class": result});
        }
    });
};

module.exports = {Controller: Controller};
