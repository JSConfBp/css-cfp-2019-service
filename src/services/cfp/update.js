const store = require('../../store')

module.exports = async function (request) {
	const { payload: { year, stage } } = request

	if (year) {
		await store.set('year', year)
	}
	if (stage) {
		await store.set('stage', stage)
	}

	return { stage, year }
}