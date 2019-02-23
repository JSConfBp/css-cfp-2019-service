const store = require('../../store')
const basePath = process.env.SERVICE_BASEPATH || ''

/**
 * 
 * @param {String} id 		user id
 * @param {String} kioskId 	kiosk id
 */
module.exports = async function (id, kioskId) {

	const kioskIdList = await store.getKioskIdsOfClient(id)

	return kioskIdList.includes(kioskId)
}