const characterSchema = require('./internalSchema')

const db = require('../../utils/db')
const {logMessage} = require('../../utils/logger')
const validator = require('../../utils/validator')

let CachedCharacters = []

const skillAbility = {
	"acrobatics": "dexterity",
	"animal handling": "wisdom",
	"arcana": "intelligence",
	"athletics": "strength",
	"deception": "charisma",
	"history": "intelligence",
	"insight": "wisdom",
	"intimidation": "charisma",
	"investigation": "intelligence",
	"medicine": "wisdom",
	"nature": "intelligence",
	"perception": "wisdom",
	"performance": "charisma",
	"persuasion": "charisma",
	"religion": "intelligence",
	"sleight of hand": "dexterity",
	"stealth": "dexterity",
	"survival": "wisdom"
}

const SECONDS = 1000
const MINUTES = 60000

class Character {
	constructor(fetchedJson) {
		let data = validator.validate(characterSchema, fetchedJson)
		let character = JSON.parse(JSON.stringify(data.json))
		this.sheet = {}
		Object.assign(this.sheet, character)

		this.recalculate()

		this.cacheIndex = CachedCharacters.push(this)-1

		this.startLife(10*MINUTES)

		this.save()
	}

	recalculate() {
		let level = this.sheet.description.level
		this.sheet.battlestats["proficiency bonus"] = Math.floor((level-1)/4)+2
		let proficiencyBonus = this.sheet.battlestats["proficiency bonus"]

		for (let a in this.sheet.abilities) {
			let score = this.sheet.abilities[a].score ? this.sheet.abilities[a].score : this.sheet.abilities[a]
			let modifier = Math.floor((score-10)/2)
			let newAbility = {
				score,
				modifier 
			}
			this.sheet.abilities[a] = newAbility
		}

		this.sheet.battlestats.ac.total = this.sheet.battlestats.ac.base + this.sheet.abilities.dexterity.modifier

		for (let s in this.sheet.skills) {
			let skill = this.sheet.skills[s]
			let mappedAbility = this.sheet.abilities[skillAbility[s]]
			skill.bonus = mappedAbility.modifier
			skill.bonus += skill.proficient ? proficiencyBonus : 0
			skill.bonus += skill.customBonus 
			this.sheet.skills[s] = skill
		}

		for (let s in this.sheet.savingThrows) {
			let savingThrow = this.sheet.savingThrows[s]
			let mappedAbility = this.sheet.abilities[s]
			savingThrow.bonus = mappedAbility.modifier
			savingThrow.bonus += savingThrow.proficient ? proficiencyBonus : 0
			savingThrow.bonus += savingThrow.customBonus 
			this.sheet.savingThrows[s] = savingThrow
		}
	}

	async save() {
		db.query(
			`UPDATE characters SET 
				"name" = '${this.sheet["name"]}',
				"description" = '${JSON.stringify(this.sheet["description"])}',
				"abilities" = '${JSON.stringify(this.sheet["abilities"])}',
				"skills" = '${JSON.stringify(this.sheet["skills"])}',
				"savingThrows" = '${JSON.stringify(this.sheet["savingThrows"])}',
				"battlestats" = '${JSON.stringify(this.sheet["battlestats"])}',
				"notes" = '${JSON.stringify(this.sheet["notes"])}',
				"inventory" = '${JSON.stringify(this.sheet["inventory"])}',
				"spells" = '${JSON.stringify(this.sheet["spells"])}',
				"features" = '${JSON.stringify(this.sheet["features"])}',
				"proficiencies" = '${JSON.stringify(this.sheet["proficiencies"])}'
			WHERE "characterId" = ${this.sheet.characterId};`
		).then( () => {
			logMessage(`saved character ${this.sheet.characterId}`)
		}).catch( (err) => {
			logMessage(`failed to save character ${this.sheet.characterId}`)
			console.error(err)
		})
	}

	async startLife(lifeTime) {
		setTimeout(async () => {
			await this.save()
			CachedCharacters.splice(this.cacheIndex, 1)
		}, lifeTime)
	}

	update(column, data) {
		Object.assign(this.sheet[column], data)
		this.recalculate()
		this.save()
		return this.sheet
	}
}

const getById = async (characterId) => {		
	const before = Date.now()
	const matchedCharacter = CachedCharacters.find( cachedCharacter => {
		return cachedCharacter.sheet.characterId == characterId
	})
	if (matchedCharacter) {
		logMessage(`used cached character, in ${Date.now()-before} ms`)
		return matchedCharacter
	} else {
		let results = await db.query(`SELECT * FROM characters WHERE "characterId"=${characterId};`)
		let char = results ? new Character(results[0]) : null
		logMessage(`built character from db, in ${Date.now()-before} ms`)
		return char
	}
}

const getRandom = (name) => {
	let char = {
		"name": name? name : "rando"
	}

	char["description"] = {
		"class": "",
		"level": 1,
		"player": "",
		"race": "",
		"alignment": "",
		"experience": 0 
	}

	char["abilities"] = [
		"strength", 
		"dexterity", 
		"constitution", 
		"intelligence", 
		"wisdom", 
		"charisma"
	].reduce( (abilities, ability) => {
		abilities[ability] = {
			score: 10,
			modifier: 0
		}
		return abilities
	}, {})

	char["skills"] = [
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
	].reduce( (skills, skill) => {
		skills[skill] = {
			proficient: false,
			customBonus: 0,
			bonus: 0
		}
		return skills
	}, {})

	char["savingThrows"] = [
		"strength", 
		"dexterity", 
		"constitution", 
		"intelligence", 
		"wisdom", 
		"charisma"
	].reduce( (skills, skill) => {
		skills[skill] = {
			proficient: false,
			customBonus: 0,
			bonus: 0
		}
		return skills
	}, {})

	char["battlestats"] = {
		"ac": { 
			"base": 10,
			"total": 10
		}, 
		"speed": 20, 
		"current hp": 10, 
		"max hp": 10, 
		"hit dice": "1d10",
		"proficieny bonus": 0
	}
	
	char["notes"] =  {
		"height": "",
		"weight": "",
		"age": "",
		"eyes": "",
		"skin": "",
		"hair": "",
		"appearance": "",
		"backstory": "",
		"personality": "",
		"misc": ""
	}

	char["inventory"] = []
	char["spells"] = []
	char["features"] = []
	char["proficiencies"] = []

	return char
}

const createNew = async (name) => {	
	const before = Date.now()
	let data = getRandom(name)
	let results = await db.query(`INSERT INTO characters("name") VALUES ('${name}') RETURNING "characterId"`)
	data.characterId = results[0].characterId
	let char = new Character(data)
	logMessage(`rolled new character, in ${Date.now()-before} ms`)
	return char
}

module.exports = {
	getById,
	getRandom,
	createNew
}