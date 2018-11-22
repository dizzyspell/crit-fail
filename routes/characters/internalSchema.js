module.exports = {

	"type": "object",
	"required": [
		"name",
		"description",
		"abilities",
		"skills",
		"savingThrows",
		"battlestats",
		"notes",
		"inventory",
		"spells",
		"features",
		"proficiencies"
	],
	"properties": {
	
		"name": {
			"type": "string",
			"default": ""
		},
	
		"description": {
			"type": "object",
			"required": ["class", "level", "player", "race", "alignment", "experience"],
			"properties": {
				"class": { "type": "string", "default": "" },
				"level": { "type": "integer", "default": 1 },
				"player": { "type": "string", "default": "" },
				"race": { "type": "string", "default": "" },
				"alignment": { "type": "string", "default": "" },
				"experience": { "type": "integer", "default": 0 }
			}
		},
	
		"abilities": {
			"type": "object",
			"required": ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"], 
			"additionalProperties": {
				"type": "object",
				"required": ["score"],
				"properties": {
					"score": { "type": "integer", "default": 10 },
					"modifier": { "type": "integer", "default": 0 }
				} 
			}
		},
	
		"skills": {
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
					"proficient": { "type": "boolean", "default": false }, 
					"customBonus": { "type": "integer", "default": 0 },
					"bonus": { "type": "integer", "default": 0 }
				}
			}
		},

		"savingThrows": {
			"type": "object",
			"required": ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"],
			"additionalProperties": {
				"type": "object",
				"required": ["proficient", "customBonus"],
				"properties": {
					"proficient": { "type": "boolean", "default": false }, 
					"customBonus": { "type": "integer", "default": 0 },
					"bonus": { "type": "integer", "default": 0 }
				}
			}
		},
	
		"battlestats": {
			"type": "object",
			"required": ["ac", "speed", "current hp", "max hp", "hit dice", "proficieny bonus"],
			"properties": {
				"ac": { 
					"type": "object", 
					"required": ["base"], 
					"properties": { 
						"base": { "type": "integer", "default": 10 },
						"total": { "type": "integer", "default": 10 }
					} 
				}, 
				"speed": { "type": "integer", "default": 20 }, 
				"current hp": { "type": "integer", "default": 5 }, 
				"max hp": { "type": "integer", "default": 5 }, 
				"hit dice": { "type": "string", "default": "1d10" },
				"proficieny bonus": { "type": "integer", "default": 2 }
			}
		},
	
		"notes": {
			"type": "object",
			"properties": {
				"height": { "type": "string", "default": "" },
				"weight": { "type": "string", "default": "" },
				"age": { "type": "string", "default": "" },
				"eyes": { "type": "string", "default": "" },
				"skin": { "type": "string", "default": "" },
				"hair": { "type": "string", "default": "" },
				"appearance": { "type": "string", "default": "" },
				"backstory": { "type": "string", "default": "" },
				"personality": { "type": "string", "default": "" },
				"misc": { "type": "string", "default": "" }
			}
		},
	
		"inventory": {
			"type": "array", 
			"default": []
		},
	
		"spells": {
			"type": "array", 
			"default": []
		},
	
		"features": {
			"type": "array", 
			"default": []
		},
	
		"proficiencies": {
			"type": "array", 
			"default": []
		}
	}
}	