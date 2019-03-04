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
		return  updateToStage2(stage)
	}

}


const updateToStage2 = async (stage) => {

	// STAGE 2

	const { getUserStagedVotesKey, getStagedTalksKey } = store.keys

	const talks = await store.lrange(getStagedTalksKey('stage_1'), 0, -1)

	const voteData = await Promise.all(USERS.map(async (user) => {
		const key = getUserStagedVotesKey(user, stage)
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


	const topVotes = cfpConfig.voting_stages['stage_2'].include_votes_top

console.log(votedTalks);

	const shortListIds = votedTalks
		.filter(talk => talk.votes >= topVotes)
		.map(talk => talk.id)

console.log(shortListIds);

	if (shortListIds.length < 1) {
		return
	}

// todo shuffle ?

	await store.rpush(getStagedTalksKey(stage), ...shortListIds)
}


const updateToStage1 = async () => {

	// STAGE 1

	await store.del('talks_stage_2')
	// remove stage 2 votes as well

}