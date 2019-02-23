const uuid = require('uuid/v4')
const moment = require('moment')
const { promisify } = require('util')
const crypto = require('crypto')
const tokenAuth = require('../../auth/token')
const store = require('../../store')

const getRegisteredUser = async (token, githubId) => {
	const registeredGithubId = await store.get(token)
	const id = await store.get(registeredGithubId || githubId)

	return id
}

module.exports = async function ({ payload }) {
	const id = uuid()
	const buf = await promisify(crypto.randomBytes)(256)
	const secret = buf.toString('hex')
	const { token, github_id, name, login } = payload

	const data = {
		id,
		login,
		github_id,
		secret,
		name,
		updated_at: moment().unix(),
		created_at: moment().unix(),
	}

	const alreadyRegisteredId =await getRegisteredUser(token, github_id)

	if (alreadyRegisteredId) {
		store.set(token, github_id)

		const alreadyRegisteredData = await store.get(alreadyRegisteredId)
		const jwt = await tokenAuth.create({
			sub: alreadyRegisteredId
		}, alreadyRegisteredData.secret)


		if (process.env.DEBUG) {
			console.info('Client already registered once');
		}

		return { jwt }
	}

	store.set(token, github_id)
	store.set(github_id, id)
	store.set(id, data)

	const jwt = await tokenAuth.create({
		sub: id
	}, secret)

	return { jwt }
}