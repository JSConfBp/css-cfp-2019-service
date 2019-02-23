exports.register = async function (server, options) {
	server.route(require('./create'))
	//server.route(require('./read'))

}

exports.name = 'http-resource-cfp'
