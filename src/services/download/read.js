const store = require('../../store')
const jwt = require('../../auth/token')
const votingStages = require('../../../cfp.config').voting_stages
const USERS = JSON.parse(process.env.CFP_VOTE_USERS || "[]")
const { getUserStagedVotesKey, getStagedTalksKey } = store.keys

const csv = require('csv')

const getStageVotes = async (stage,talks) => {
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

	return talks.map((talk) => {
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
}

module.exports = async function (request) {

	const { token } = request.auth.credentials
	const payload = await jwt.decode(token)
	const { login } = payload

	const talks = await store.lrange(getStagedTalksKey('stage_1'), 0, -1)

	const stage1Votes = await getStageVotes('stage_1',talks)
	const stage2Votes = await getStageVotes('stage_2',talks)

	const talkData = await Promise.all(talks.map((talkId) => {
		return store.hgetall(talkId).then((result) => {
			result.__id = talkId


			result[votingStages['stage_1'].label] = stage1Votes.find((data) => (data.talk === talkId)).votes
			result[votingStages['stage_2'].label] = stage2Votes.find((data) => (data.talk === talkId)).votes



			return result
		})
	}))

	const exportCsv = await new Promise((resolve, reject) => {
		csv.stringify(
			talkData,
			{
				header: true
			},
			(err, result) => {
				if (err) return reject(err);

				resolve(result)
			}
		)
	})

	return exportCsv
}