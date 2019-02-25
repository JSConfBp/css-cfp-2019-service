const store = require('../../store')

const USERS = JSON.parse(process.env.CFP_VOTE_USERS || "[]")

module.exports = async function () {

	const total = await store.llen('talks')
	const data = await Promise.all(USERS.map(async (user) => {
		const key = `votes-${user}`
		const count = await store.llen(key)

		return {
			user,
			total,
			count
		}
	}))

	return data
}