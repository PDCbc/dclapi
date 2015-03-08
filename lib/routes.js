/**
 * Maps URLs to the controller functions that handle them.
 * The controller must be provided as a parameter.
 *
 * @param app The Express app object.
 * @param controller The object implementing the responses.
 */
function setup(app, controller) {
    app.get("/atcbydin/:din", function(request, response) {
        controller.atcbydin(request, response);
    });

    app.get("/classbyatc/:atc", function(request, response) {
        controller.classbyatc(request, response);
    });
}

exports.setup = setup;
