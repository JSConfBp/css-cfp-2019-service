const store = require('../../store')
const getLoginName = require('../../auth/loginName')

module.exports = async function (request) {

	const { payload: vote } = request
	const login = await getLoginName(request)
	const stage = await store.get('stage')

	const key = `votes-${stage}-${login}`

	await store.rpush(key, JSON.stringify(vote))

	return { success: true }
}