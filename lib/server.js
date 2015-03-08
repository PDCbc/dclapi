/**
 * This module puts together the different pieces of the app and
 * starts up the server.
 */

var express = require("express");

var controllers = require("./controllers");
var logger = require("./logger");
var routes = require("./routes");

/**
 * Sets up the Express server, but doesn't run it.
 *
 * @param db A database interface object (lib/database.js).
 */
function ExpressServer(db) {
    this.expressApp = express();

    var controller = new controllers.Controller(db);
    routes.setup(this.expressApp, controller);
}

/**
 * Starts up the express server.
 *
 * @param port An integer specifying the port for the server to listen on.
 */
ExpressServer.prototype.start = function(port) {
    this.expressApp.listen(port);

    logger.info("Express server listening on port " + port +
        " in " + this.expressApp.settings.env + " mode.");
};

exports.ExpressServer = ExpressServer;
