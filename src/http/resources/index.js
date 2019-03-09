const client = require('./client')
const token = require('./token')
const cfp = require('./cfp')
const stats = require('./stats')
const talk = require('./talk')
const vote = require('./vote')
const download = require('./download')

exports.register = async function (server, options) {
  const basePath = process.env.SERVICE_BASEPATH || ''

  return await server.register([client, token, cfp, stats, talk, vote, download], {
    routes: {
      prefix: basePath + '/v1'
    }
  })

  //server.route(require('./status/read'))
}

exports.name = 'http-routes'

