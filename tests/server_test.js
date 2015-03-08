var assert = require("assert");
var sinon = require("sinon");
var request = require("supertest");

var database = require("../lib/database");
var server = require("../lib/server");

describe("Server", function() {
    describe("GET /classbyatc/", function() {
        var db;

        beforeEach(function() {
            db = sinon.createStubInstance(database.SQLiteInterface);
            server.setup(db);
        });

        it("should return JSON containing description for a known ATC code", function(done) {
            db.getAtcDescription = function(atcCode, callback) {
                if (atcCode === "A") {
                    callback(null, "ALIMENTARY TRACT AND METABOLISM");
                }
            };

            request(server.app).get("/classbyatc/A")
                .expect("Content-Type", "application/json")
                .end(function(error, response) {
                    if (error) {
                        throw error;
                    }

                    assert.deepEqual(
                        JSON.parse(response.text),
                        {ATC: "A", class: "ALIMENTARY TRACT AND METABOLISM"}
                    );

                    done();
                });
        });
    });
});
