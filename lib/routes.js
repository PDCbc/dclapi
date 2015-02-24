var express = require("express");
var controllers = require("./controllers");

var router = express.Router();
router.get("/test", controllers.test);

exports.router = router;
