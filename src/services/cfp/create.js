const uuid = require('uuid/v4')

const { promisify } = require('util')
const store = require('../../store')


module.exports = async function ({ headers, payload }) {

	const year = headers['x-cfp-year']

	console.log(year, payload);

	return { year }
}