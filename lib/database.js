var sqlite3 = require("sqlite3");

/**
 * Contructs an object which provides an interface for
 * querying the SQLite database.
 *
 * @param dbname A string specifying the name of the database.
 */
function SQLiteInterface(dbname) {
    this._db = new sqlite3.Database(dbname);

    this._dinFromAtcStatement = this._db.prepare(
        "SELECT DP.drug_identification_number as din " +
        "FROM cd_drug_product as DP JOIN cd_therapeutic_class as TC " +
        "ON DP.drug_code=TC.drug_code " +
        "WHERE TC.tc_atc_number=?"
    );

    this._atcDescriptionStatement = this._db.prepare(
        "SELECT description from AtcDescription WHERE atc=?"
    );
}

/**
 * Each drug has both an ATC (Anatomical Therapeutical Chemical) code
 * and a DIN (drug identification number).
 * This function takes a drug's ATC code as input and returns the drug's DIN.
 *
 * @param atcCode A string representing the drug's ATC code.
 * @param callback Invoked when the lookup has succeeded or failed.
 *  Upon success, callback is invoked as callback(null, din).  Upon
 *  failure, callback is invoked as callback(error, null) instead.
 */
SQLiteInterface.prototype.getDinFromAtc = function(atcCode, callback) {
    this._dinFromAtcStatement.get(atcCode, function(error, row) {
        if (error) {
            callback(error, null);
        } else if (!row || !("din" in row)) {
            callback(new Error("ATC code not recognized"), null);
        } else {
            callback(null, row.din);
        }
    });
};

/**
 * Looks up the description for the provided ATC code.
 *
 * @param atcCode A string representing the drug's ATC code.
 * @param callback Invoked when the lookup has succeeded or failed.
 *  Upon success, callback is invoked as callback(null, description).  Upon
 *  failure, callback is invoked as callback(error, null) instead.
 */
SQLiteInterface.prototype.getAtcDescription = function(atcCode, callback) {
    this._atcDescriptionStatement.get(atcCode, function(error, row) {
        if (error) {
            callback(error, null);
        } else if (!row || !("description" in row)) {
            callback(new Error("ATC code not recognized"), null);
        } else {
            callback(null, row.description);
        }
    });
};

module.exports = {SQLiteInterface: SQLiteInterface};
