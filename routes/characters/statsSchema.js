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
			"type": "object",
			"required": ["score"],
			"properties": {
				"score": { "type": "integer" }
			} 
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

	battlestats: {
		"type": "object",
		"required": ["ac", "speed", "current hp", "max hp", "hit dice"],
		"properties": {
			"ac":{ 
				"type": "object", 
				"required": ["base"], 
				"properties": { 
					"base": { "type": "integer" }
				} 
			}, 
			"speed":{ "type": "integer" }, 
			"current hp":{ "type": "integer" }, 
			"max hp":{ "type": "integer" }, 
			"hit dice":{ "type": "string" }
		}
	},

	notes: {
		"type": "object",
		"properties": {
			"height": { "type": "string" },
			"weight": { "type": "string" },
			"age": { "type": "string" },
			"eyes": { "type": "string" },
			"skin": { "type": "string" },
			"hair": { "type": "string" },
			"appearance": { "type": "string" },
			"backstory": { "type": "string" },
			"misc": { "type": "string" }
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
	}
}