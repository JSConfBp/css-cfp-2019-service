const { read } = require('../../../services/download')
const TalkReadResponse = require('../../responses/TalkRead')

module.exports = {
	method: 'GET',
	path: '/download',
	options: {
		auth: 'admin',
	},
	handler: async (request, h) => {
		const data = await read(request)

		return h.response(data)
        	.type('text/csv')
	}
}