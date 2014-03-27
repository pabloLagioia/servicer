var logger = require("../Logger.js"),
    PARAMS_TYPE = ["params", "body", "query"];

/**
 * Maps an url to function. Once the request is received the function gets executed async and returns 
 * the desired data. Data is sent as json by default.
 *
 * @param {Object} app the express application object
 * @param {Object} mapping an object containing the data to map the url to a given handler function
 */
function createMapping(app, mapping) {

	var method = mapping.method || "get"; //default HTTP method is GET;

	if ( !mapping.handler ) {
		logger.error("Could not create service " + mapping.path + ". Handler is not defined");
		return;
	}
	if ( !mapping.path ) {
		logger.error("Could not create service. Path is not defined ");
		return;
	}

	if ( app[method] ) {
	
		app[method](mapping.path, function(req, res) {

			var arr = [], //Array that will hold request parameters for the service
                i,
                j;

            if ( mapping.params ) {

                for ( i in PARAMS_TYPE ) {

                    for ( j in mappings.params[PARAMS_TYPE[i]] ) {
//                        Add parameters present in the request to the array
                        arr.push(req[PARAMS_TYPE[i]][mappings.params[PARAMS_TYPE[i]][j]]);
                    }

                }

            }

			try {

				/**
				 * Add the async callback
				 *
				 * @param {Object} result a return object given by the service. This object will be stringified by default
				 * @type {String} type content type. Defaults to application/json
				 *
				 */
				arr.push(function(result, type) {

					if ( type ) {

						res.header("Content-type", type);
						res.send(result);
						logger.info("returning resource as " + type);

					} else {

						res.json(result);
						logger.info("returning resource as json");
					}

				}, function(code, description) {
                    res.send(code, description);
                    res.end();
                });

				//Call service handler with the array of parameters
				mapping.handler.apply(null, arr);

			} catch (e) {

				res.send("ERROR " + e);

			}

		});

		logger.info(method + ":" + mapping.path + " is up");

	} else {
		throw new Error("Method " + method + " does not exist");
	}

}

module.exports = function(app) {

	return {

		/**
		 * @method create
		 * @param {Object} mappings Comma-separated objects that represent a mapping of a URL to a service handler
		 */
		create: function() {

			var i, mapping;

			for ( i in arguments ) {

				createMapping(app, arguments[i]);

			}

		}

	}

}