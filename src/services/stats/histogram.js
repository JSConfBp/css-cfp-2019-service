const store = require('../../store')
const { voting_ui } = require('../../../cfp.config')

const USERS = JSON.parse(process.env.CFP_VOTE_USERS || "[]")

const { getUserStagedVotesKey } = store.keys

module.exports = async function () {
	const stages = Object.keys(voting_ui).map(stage => getVoteHistogram(stage, voting_ui[stage]))
	const data = {}

	for await (stage of stages) {
		data[stage.stageId] = stage.buckets
	}

	return data
}

const getVoteHistogram = async (stageId, stageConfig) => {
	const buckets = stageConfig.map(stage => {
		stage.count = 0
		return stage
	})

	await Promise.all(USERS.map(async (user) => {
		const key = getUserStagedVotesKey(user, stageId)
		const votes = await store.lrange(key, 0, -1)

		votes.forEach(vote => {
			const voteValue = JSON.parse(vote).value
			const bucket = buckets.filter(({value}) => (value === voteValue))
			bucket[0].count += 1
		})
	}))

	return {
		stageId,
		buckets
	}
}