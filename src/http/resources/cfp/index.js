exports.register = async function (server, options) {
	server.route(require('./create'))
	server.route(require('./read'))
	server.route(require('./update'))
	server.route(require('./remove'))
}

exports.name = 'http-resource-cfp'
