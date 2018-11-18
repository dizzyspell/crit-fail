module.exports = {

	name: {
		"type": "string"
	},

	description: {
		"type": "object",
		"required": ["class", "level", "player", "race", "alignment", "experience"],
		"properties": {
			"class": { "type": "string" },
			"level": { "type": "integer" },
			"player": { "type": "string" },
			"race": { "type": "string" },
			"alignment": { "type": "string" },
			"experience": { "type": "integer" }
		}
	},

	abilities: {
		"type": "object",
		"required": ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"], 
		"additionalProperties": {
			"type": "integer" 
		}
	},

	skills: {
		"type": "object",
		"required": [
			"acrobatics",
			"animal handling",
			"arcana",
			"athletics",
			"deception",
			"history",
			"insight",
			"intimidation",
			"investigation",
			"medicine",
			"nature",
			"perception",
			"performance",
			"persuasion",
			"religion",
			"sleight of hand",
			"stealth",
			"survival"
		],
		"additionalProperties": {
			"type": "object",
			"required": ["proficient", "customBonus"],
			"properties": {
				"proficient": {"type": "boolean"}, 
				"customBonus": {"type": "integer"}
			}
		}
	},

	inventory: {
		"type": "array"
	},

	spells: {
		"type": "array"
	},

	features: {
		"type": "array"
	},

	proficiencies: {
		"type": "array"
	},

	battlestats: {
		"type": "object"
	},

	notes: {
		"type": "object"
	},
}