const token = require('../../../auth/token')
const tokenService = require('../../../services/token')
const responses = require('../../responses')
const TokenCreatedResponse = require('../../responses/TokenCreated')
const moment = require('moment')

module.exports = {
  method: 'POST',
  path: '/token',
  options: {
	  	auth: false,
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
		return TokenCreatedResponse(tokenService.create(request))
  	}
}
