var assert = require("assert");
var request = require("supertest");

var server = require("../lib/server");

describe("Controllers", function() {
    server.setup(null);
    request = request(server.app);

    describe("GET /test", function() {
        it("should return Hello World in JSON", function(done) {
            request.get("/test")
                .expect("Content-Type", "application/json")
                .end(function(error, response) {
                    if (error) {
                        throw error;
                    }

                    assert.deepEqual(JSON.parse(response.text), {message: "Hello world"});
                    done();
                });
        });
    });
});
