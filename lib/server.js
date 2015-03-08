/**
 * This module puts together the different pieces of the app and
 * starts up the server.
 */

var express = require("express");
var controllers = require("./controllers");
var database = require("./database");
var logger = require("./logger");
var routes = require("./routes");

var app = express();

/**
 * Starts up the Express server.
 *
 * @param port An integer specifying the port for the server to listen on.
 * @param db: A database interface object (lib/database.js).
 */
function start(port, db) {
    setup(db);

    app.listen(port);

    logger.info("Express server listening on port " + port +
    " in " + app.settings.env + " mode.");
}

/**
 * Sets up the Express app but doesn't run the server.
 * Calling this directly is mostly just useful for testing.
 */
function setup(db) {
    var controller = new controllers.Controller(db);
    routes.setup(app, controller);
}

exports.start = start;
exports.setup = setup;
exports.app = app;
