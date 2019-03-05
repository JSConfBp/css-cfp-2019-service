const store = require('../../store')
const { getUserStagedVotesKey, getStagedTalksKey } = store.keys

const USERS = JSON.parse(process.env.CFP_VOTE_USERS || "[]")
const cfpConfig = require('../../../cfp.config')

module.exports = async function (request) {
	const { payload: { year, stage } } = request

	if (year) {
		await store.set('year', year)
		return { year }
	}

	if (stage) {
		const year = await store.get('year')
		const previousStage = await store.get('stage')
		const count = await updateStage(previousStage, stage)
		await store.set('stage', stage)
		return { count, stage, year }
	}

}



const updateStage = async (from, to) => {
	console.log(`updating stage from ${from} to ${to}`);

	if (to === 'stage_1') {
		return store.llen(getStagedTalksKey(to))
	}

	if (to === 'stage_2') {
		return updateToStage2(from, to)
	}

}


const updateToStage2 = async (previousStage, newStage) => {

	const talks = await store.lrange(getStagedTalksKey(previousStage), 0, -1)

	const voteData = await Promise.all(USERS.map(async (user) => {
		const key = getUserStagedVotesKey(user, previousStage)
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

	const topVotes = cfpConfig.voting_stages[newStage].include_votes_top

	const shortListIds = votedTalks
		.filter(talk => talk.votes >= topVotes)
		.map(obj => obj.talk)

	if (shortListIds.length < 1) {
		return
	}

// todo shuffle ?

	await store.rpush(getStagedTalksKey(newStage), ...shortListIds)

	return shortListIds.length

}


const updateToStage1 = async () => {

	// STAGE 1

	await store.del('talks_stage_2')
	// remove stage 2 votes as well

}