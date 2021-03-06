module.exports = function () {
	return {
		"id": "F00001",
		"name": "Patient Feedback Form",
		"description": "Understand overall patient feedback",
		"client": "C00001",
		"form": {
			"survey_properties": {
				"intro_message": "<strong>Your feedback helps us to build a better mobile product.</strong><br><br><br>   Hello, Feedback from our clients, friends and family is how we make key decisions on what the future holds for XYZ App.<br><br>By combining data and previous feedback we have introduced many new features e.g. x, y, z.<br><br>It will take less than 2 minutes to answer the feedback quiz.",
				"end_message": "Thank you for having the time to take our survey.",
				"skip_intro": false,
                "max_score": 8
			},
			"questions": [
				{
                    "question_id": "Q00001",
					"question_type": "Checkboxes",
					"question_title": "What were you hoping the XYZ mobile app would do?",
					"description": "(Select all that apply)",
					"required": false,
					"random_choices": false,
					"choices": [
						"Very Good",
						"Good",
						"Bad",
						"Very Bad"
					],
                    "score_enabled": true,
                    "scores": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "score_weight": 1
				},
				{
                    "question_id": "Q00002",
					"question_type": "Checkboxes",
					"question_title": "Do you currently use one of these other software solutions?",
					"description": "",
					"required": false,
					"random_choices": true,
					"choices": [
						"<font color='#AA0000'>Yes, I use a <strong>red</strong> product</font>",
						"I use a <font color='#00AA00'>green product</font>",
						"I partialy use a <font color='#0000AA'><strong>blue</strong></font> product"
					],
                    "score_enabled": true,
                    "scores": [
                        1,
                        2,
                        3,
                        4
                    ],
                    "score_weight": 1
				},
				{
                    "question_id": "Q00003",
					"question_type": "String",
					"question_title": "Why did you not subscribe at the end of your free trial ?",
					"description": "",
					"required": false
				},
				{
                    "question_id": "Q00004",
					"question_title": "If this app was paid, how much you would give to have it ?",
					"description": "",
					"required": false,
					"question_type": "Number"
				},
				{
                    "question_id": "Q00005",
					"question_type": "StringMultiline",
					"question_title": "We love feedback and if there is anything else you’d like us to improve please let us know.",
					"description": "",
					"required": false,
					"number_of_lines": 4
				}
			]
		}
	};
}