const store = require('../../../store')
const shortid = require('shortid');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

module.exports = async function ({ headers, payload }) {

	const credentials = payload

	const { client_secret, client_id, redirect_uris } = credentials.installed
	const oAuth2Client = new google.auth.OAuth2(
		client_id,
		client_secret,
		redirect_uris[0]
	)

	const google_credentials = await store.set('google_credentials', credentials)
	const google_token = await store.get('google_token')

	if (!google_token) {
		const authUrl = oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES
		})

		return {
			needAuth: true,
			authUrl
		}
	}

	oAuth2Client.setCredentials(google_token)

	return {
		needAuth: false
	}
}



/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
	const {client_secret, client_id, redirect_uris} = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(
		client_id, client_secret, redirect_uris[0]);

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, (err, token) => {
	  if (err) return getNewToken(oAuth2Client, callback);
	  oAuth2Client.setCredentials(JSON.parse(token));
	  callback(oAuth2Client);
	});
}

