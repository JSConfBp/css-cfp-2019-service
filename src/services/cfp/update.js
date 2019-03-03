const store = require('../../store')

const USERS = JSON.parse(process.env.CFP_VOTE_USERS || "[]")
const cfpConfig = require('../../../cfp.config')

module.exports = async function (request) {
	const { payload: { year, stage } } = request

	if (year) {
		await store.set('year', year)
	}

	if (stage) {
		await updateStage(stage)
		await store.set('stage', stage)
	}

	return { stage, year }
}



const updateStage = async (stage) => {
	console.log('updating stage to', stage);

	if (stage === 'stage_1') {}

	if (stage === 'stage_2') {
		return  updateToStage2()
	}

}


const updateToStage2 = async () => {

	// STAGE 2

	const talks = await store.lrange('talks', 0, -1)

	const voteData = await Promise.all(USERS.map(async (user) => {
		const key = `votes-stage_1-${user}`
		const votes = await store.lrange(key, 0, -1)
		const voteValuePairs = votes.reduce((obj, vote) => {
			if (vote) {
				const { id, value } = (JSON.parse(vote))
				obj[id] = value
			}
			return obj
		}, {})

		return {
			user,
			votes: voteValuePairs
		}
	}))

	const votedTalks = talks.map((talk) => {
		const votes = voteData.reduce((sum, data) => {
			if (data.votes && data.votes[talk]) {
				sum += data.votes[talk]
			}
			return sum
		}, 0)

		return {
			talk,
			votes
		}
	})

	const shortListIds = votedTalks
		.filter(talk => talk.votes >= cfpConfig.include_votes_top)
		.map(talk => talk.id)

// todo shuffle ?

	await store.rpush('talks_stage_2', ...shortListIds)
}


const updateToStage1 = async () => {

	// STAGE 1

	await store.del('talks_stage_2')
	// remove stage 2 votes as well

}