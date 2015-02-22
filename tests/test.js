var assert = require("assert");

var math_wrapper = require("../math_wrapper");

describe("math_wrapper", function() {
    describe("#sqrt", function() {
        it("should return 2 as the square root of 4", function() {
            assert.equal(2, math_wrapper.sqrt(4));
        });
    });
});
