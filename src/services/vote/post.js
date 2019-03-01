const store = require('../../store')
const getLoginName = require('../../auth/loginName')

module.exports = async function (request) {

	const { payload: vote } = request
	const login = await getLoginName(request)
	const key = `votes-${login}`

	await store.rpush(key, JSON.stringify(vote))

	return { success: true }
}