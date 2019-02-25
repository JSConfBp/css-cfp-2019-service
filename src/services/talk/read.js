const store = require('../../store')
const jwt = require('../../auth/token')

const FIELDS = JSON.parse(process.env.CFP_VOTE_FIELDS || "[]")

module.exports = async function (request) {

	const { token } = request.auth.credentials
	const payload = await jwt.decode(token)
	const { login } = payload

	const key = `votes-${login}`
	const nextIndex = await store.llen(key)
	const total = await store.llen('talks')

	const data = {
		fields: {},
		completed: false
	}

	if (nextIndex > total) {
		data.completed = true
		return data
	}

	const nextId = await store.lindex('talks', nextIndex)
	const nextTalk = await store.hgetall(nextId)

	data.id = nextId
	data.fields = FIELDS.reduce((obj, field) => {
		obj[field] = nextTalk[field]
		return obj
	}, {})

	return data
}