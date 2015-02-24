var assert = require("assert");
var express = require("express");
var request = require("supertest");

var routes = require("../lib/routes");

describe("Controllers", function() {
    var app = express();
    app.use(routes.router);
    request = request(app);

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
