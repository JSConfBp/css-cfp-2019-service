const store = require('../../store')

module.exports = async function ({ payload }) {
	console.log(payload);

	return { success: false }
}