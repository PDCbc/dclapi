var express = require("express");
var routes = require("./lib/routes");

var app = express();
app.use(routes.router);

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});
