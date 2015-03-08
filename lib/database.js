var sqlite3 = require("sqlite3");

/**
 * Contructs an object which provides an interface for
 * querying the SQLite database.
 *
 * @param dbname A string specifying the name of the database.
 */
function SQLiteInterface(dbname) {
    this._db = new sqlite3.Database(dbname);

    this._atcFromDinStatement = this._db.prepare(
        "SELECT TC.tc_atc_number as atc " +
        "FROM cd_drug_product as DP JOIN cd_therapeutic_class as TC " +
        "ON DP.drug_code=TC.drug_code " +
        "WHERE DP.drug_identification_number=?"
    );

    this._atcDescriptionStatement = this._db.prepare(
        "SELECT description from AtcDescription WHERE atc=?"
    );
}

/**
 * Each drug has both an ATC (Anatomical Therapeutical Chemical) code
 * and a DIN (drug identification number).
 * This function takes a drug's DIN as input and returns the ATC code.
 *
 * @param din A string representing the drug's DIN.
 * @param callback Invoked when the lookup has succeeded or failed.
 *  Upon success, callback is invoked as callback(null, atc).  Upon
 *  failure, callback is invoked as callback(error, null) instead.
 */
SQLiteInterface.prototype.getAtcFromDin = function(din, callback) {
    this._atcFromDinStatement.get(din, function(error, row) {
        if (error) {
            callback(error, null);
        } else if (!row || !("atc" in row)) {
            callback(new Error("DIN not recognized"), null);
        } else {
            callback(null, row.atc);
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
