const validator = require('../../../validator')
const { update } = require('../../../services/cfp')
const CfpUpdateResponse = require('../../responses/CfpUpdate')

module.exports = {
	method: 'PUT',
	path: '/cfp',
	options: {
		auth: 'jwt',
		payload: {
			allow: 'application/json'
		},
	},
	handler: async (request, h) => {
		const data = await update(request)
		return CfpUpdateResponse(data)
	}
}