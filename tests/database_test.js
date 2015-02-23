var assert = require("assert");

var database = require("../lib/database");

describe("SQLiteInterface", function() {
    var underTest;

    beforeEach(function() {
        underTest = new database.SQLiteInterface("tests/atc_din.sqlite");
    });

    describe("#getDinFromAtc", function() {
        it("should return the corresponding ATC code for a DIN", function() {
            underTest.getDinFromAtc("D08AC02", function(error, result) {
                assert.strictEqual(null, error);
                assert.strictEqual("02229377", result);
            });
        });

        it("should throw an error if the ATC code is not recognized", function() {
            underTest.getDinFromAtc("NOTRECOG", function(error, result) {
                assert.strictEqual("ATC code not recognized", error.message);
                assert.strictEqual(null, result);
            });
        });
    });
});
