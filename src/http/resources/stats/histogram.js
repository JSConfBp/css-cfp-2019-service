const { histogram } = require('../../../services/stats')
const StatsReadResponse = require('../../responses/StatsRead')

module.exports = {
	method: 'GET',
	path: '/histogram',
	options: {
		auth: 'jwt',
	},
	handler: async (request, h) => {
		const data = await histogram(request)
		return data
	}
}