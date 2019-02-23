const validator = require('../../../validator')
const { create } = require('../../../services/cfp')
const ClientCreatedResponse = require('../../responses/CfpCreated')

module.exports = {
	method: 'POST',
	path: '/cfp',
	options: {
		auth: 'admin',
		payload: {
			allow: 'text/csv'
		},
		/*validate: {
			payload: validator([
				validator.json('request/CreateClient')
			])
		}
		*/
	},
	handler: async (request, h) => {
		const data = await create(request)
		return ClientCreatedResponse(data)
	}
}