



exports.getStagedTalksKey = (stage) => {
	return `talks_${stage}`
}

exports.getUserStagedVotesKey = (user, stage) => {
	return `votes-${stage}-${user}`
}