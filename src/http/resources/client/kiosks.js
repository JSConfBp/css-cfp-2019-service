const Boom = require('boom')
const { kiosks } = require('../../../services/client')
const ClientKiosksResponse = require('../../responses/ClientKiosks')

module.exports = {
	method: 'GET',
	path: '/client/{id}/kiosks',
	options: {
		auth: 'jwt',
		/*validate: {
			payload: validator([
				validator.json('request/CreateClient')
			])
		}
		*/
	},
	handler: async (request, h) => {
		const data = await kiosks(request)

		if (!data) {
			throw Boom.notFound()
		}

		return ClientKiosksResponse(data)
	}
}