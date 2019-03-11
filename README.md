# cfp-vote-service



## Setup for your event

The complete setup guide is at the App UI, I suggest you should [start there](https://github.com/JSConfBp/cfp-vote-ui)

### Set up the CFP Vote Service

If you started the setup guide over the App UI, you should have your GitHub OAuth secrets by now, keep'em close, you'll need them here as well.

Fork this repo, then go to Heroku and create a new App there. Connect it to GitHub, you can turn on automatic deployments

![Connect your Heroku app to GitHub](https://raw.githubusercontent.com/JSConfBp/cfp-vote-ui/master/docs/heroku-github-connect.png)

If your App is connected to GitHub, go to the Resources tab, and add a free Heroku Redis instance.

![Search for "redis"](https://raw.githubusercontent.com/JSConfBp/cfp-vote-service/master/docs/heroku-redis-addon.png)

![Provision a free Heroku Redis](https://raw.githubusercontent.com/JSConfBp/cfp-vote-service/master/docs/heroku-redis-provision.png)


After it looks like it has been provisioned, go to the Settings tab, and edit the config vars:


* **CFP_VOTE_ADMINS**  
a JSON encoded array with the github usernames of those who will have admin privileges in your app  
for example `["necccc"]`
* **CFP_VOTE_ADMINS**  
a JSON encoded array with the github usernames of those who will have accessto your app, and able to vote  
for example `["necccc", "hubudibu"]`
* **GH_OAUTH_CLIENT_ID**
* **GH_OAUTH_CLIENT_SECRET**  
these are displayed on your GitHub Org OAuth application page
* **REDIS_URL**  
this will be provisioned by heroku, no need to edit or touch it

If you've added these, go to the Deploy tab on Heroku, scroll to the bottom, and do a manual deploy .

![Manual deploy to Heroku](https://raw.githubusercontent.com/JSConfBp/cfp-vote-ui/master/docs/heroku-manual-deploy.png)

If the deploy was successful, you've done this part!