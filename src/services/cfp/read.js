const store = require('../../store')

module.exports = async function () {
	const year = await store.get('year')
	const stage = await store.get('stage')
	const count = await store.llen(`talks_${stage}`)

	return { year, count, stage }
}