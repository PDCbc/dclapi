var assert = require("assert");

var controllers = require("../lib/controllers");

describe("controllers", function() {
    describe("padDIN", function() {
        it("should left pad to 8 characters (using zeros)", function() {
            assert.strictEqual("01234567", controllers.padDIN("1234567"));
        });

        it("should do nothing to a din which is already 8 characters", function() {
            assert.strictEqual("12345678", controllers.padDIN("12345678"));
        });

        it("should pad short dins", function() {
            assert.strictEqual("00001234", controllers.padDIN("1234"));
        });
    });

    describe("trimAtcCode", function() {
        var atc;

        beforeEach(function() {
            atc = "D08AC02";
        });

        it("should return just the first letter for level 1", function() {
            assert.strictEqual("D", controllers.trimAtcCode(atc, 1));
        });

        it("should return the first 3 characters for level 2", function() {
            assert.strictEqual("D08", controllers.trimAtcCode(atc, 2));
        });

        it("should return the first 4 characters for level 3", function() {
            assert.strictEqual("D08A", controllers.trimAtcCode(atc, 3));
        });

        it("should return the first 5 characters for level 4", function() {
            assert.strictEqual("D08AC", controllers.trimAtcCode(atc, 4));
        });

        it("should return all 7 characters for level 5", function() {
            assert.strictEqual("D08AC02", controllers.trimAtcCode(atc, 5));
        });

        it("should throw an error if the level is not between 1 and 5", function() {
            assert.throws(function() { controllers.trimAtcCode(atc, 0); }, Error);
            assert.throws(function() { controllers.trimAtcCode(atc, 6); }, Error);
        });
    });
});
