
const { promisify } = require('util')
const redis = require("redis")


const createStore = () => {
	if (process.env.NODE_ENV === 'production') {
		return redis.createClient(process.env.REDIS_URL)
	} else {
		return redis.createClient({ host: process.env.REDIS_URL })
	}
}

const store = createStore()

const get = promisify(store.get).bind(store);
const set = promisify(store.set).bind(store);
const del = promisify(store.del).bind(store);
const rpush = promisify(store.rpush).bind(store);
const lrange = promisify(store.lrange).bind(store);
const lrem = promisify(store.lrem).bind(store);

exports.set = (key, value) => set(key, JSON.stringify(value))
exports.get = (key) => get(key).then(value => JSON.parse(value))
exports.del = (key) => {
	if (key instanceof Array) {
		return del(...key).then(value => value)
	} else {
		return del(key).then(value => value)
	}
}

exports.setKioskIdForClient = (clientId, kioskId) => rpush(`KC__${clientId}`, kioskId)
exports.getKioskIdsOfClient = (clientId) => lrange(`KC__${clientId}`, 0, -1)

exports.removeKioskIdsOfClient = (clientId, kioskId) => lrem(`KC__${clientId}`, 0, kioskId)
