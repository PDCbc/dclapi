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
});
