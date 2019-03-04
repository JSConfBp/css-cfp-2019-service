module.exports = {
	title: "CFP Vote Service",
	cfp_fields: [
		"Presentation title",
		"Presentation summary to be displayed on the website",
		"Presentation summary"
	],
	voting_stages: {
		'stage_1': {
			label: 'First Voting Round'
		},
		'stage_2': {
			label: 'Shortlisting Round',
			include_votes_top: 6
		}
	},
	voting_ui: {
		stage_1: [
			{ label: '1', value: 1 },
			{ label: '2', value: 2 },
			{ label: '3', value: 3 },
			{ label: '4', value: 4 },
			{ label: '5', value: 5 },
			{ label: '6', value: 6 },
			{ label: '7', value: 7 },
			{ label: '8', value: 8 },
			{ label: '9', value: 9 },
			{ label: '10', value: 10 },
		],
		stage_2: [
			{ label: 'meh', value: 1 },
			{ label: 'yay', value: 2 },
			{ label: 'MUST', value: 3 }
		]
	}
}