const store = require('../../../store')
const shortid = require('shortid');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];


const getToken = async (code) => {
	const google_credentials = await store.get('google_credentials')
	const { client_secret, client_id, redirect_uris } = google_credentials.installed
	const oAuth2Client = new google.auth.OAuth2(
		client_id,
		client_secret,
		redirect_uris[0]
	)

	return new Promise((resolve, reject) => {
		oAuth2Client.getToken(code, (err, token) => {
			if (err) reject(err)

			resolve(token)
		  });
	})
}

module.exports = async function ({ headers, payload }) {
	const code = payload

	try {
		const token = await getToken(code)
		await store.set('google_token', token)

		return {
			succcess: true
		}

	} catch(e) {
		console.log(e);

		return {
			succcess: false
		}
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

