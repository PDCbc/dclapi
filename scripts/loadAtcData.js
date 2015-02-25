/**
 *  Loads ATC codes and their descriptions from a '|' separated file
 *  into an SQLite database.
 *
 *  The input file should have 2 columns with no headers. The first
 *  column should be the ATC code, and the second should be the
 *  description.
 *
 *  Usage:
 *    nodejs loadAtcData.js <inputFilename> <databaseName>
 *
 *  Note that the database will be created if it does not exist.
 */

var fs = require("fs");
var sqlite3 = require("sqlite3");

var SEPARATOR = "|";

/**
 * Returns an array of the arguments passed on the command line to this script.
 */
function getScriptArgs() {
    var scriptArgs = process.argv.slice(2);

    if (scriptArgs.length != 2) {
        console.error("Usage: nodejs loadAtcData.js <inputFilename> <databaseName>");
        process.exit(1);
    }

    return scriptArgs;
}

/**
 * Defines the ATC description table but does not populate it with data
 * yet.  The database will be created if it does not exist.
 * If the table already exists it will be dropped and recreated.
 *
 * Returns a handle to the database.
 */
function createAtcDescriptionTable(databaseName) {
    var db = new sqlite3.Database(databaseName);
    db.serialize();

    db.run("DROP TABLE IF EXISTS AtcDescription");

    // Note: under the hood SQLite only has one text type field.
    // So trying to specify types like char(n) is pointless and
    // misleading because the size constraints would not actually
    // be enforced.
    db.run("CREATE TABLE AtcDescription (atc TEXT, description TEXT)");

    return db;
}

/**
 * Processes a raw array of lines and inserts them into the database.
 */
function writeLinesToDatabase(lines, db) {
    // Need database inserts to be executed serially to avoid writes after
    // the database handle has been closed.
    // NOTE: sqlite3 library requires statements to be run directly in the
    // callback for serialize, not nested in another function call.
    db.serialize(function() {
        // Using a transaction VASTLY speeds up this bulk insert.
        db.run("begin transaction");

        for (var i = 0; i < lines.length; i++) {
            var row = lines[i].split(SEPARATOR);

            if (row.length === 2) {
                db.run("INSERT INTO AtcDescription VALUES(?, ?)", row);
            }
        }

        db.run("commit");
    });
}

/**
 * The script's main method of execution.
 */
function main() {
    var scriptArgs = getScriptArgs();

    var db = createAtcDescriptionTable(scriptArgs[1]);

    fs.readFile(scriptArgs[0], {encoding: "utf-8"}, function(error, data) {
        if (error) {
            console.error("Could not open file: %s", error);
            process.exit(1);
        }

        var lines = data.split("\n");

        writeLinesToDatabase(lines, db);

        db.close();
    });
}

main();
