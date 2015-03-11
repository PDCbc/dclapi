var assert = require("assert");

var database = require("../lib/database");

describe("SQLiteInterface", function() {
    describe("#getAtcFromDin", function() {
        var underTest;

        beforeEach(function() {
            underTest = new database.SQLiteInterface("tests/test.sqlite");
        });

        it("should return the corresponding ATC code for a DIN", function(done) {
            underTest.getAtcFromDin("02229377", function(error, result) {
                assert.strictEqual(null, error);
                assert.strictEqual("D08AC02", result);
                done();
            });
        });

        it("should throw an error if the DIN is not recognized", function(done) {
            underTest.getAtcFromDin("NOTRECOG", function(error, result) {
                assert.strictEqual("DIN not recognized: NOTRECOG", error.message);
                assert.strictEqual(null, result);
                done();
            });
        });
    });

    describe("#getAtcDescription", function() {
        var underTest;

        beforeEach(function() {
            underTest = new database.SQLiteInterface("tests/test.sqlite");
        });

        it("should return the description for a known ATC code", function(done) {
            underTest.getAtcDescription("A", function(error, result) {
                assert.strictEqual(null, error);
                assert.strictEqual("ALIMENTARY TRACT AND METABOLISM", result);
                done();
            });
        });

        it("should throw an error if the ATC code is not recognized", function(done) {
            underTest.getAtcDescription("ABCDEFGHIKL", function(error, result) {
                assert.strictEqual("ATC code not recognized: ABCDEFGHIKL", error.message);
                assert.strictEqual(null, result);
                done();
            });
        });
    });
});
