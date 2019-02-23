const { update } = require('../../../services/client')
const ClientUpdatedResponse = require('../../responses/ClientUpdated')

module.exports = {
	method: 'PUT',
	path: '/client/{id}',
	options: {
		auth: 'jwt',
		payload: {
			allow: 'application/json'
		},
		/*validate: {
			payload: validator([
				validator.json('request/CreateClient')
			])
		}
		*/
	},
	handler: async (request, h) => {
		const data = await update(request)
		return ClientUpdatedResponse(data)
	}
}