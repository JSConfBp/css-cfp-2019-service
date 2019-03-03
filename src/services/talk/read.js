const store = require('../../store')
const jwt = require('../../auth/token')

const cfpConfig = require('../../../cfp.config')
const FIELDS = cfpConfig.cfp_fields || []

module.exports = async function (request) {

	const { token } = request.auth.credentials
	const payload = await jwt.decode(token)
	const { login } = payload

	const stage = await store.get('stage')

	const key = `votes-${login}`
	const nextIndex = await store.llen(key)

	let total

	if (stage === 'stage_1') {
		total = await store.llen('talks_stage_1')
	} else if (stage === 'stage_2') {
		total = await store.llen('talks_stage_2')
	}

	const data = {
		fields: {},
		completed: false
	}

	if (nextIndex > total) {
		data.completed = true
		return data
	}

	let nextId

	if (stage === 'stage_1') {
		nextId = await store.lindex('talks_stage_1', nextIndex)
	} else if (stage === 'stage_2') {
		nextId = await store.lindex('talks_stage_2', nextIndex)
	}

	const nextTalk = await store.hgetall(nextId)

	data.id = nextId
	data.fields = FIELDS.reduce((obj, field) => {
		obj[field] = nextTalk[field]
		return obj
	}, {})

	return data
}