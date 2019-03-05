const keys = require('./keys')
const USERS = JSON.parse(process.env.CFP_VOTE_USERS || "[]")

module.exports = function (store) {

	const readOldTalks =  (err, result) => {
		if (err) throw err;

		if (result.length > 0) {
			store.rpush('talks-stage_1', ...result, writeNewTalks)
		}
	}

	const writeNewTalks = (err, result) => {
		if (err) throw err;

		console.log(result);

		USERS.forEach((user) => {
			store.lrange(`votes-${user}`, 0, -1, readUserVotes(user))
		})
	}

	const readUserVotes = (user) => {
		return (err, result) => {
			if (err) throw err;

			if (result.length > 0) {
				store.rpush(`votes-stage_1-${user}`, ...result, writeNewUserVotes)
			}
		}
	}

	const writeNewUserVotes = (err, result) => {
		if (err) throw err;

		console.log(result);
	}

	store.get('migrated', (err, result) => {
		console.log(result);

		if (!result) {
			store.lrange('talks', 0, -1, readOldTalks)
			store.set('migrated', true)
		}
	})



}