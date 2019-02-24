const csv = require('csv')
const store = require('../../store')
const shortid = require('shortid');

/*
Data
* year
* Talk objects as hashes under ID
* talk index as list
* User votes sorted sets (votes-user voteInt talkID)



async function (data) {

	return new Promise((resolve, reject) => {
		csv.parse(data, {columns: true}, (err, csvData) => {

			if (err) return reject(err)


*/


const parseCsv = async function (data) {
	return new Promise((resolve, reject) => {
		csv.parse(data, {columns: true}, (err, csvData) => {
			if (err) return reject(err)

			resolve(csvData)
		})
	})
}

module.exports = async function ({ headers, payload }) {
	const year = headers['x-cfp-year']
	const cfps = await parseCsv(payload)
	const cfpLength = cfps.length

	for( let i = 0 ; i < cfpLength ; i++) {
		const id = `talk_${shortid.generate()}`
		Object.entries(cfps[i]).forEach( async ([key, value]) => {
			await store.hset(id, key, value)
		})
		await store.rpush('talks', id)
	}

	await store.set('year', year)

	return { count: cfpLength, year }
}