const store = require('../../store')

module.exports = async function () {
	const year = await store.get('year')
	const count = await store.llen('talks')

	return { year, count }
}