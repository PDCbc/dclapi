/**
 * This module is the entry-point for running the web service.
 */

var config = require("./config");
var database = require("./lib/database");
var server = require("./lib/server");

var db = new database.SQLiteInterface(config.db.sqlite);

var webService = new server.ExpressServer(db);
webService.start(config.server.port);
