const client = require('./client')
const token = require('./token')
const cfp = require('./cfp')

exports.register = async function (server, options) {
  const basePath = process.env.SERVICE_BASEPATH || ''

  return await server.register([client, token, cfp], {
    routes: {
      prefix: basePath + '/v1'
    }
  })

  //server.route(require('./status/read'))
}

exports.name = 'http-routes'

