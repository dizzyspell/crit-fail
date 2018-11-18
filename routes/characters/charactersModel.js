const db = require('../../utils/db')
const {logMessage} = require('../../utils/logger')

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

class Character {
	constructor(fetchedJson) {
		let character = JSON.parse(JSON.stringify(fetchedJson))
		Object.assign(this, character)

		this.recalculate()

		CachedCharacters.push(this)
	}

	recalculate() {

		for (let a in this.abilities) {
			let score = this.abilities[a].score ? this.abilities[a].score : this.abilities[a]
			let modifier = Math.floor((score-10)/2)
			let ability = {
				score,
				modifier 
			}
			this.abilities[a] = ability
		}

		this.proficiencyBonus = 2

		for (let s in this.skills) {
			let skill = this.skills[s]
			let mappedAbility = this.abilities[skillAbility[s]]
			skill.bonus = mappedAbility.modifier
			skill.bonus += skill.proficient ? this.proficiencyBonus : 0
			skill.bonus += skill.customBonus 
			this.skills[s] = skill
		}

	}

	async update(column, jsonString) {
		let results = await db.query(`UPDATE characters SET "${column}"='${jsonString}' WHERE "characterId"=${this.characterId} RETURNING "${column}";`)
		Object.assign(this, results[0])

		this.recalculate()

		return this
	}
}

module.exports = async (characterId) => {
	const before = Date.now()
	const matchedCharacter = CachedCharacters.find( cachedCharacter => {
		return cachedCharacter.characterId == characterId
	})
	if (matchedCharacter) {
		logMessage(`used cached character, in ${Date.now()-before} ms`)
		return matchedCharacter
	} else {
		let results = await db.query(`SELECT * FROM characters WHERE "characterId"=${characterId};`)
		let char = results ? new Character(results[0]) : null
		logMessage(`built new character, in ${Date.now()-before} ms`)
		return char
	}
}