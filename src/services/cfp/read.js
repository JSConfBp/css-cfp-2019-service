const store = require('../../store')

module.exports = async function () {
	const year = await store.get('year')
	const count = await store.llen('talks')
	const stage = await store.get('stage')

	return { year, count, stage }
}