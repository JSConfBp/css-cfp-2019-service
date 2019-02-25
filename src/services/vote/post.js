const store = require('../../store')
const jwt = require('../../auth/token')

module.exports = async function (request) {

	const { payload: vote } = request
	const { token } = request.auth.credentials
	const payload = await jwt.decode(token)
	const { login } = payload

	const key = `votes-${login}`

	await store.rpush(key, JSON.stringify(vote))

	return { success: true }
}