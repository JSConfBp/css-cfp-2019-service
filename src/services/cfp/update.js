const store = require('../../store')

module.exports = async function ({ payload }) {
	console.log(payload);

	const { payload: { year, stage} } = request

	if (year) {
		await store.set('year', year)
	}
	if (stage) {
		await store.set('stage', stage)
	}

	return { success: true }
}