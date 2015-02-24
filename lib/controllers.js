exports.test = function(request, response) {
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ message: "Hello world" }));
}
