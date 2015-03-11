var assert = require("assert");
var sinon = require("sinon");
var request = require("supertest");

var database = require("../lib/database");
var server = require("../lib/server");

describe("Server", function() {
    describe("GET /classbyatc/", function() {
        var db;
        var webService;

        beforeEach(function() {
            db = sinon.createStubInstance(database.SQLiteInterface);
            webService = new server.ExpressServer(db);
        });

        it("should return JSON containing description for a known ATC code", function(done) {
            db.getAtcDescription = function(atcCode, callback) {
                if (atcCode === "A") {
                    callback(null, "ALIMENTARY TRACT AND METABOLISM");
                }
            };

            request(webService.expressApp).get("/classbyatc/A")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
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

        it("should return 404 and error message for an unknown ATC code", function(done) {
            var errorMessage = "ATC code not recognized";
            db.getAtcDescription = function(atc, callback) {
                callback(new Error(errorMessage), null);
            };

            request(webService.expressApp).get("/classbyatc/NOTRECOG")
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(error, response) {
                    if (error) {
                        throw error;
                    }

                    assert.deepEqual(
                        JSON.parse(response.text),
                        {ATC: "NOTRECOG", error: errorMessage}
                    );

                    done();
                });
        });
    });

    describe("GET /atcbydin/", function() {
        var db;
        var webService;

        beforeEach(function() {
            db = sinon.createStubInstance(database.SQLiteInterface);
            webService = new server.ExpressServer(db);
        });

        it("should pad DIN and return ATC for known DIN", function(done) {
            db.getAtcFromDin = function(din, callback) {
                if (din === "02229377") {
                    callback(null, "D08AC02");
                }
            };

            request(webService.expressApp).get("/atcbydin/2229377")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(error, response) {
                    if (error) {
                        throw error;
                    }

                    assert.deepEqual(
                        JSON.parse(response.text),
                        {DIN: "02229377", ATC: "D08AC02"}
                    );

                    done();
                });
        });

        it("should return 404 and error message for an unknown DIN", function(done) {
            var errorMessage = "DIN not recognized";
            db.getAtcFromDin = function(din, callback) {
                callback(new Error(errorMessage), null);
            };

            request(webService.expressApp).get("/atcbydin/123")
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(error, response) {
                    if (error) {
                        throw error;
                    }

                    assert.deepEqual(
                        JSON.parse(response.text),
                        {DIN: "00000123", error: errorMessage}
                    );

                    done();
                });
        });
    });

    describe("GET /classbydin/", function() {
        var db;
        var webService;

        beforeEach(function() {
            db = sinon.createStubInstance(database.SQLiteInterface);
            webService = new server.ExpressServer(db);
        });

        it("should return JSON containing level 2 description for known DIN with known ATC", function(done) {
            db.getAtcFromDin = function(din, callback) {
                if (din === "02229377") {
                    callback(null, "D08AC02");
                }
            };

            db.getAtcDescription = function(atcCode, callback) {
                if (atcCode === "D08") {
                    callback(null, "ANTISEPTICS AND DISINFECTANTS");
                }
            };

            request(webService.expressApp).get("/classbydin/2229377")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(error, response) {
                    if (error) {
                        throw error;
                    }

                    assert.deepEqual(
                        JSON.parse(response.text),
                        {DIN: "02229377", atcLevel: 2, class: "ANTISEPTICS AND DISINFECTANTS"}
                    );

                    done();
                });
        });

        it("should return 404 and error message for unknown DIN", function(done) {
            db.getAtcFromDin = function(din, callback) {
                if (din === "02229377") {
                    callback(null, "D08AC02");
                } else {
                    callback(new Error("DIN not recognized"));
                }
            };

            db.getAtcDescription = function(atcCode, callback) {
                if (atcCode === "D08") {
                    callback(null, "ANTISEPTICS AND DISINFECTANTS");
                }
            };

            request(webService.expressApp).get("/classbydin/12345678")
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(error, response) {
                    if (error) {
                        throw error;
                    }

                    assert.deepEqual(
                        JSON.parse(response.text),
                        {DIN: "12345678", atcLevel: 2, error: "DIN not recognized"}
                    );

                    done();
                });
        });

        it("should return 404 and error message for unknown ATC", function(done) {
            db.getAtcFromDin = function(din, callback) {
                if (din === "02229377") {
                    callback(null, "A01AB01");
                } else {
                    callback(new Error("DIN not recognized"));
                }
            };

            db.getAtcDescription = function(atcCode, callback) {
                if (atcCode === "D08") {
                    callback(null, "ANTISEPTICS AND DISINFECTANTS");
                } else {
                    callback(new Error("ATC code not recognized"));
                }
            };

            request(webService.expressApp).get("/classbydin/2229377")
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(error, response) {
                    if (error) {
                        throw error;
                    }

                    assert.deepEqual(
                        JSON.parse(response.text),
                        {DIN: "02229377", atcLevel: 2, error: "ATC code not recognized"}
                    );

                    done();
                });
        });

        it("should allow the atc level to be set in the querystring", function(done) {
            db.getAtcFromDin = function(din, callback) {
                if (din === "02229377") {
                    callback(null, "D08AC02");
                } else {
                    callback(new Error("DIN not recognized"));
                }
            };

            db.getAtcDescription = function(atcCode, callback) {
                if (atcCode === "D") {
                    callback(null, "DERMATOLOGICALS");
                } else {
                    callback(new Error("ATC code not recognized"));
                }
            };

            request(webService.expressApp).get("/classbydin/2229377?atcLevel=1")
                .expect(200)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(error, response) {
                    if (error) {
                        throw error;
                    }

                    assert.deepEqual(
                        JSON.parse(response.text),
                        {DIN: "02229377", atcLevel: 1, class: "DERMATOLOGICALS"}
                    );

                    done();
                });
        });
    });

    describe("GET /classbyfddb/", function() {
        var db;
        var webService;

        beforeEach(function() {
            db = sinon.createStubInstance(database.SQLiteInterface);
            webService = new server.ExpressServer(db);
        });

        it("should return not implemented error", function(done) {
            request(webService.expressApp).get("/classbyfddb/1234")
                .expect(404)
                .expect("Content-Type", "application/json; charset=utf-8")
                .end(function(error, response) {
                    if (error) {
                        throw error;
                    }

                    assert.deepEqual(
                        JSON.parse(response.text),
                        {FDDB: "1234", error: "Service not yet implemented."}
                    );

                    done();
                });
        });
    });
});
