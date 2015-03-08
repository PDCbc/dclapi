/**
 * This module is the entry-point for running the web service.
 */

var config = require("./config");
var database = require("./lib/database");
var server = require("./lib/server");

var db = database.SQLiteInterface(config.db.sqlite);

server.start(config.server.port, db);
