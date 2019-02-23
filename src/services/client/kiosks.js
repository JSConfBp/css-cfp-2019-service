const store = require('../../store')
const basePath = process.env.SERVICE_BASEPATH || ''

module.exports = async function ({ auth }) {
	const { id } = auth.credentials || {}

	const kioskIdList = await store.getKioskIdsOfClient(id)

	return {
		kiosks: kioskIdList.map(id => `${basePath}/v1/kiosk/${id}`)
	}
}