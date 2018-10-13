'use strict';

const Dex = require('./../sim/dex');
const PRNG = require('./../sim/prng');

/**@type {AnyObject} */
// @ts-ignore
const randomBSSFactorySets = require('./bss-factory-sets.json');
/**@type {AnyObject} */
// @ts-ignore
const randomFactorySets = require('./factory-sets.json');

/**
 * @typedef {Object} TeamData
 * @property {{[k: string]: number}} typeCount
 * @property {{[k: string]: number}} typeComboCount
 * @property {{[k: string]: number}} baseFormes
 * @property {number} megaCount
 * @property {number} [zCount]
 * @property {{[k: string]: number}} has
 * @property {boolean} forceResult
 * @property {{[k: string]: number}} weaknesses
 * @property {{[k: string]: number}} resistances
 * @property {string} [weather]
 * @property {number} [eeveeLimCount]
 */

class RandomTeams extends Dex.ModdedDex {
	/**
	 * @param {Format | string} format
	 * @param {?PRNG | [number, number, number, number]} [prng]
	 */
	constructor(format, prng) {
		format = Dex.getFormat(format);
		super(format.mod);
		this.randomBSSFactorySets = randomBSSFactorySets;
		this.randomFactorySets = randomFactorySets;

		this.factoryTier = '';
		this.format = format;
		this.prng = prng && !Array.isArray(prng) ? prng : new PRNG(prng);
	}

	generateTeam() {
		const generatorName = typeof this.format.team === 'string' && this.format.team.startsWith('random') ? this.format.team + 'Team' : '';
		// @ts-ignore
		return this[generatorName || 'randomTeam']();
	}

	/**
	 * @param {number} numerator - the top part of the probability fraction
	 * @param {number} denominator - the bottom part of the probability fraction
	 * @return {boolean} - randomly true or false
	 */
	randomChance(numerator, denominator) {
		return this.prng.randomChance(numerator, denominator);
	}

	/**
	 * @param {ReadonlyArray<T>} items - the items to choose from
	 * @return {T} - a random item from items
	 * @template T
	 */
	sample(items) {
		return this.prng.sample(items);
	}

	/**
	 * @param {number} [m]
	 * @param {number} [n]
	 * @return {number}
	 */
	random(m, n) {
		return this.prng.next(m, n);
	}

	/**
	 * Remove an element from an unsorted array significantly faster
	 * than .splice
	 *
	 * @param {any[]} list
	 * @param {number} index
	 */
	fastPop(list, index) {
		// If an array doesn't need to be in order, replacing the
		// element at the given index with the removed element
		// is much, much faster than using list.splice(index, 1).
		let length = list.length;
		let element = list[index];
		list[index] = list[length - 1];
		list.pop();
		return element;
	}

	/**
	 * Remove a random element from an unsorted array and return it.
	 * Uses the battle's RNG if in a battle.
	 *
	 * @param {any[]} list
	 */
	sampleNoReplace(list) {
		let length = list.length;
		let index = this.random(length);
		return this.fastPop(list, index);
	}

	/**
	 * @param {Template} template
	 */
	checkBattleForme(template) {
		// If the Pokémon has a Mega or Primal alt forme, that's its preferred battle forme.
		// No randomization, no choice. We are just checking its existence.
		// Returns a Pokémon template for further details.
		if (!template.otherFormes) return null;
		let firstForme = this.getTemplate(template.otherFormes[0]);
		if (firstForme.isMega || firstForme.isPrimal) return firstForme;
		return null;
	}

	// checkAbilities(selectedAbilities, defaultAbilities) {
	// 	if (!selectedAbilities.length) return true;
	// 	let selectedAbility = selectedAbilities.pop();
	// 	let isValid = false;
	// 	for (let i = 0; i < defaultAbilities.length; i++) {
	// 		let defaultAbility = defaultAbilities[i];
	// 		if (!defaultAbility) break;
	// 		if (defaultAbility.includes(selectedAbility)) {
	// 			defaultAbilities.splice(i, 1);
	// 			isValid = this.checkAbilities(selectedAbilities, defaultAbilities);
	// 			if (isValid) break;
	// 			defaultAbilities.splice(i, 0, defaultAbility);
	// 		}
	// 	}
	// 	if (!isValid) selectedAbilities.push(selectedAbility);
	// 	return isValid;
	// }
	// hasMegaEvo(template) {
	// 	if (!template.otherFormes) return false;
	// 	let firstForme = this.getTemplate(template.otherFormes[0]);
	// 	return !!firstForme.isMega;
	// }
	/**
	 * @return {RandomTeamsTypes["RandomSet"][]}
	 */
	randomCCTeam() {
		let team = [];

		let natures = Object.keys(this.data.Natures);
		let items = Object.keys(this.data.Items);

		let random6 = this.random6Pokemon();

		for (let i = 0; i < 6; i++) {
			let species = random6[i];
			let template = this.getTemplate(species);

			// Random legal item
			let item = '';
			if (this.gen >= 2) {
				do {
					item = this.sample(items);
				} while (this.getItem(item).gen > this.gen || this.data.Items[item].isNonstandard);
			}

			// Make sure forme is legal
			if (template.battleOnly || template.requiredItems && !template.requiredItems.some(req => toId(req) === item)) {
				template = this.getTemplate(template.baseSpecies);
				species = template.name;
			}

			// Make sure that a base forme does not hold any forme-modifier items.
			let itemData = this.getItem(item);
			if (itemData.forcedForme && species === this.getTemplate(itemData.forcedForme).baseSpecies) {
				do {
					item = this.sample(items);
					itemData = this.getItem(item);
				} while (itemData.gen > this.gen || itemData.isNonstandard || itemData.forcedForme && species === this.getTemplate(itemData.forcedForme).baseSpecies);
			}

			// Random legal ability
			let abilities = Object.values(template.abilities).filter(a => this.getAbility(a).gen <= this.gen);
			/**@type {string} */
			// @ts-ignore
			let ability = this.gen <= 2 ? 'None' : this.sample(abilities);

			// Four random unique moves from the movepool
			let moves;
			let pool = ['struggle'];
			if (species === 'Smeargle') {
				pool = Object.keys(this.data.Movedex).filter(moveid => !(['chatter', 'struggle', 'paleowave', 'shadowstrike', 'magikarpsrevenge'].includes(moveid) || this.data.Movedex[moveid].isZ));
			} else if (template.learnset) {
				pool = Object.keys(template.learnset);
				if (template.species.substr(0, 6) === 'Rotom-') {
					const learnset = this.getTemplate(template.baseSpecies).learnset;
					if (learnset) pool = Array.from(new Set(pool.concat(Object.keys(learnset))));
				}
			} else {
				const learnset = this.getTemplate(template.baseSpecies).learnset;
				if (learnset) pool = Object.keys(learnset);
			}
			if (pool.length <= 4) {
				moves = pool;
			} else {
				moves = [this.sampleNoReplace(pool), this.sampleNoReplace(pool), this.sampleNoReplace(pool), this.sampleNoReplace(pool)];
			}

			// Random EVs
			let evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			let s = ["hp", "atk", "def", "spa", "spd", "spe"];
			let evpool = 510;
			do {
				let x = this.sample(s);
				// @ts-ignore
				let y = this.random(Math.min(256 - evs[x], evpool + 1));
				// @ts-ignore
				evs[x] += y;
				evpool -= y;
			} while (evpool > 0);

			// Random IVs
			let ivs = {hp: this.random(32), atk: this.random(32), def: this.random(32), spa: this.random(32), spd: this.random(32), spe: this.random(32)};

			// Random nature
			let nature = this.sample(natures);

			// Level balance--calculate directly from stats rather than using some silly lookup table
			let mbstmin = 1307; // Sunkern has the lowest modified base stat total, and that total is 807

			let stats = template.baseStats;
			// If Wishiwashi, use the school-forme's much higher stats
			if (template.baseSpecies === 'Wishiwashi') stats = Dex.getTemplate('wishiwashischool').baseStats;

			// Modified base stat total assumes 31 IVs, 85 EVs in every stat
			let mbst = (stats["hp"] * 2 + 31 + 21 + 100) + 10;
			mbst += (stats["atk"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["def"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spa"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spd"] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats["spe"] * 2 + 31 + 21 + 100) + 5;

			let level = Math.floor(100 * mbstmin / mbst); // Initial level guess will underestimate

			while (level < 100) {
				mbst = Math.floor((stats["hp"] * 2 + 31 + 21 + 100) * level / 100 + 10);
				mbst += Math.floor(((stats["atk"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100); // Since damage is roughly proportional to level
				mbst += Math.floor((stats["def"] * 2 + 31 + 21 + 100) * level / 100 + 5);
				mbst += Math.floor(((stats["spa"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
				mbst += Math.floor((stats["spd"] * 2 + 31 + 21 + 100) * level / 100 + 5);
				mbst += Math.floor((stats["spe"] * 2 + 31 + 21 + 100) * level / 100 + 5);

				if (mbst >= mbstmin) break;
				level++;
			}

			// Random happiness
			let happiness = this.random(256);

			// Random shininess
			let shiny = this.randomChance(1, 1024);

			team.push({
				name: template.baseSpecies,
				species: template.species,
				gender: template.gender,
				item: item,
				ability: ability,
				moves: moves,
				evs: evs,
				ivs: ivs,
				nature: nature,
				level: level,
				happiness: happiness,
				shiny: shiny,
			});
		}

		return team;
	}

	random6Pokemon() {
		// Pick six random pokemon--no repeats, even among formes
		// Also need to either normalize for formes or select formes at random
		// Unreleased are okay but no CAP
		let last = [0, 151, 251, 386, 493, 649, 721, 807][this.gen];
		/**@type {{[k: string]: number}} */
		let hasDexNumber = {};
		for (let i = 0; i < 6; i++) {
			let num;
			do {
				num = this.random(last) + 1;
			} while (num in hasDexNumber);
			hasDexNumber[num] = i;
		}

		/**@type {string[][]} */
		let formes = [[], [], [], [], [], []];
		for (let id in this.data.Pokedex) {
			if (!(this.data.Pokedex[id].num in hasDexNumber)) continue;
			let template = this.getTemplate(id);
			if (template.gen <= this.gen && template.species !== 'Pichu-Spiky-eared' && template.species.substr(0, 8) !== 'Pikachu-') {
				formes[hasDexNumber[template.num]].push(template.species);
			}
		}

		let sixPokemon = [];
		for (let i = 0; i < 6; i++) {
			if (!formes[i].length) {
				throw new Error("Invalid pokemon gen " + this.gen + ": " + JSON.stringify(formes) + " numbers " + JSON.stringify(hasDexNumber));
			}
			sixPokemon.push(this.sample(formes[i]));
		}
		return sixPokemon;
	}

	randomHCTeam() {
		let team = [];

		let itemPool = Object.keys(this.data.Items);
		let abilityPool = Object.keys(this.data.Abilities);
		let movePool = Object.keys(this.data.Movedex);
		let naturePool = Object.keys(this.data.Natures);

		let random6 = this.random6Pokemon();

		for (let i = 0; i < 6; i++) {
			// Choose forme
			let template = this.getTemplate(random6[i]);

			// Random unique item
			let item = '';
			if (this.gen >= 2) {
				do {
					item = this.sampleNoReplace(itemPool);
				} while (this.getItem(item).gen > this.gen || this.data.Items[item].isNonstandard);
			}

			// Random unique ability
			let ability = 'None';
			if (this.gen >= 3) {
				do {
					ability = this.sampleNoReplace(abilityPool);
				} while (this.getAbility(ability).gen > this.gen || this.data.Abilities[ability].isNonstandard);
			}

			// Random unique moves
			let m = [];
			do {
				let moveid = this.sampleNoReplace(movePool);
				if (this.getMove(moveid).gen <= this.gen && !this.data.Movedex[moveid].isNonstandard && (moveid === 'hiddenpower' || moveid.substr(0, 11) !== 'hiddenpower')) {
					m.push(moveid);
				}
			} while (m.length < 4);

			// Random EVs
			let evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			let s = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
			if (this.gen === 6) {
				let evpool = 510;
				do {
					let x = this.sample(s);
					// @ts-ignore
					let y = this.random(Math.min(256 - evs[x], evpool + 1));
					// @ts-ignore
					evs[x] += y;
					evpool -= y;
				} while (evpool > 0);
			} else {
				for (const x of s) {
					// @ts-ignore
					evs[x] = this.random(256);
				}
			}

			// Random IVs
			let ivs = {hp: this.random(32), atk: this.random(32), def: this.random(32), spa: this.random(32), spd: this.random(32), spe: this.random(32)};

			// Random nature
			let nature = this.sample(naturePool);

			// Level balance
			let mbstmin = 1307;
			let stats = template.baseStats;
			let mbst = (stats['hp'] * 2 + 31 + 21 + 100) + 10;
			mbst += (stats['atk'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['def'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spa'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spd'] * 2 + 31 + 21 + 100) + 5;
			mbst += (stats['spe'] * 2 + 31 + 21 + 100) + 5;
			let level = Math.floor(100 * mbstmin / mbst);
			while (level < 100) {
				mbst = Math.floor((stats['hp'] * 2 + 31 + 21 + 100) * level / 100 + 10);
				mbst += Math.floor(((stats['atk'] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
				mbst += Math.floor((stats['def'] * 2 + 31 + 21 + 100) * level / 100 + 5);
				mbst += Math.floor(((stats['spa'] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
				mbst += Math.floor((stats['spd'] * 2 + 31 + 21 + 100) * level / 100 + 5);
				mbst += Math.floor((stats['spe'] * 2 + 31 + 21 + 100) * level / 100 + 5);
				if (mbst >= mbstmin) break;
				level++;
			}

			// Random happiness
			let happiness = this.random(256);

			// Random shininess
			let shiny = this.randomChance(1, 1024);

			team.push({
				name: template.baseSpecies,
				species: template.species,
				gender: template.gender,
				item: item,
				ability: ability,
				moves: m,
				evs: evs,
				ivs: ivs,
				nature: nature,
				level: level,
				happiness: happiness,
				shiny: shiny,
			});
		}

		return team;
	}

	/**
	 * @param {?string[]} moves
	 * @param {{[k: string]: boolean}} [hasType]
	 * @param {{[k: string]: boolean}} [hasAbility]
	 * @param {string[]} [movePool]
	 */
	queryMoves(moves, hasType = {}, hasAbility = {}, movePool = []) {
		// This is primarily a helper function for random setbuilder functions.
		let counter = {
			Physical: 0, Special: 0, Status: 0, damage: 0, recovery: 0, stab: 0, inaccurate: 0, priority: 0, recoil: 0, drain: 0,
			adaptability: 0, bite: 0, contrary: 0, hustle: 0, ironfist: 0, serenegrace: 0, sheerforce: 0, skilllink: 0, technician: 0,
			physicalsetup: 0, specialsetup: 0, mixedsetup: 0, speedsetup: 0, physicalpool: 0, specialpool: 0,
			/**@type {Move[]} */
			damagingMoves: [],
			/**@type {{[k: string]: number}} */
			damagingMoveIndex: {},
			setupType: '',
			// typescript
			Bug: 0, Dark: 0, Dragon: 0, Electric: 0, Fairy: 0, Fighting: 0, Fire: 0, Flying: 0, Ghost: 0, Grass: 0, Ground: 0,
			Ice: 0, Normal: 0, Poison: 0, Psychic: 0, Rock: 0, Steel: 0, Water: 0,
		};

		for (let type in Dex.data.TypeChart) {
			// @ts-ignore
			counter[type] = 0;
		}

		if (!moves || !moves.length) return counter;

		// Moves that heal a fixed amount:
		let RecoveryMove = [
			'healorder', 'milkdrink', 'moonlight', 'morningsun', 'recover', 'roost', 'slackoff', 'softboiled', 'synthesis',
		];
		// Moves which drop stats:
		let ContraryMove = [
			'closecombat', 'leafstorm', 'overheat', 'superpower', 'vcreate',
		];
		// Moves that boost Attack:
		let PhysicalSetup = [
			'bellydrum', 'bulkup', 'coil', 'curse', 'dragondance', 'honeclaws', 'howl', 'poweruppunch', 'shiftgear', 'swordsdance',
		];
		// Moves which boost Special Attack:
		let SpecialSetup = [
			'calmmind', 'chargebeam', 'geomancy', 'nastyplot', 'quiverdance', 'tailglow',
		];
		// Moves which boost Attack AND Special Attack:
		let MixedSetup = [
			'conversion', 'growth', 'shellsmash', 'workup',
		];
		// Moves which boost Speed:
		let SpeedSetup = [
			'agility', 'autotomize', 'rockpolish',
		];
		// Moves that shouldn't be the only STAB moves:
		let NoStab = [
			'aquajet', 'bounce', 'explosion', 'fakeout', 'firstimpression', 'flamecharge', 'fly', 'iceshard', 'pursuit', 'quickattack', 'skyattack', 'suckerpunch',
			'chargebeam', 'clearsmog', 'eruption', 'vacuumwave', 'waterspout',
		];

		// Iterate through all moves we've chosen so far and keep track of what they do:
		for (const [k, moveId] of moves.entries()) {
			let move = this.getMove(moveId);
			let moveid = move.id;
			let movetype = move.type;
			if (moveid === 'judgment' || moveid === 'multiattack') movetype = Object.keys(hasType)[0];
			if (move.damage || move.damageCallback) {
				// Moves that do a set amount of damage:
				counter['damage']++;
				counter.damagingMoves.push(move);
				counter.damagingMoveIndex[moveid] = k;
			} else {
				// Are Physical/Special/Status moves:
				counter[move.category]++;
			}
			// Moves that have a low base power:
			if (moveid === 'lowkick' || (move.basePower && move.basePower <= 60 && moveid !== 'rapidspin')) counter['technician']++;
			// Moves that hit up to 5 times:
			if (move.multihit && Array.isArray(move.multihit) && move.multihit[1] === 5) counter['skilllink']++;
			if (move.recoil || move.hasCustomRecoil) counter['recoil']++;
			if (move.drain) counter['drain']++;
			// Conversion converts exactly one non-STAB into STAB
			if (moveid === 'conversion') {
				counter['stab']++;
				counter['adaptability']++;
			}
			// Moves which have a base power, but aren't super-weak like Rapid Spin:
			if (move.basePower > 30 || move.multihit || move.basePowerCallback || moveid === 'naturepower') {
				// @ts-ignore
				counter[movetype]++;
				if (hasType[movetype] || movetype === 'Normal' && (hasAbility['Aerilate'] || hasAbility['Galvanize'] || hasAbility['Pixilate'] || hasAbility['Refrigerate'])) {
					counter['adaptability']++;
					// STAB:
					// Certain moves aren't acceptable as a Pokemon's only STAB attack
					if (!NoStab.includes(moveid) && (moveid !== 'hiddenpower' || Object.keys(hasType).length === 1)) {
						counter['stab']++;
						// Ties between Physical and Special setup should broken in favor of STABs
						counter[move.category] += 0.1;
					}
				} else if (move.priority === 0 && hasAbility['Protean'] && !NoStab.includes(moveid)) {
					counter['stab']++;
				} else if (movetype === 'Steel' && hasAbility['Steelworker']) {
					counter['stab']++;
				}
				if (move.category === 'Physical') counter['hustle']++;
				if (move.flags['bite']) counter['bite']++;
				if (move.flags['punch']) counter['ironfist']++;
				counter.damagingMoves.push(move);
				counter.damagingMoveIndex[moveid] = k;
			}
			// Moves with secondary effects:
			if (move.secondary) {
				counter['sheerforce']++;
				if (move.secondary.chance && move.secondary.chance >= 20 && move.secondary.chance < 100) {
					counter['serenegrace']++;
				}
			}
			// Moves with low accuracy:
			if (move.accuracy && move.accuracy !== true && move.accuracy < 90) counter['inaccurate']++;
			// Moves with non-zero priority:
			if (move.category !== 'Status' && move.priority !== 0) counter['priority']++;

			// Moves that change stats:
			if (RecoveryMove.includes(moveid)) counter['recovery']++;
			if (ContraryMove.includes(moveid)) counter['contrary']++;
			if (PhysicalSetup.includes(moveid)) {
				counter['physicalsetup']++;
				counter.setupType = 'Physical';
			} else if (SpecialSetup.includes(moveid)) {
				counter['specialsetup']++;
				counter.setupType = 'Special';
			}
			if (MixedSetup.includes(moveid)) counter['mixedsetup']++;
			if (SpeedSetup.includes(moveid)) counter['speedsetup']++;
		}

		// Keep track of the available moves
		for (const moveid of movePool) {
			let move = this.getMove(moveid);
			if (move.damageCallback) continue;
			if (move.category === 'Physical') counter['physicalpool']++;
			if (move.category === 'Special') counter['specialpool']++;
		}

		// Choose a setup type:
		if (counter['mixedsetup']) {
			counter.setupType = 'Mixed';
		} else if (counter.setupType) {
			let pool = {
				Physical: counter.Physical + counter['physicalpool'],
				Special: counter.Special + counter['specialpool'],
			};
			if (counter['physicalsetup'] && counter['specialsetup']) {
				if (pool.Physical === pool.Special) {
					if (counter.Physical > counter.Special) counter.setupType = 'Physical';
					if (counter.Special > counter.Physical) counter.setupType = 'Special';
				} else {
					counter.setupType = pool.Physical > pool.Special ? 'Physical' : 'Special';
				}
			// @ts-ignore
			} else if (!pool[counter.setupType] || pool[counter.setupType] === 1 && (!moves.includes('rest') || !moves.includes('sleeptalk'))) {
				counter.setupType = '';
			}
		}
		counter['Physical'] = Math.floor(counter['Physical']);
		counter['Special'] = Math.floor(counter['Special']);

		return counter;
	}

	/**
	 * @param {string | Template} template
	 * @param {number} [slot]
	 * @param {RandomTeamsTypes["TeamDetails"]} [teamDetails]
	 * @param {boolean} [isDoubles]
	 * @return {RandomTeamsTypes["RandomSet"]}
	 */
	randomSet(template, slot = 1, teamDetails = {}, isDoubles = false) {
		template = this.getTemplate(template);
		let baseTemplate = template;
		let species = template.species;

		if (!template.exists || ((!isDoubles || !template.randomDoubleBattleMoves) && !template.randomBattleMoves && !template.learnset)) {
			// GET IT? UNOWN? BECAUSE WE CAN'T TELL WHAT THE POKEMON IS
			template = this.getTemplate('unown');

			let err = new Error('Template incompatible with random battles: ' + species);
			require('../lib/crashlogger')(err, 'The randbat set generator');
		}

		if (template.battleOnly) {
			// Only change the species. The template has custom moves, and may have different typing and requirements.
			species = template.baseSpecies;
		}
		let battleForme = this.checkBattleForme(template);
		if (battleForme && battleForme.randomBattleMoves && template.otherFormes && (battleForme.isMega ? !teamDetails.megaStone : this.random(2))) {
			template = this.getTemplate(template.otherFormes.length >= 2 ? this.sample(template.otherFormes) : template.otherFormes[0]);
		}

		const randMoves = !isDoubles ? template.randomBattleMoves : template.randomDoubleBattleMoves || template.randomBattleMoves;
		let movePool = (randMoves ? randMoves.slice() : template.learnset ? Object.keys(template.learnset) : []);
		/**@type {string[]} */
		let moves = [];
		let ability = '';
		let item = '';
		let evs = {
			hp: 85,
			atk: 85,
			def: 85,
			spa: 85,
			spd: 85,
			spe: 85,
		};
		let ivs = {
			hp: 31,
			atk: 31,
			def: 31,
			spa: 31,
			spd: 31,
			spe: 31,
		};
		/**@type {{[k: string]: true}} */
		let hasType = {};
		hasType[template.types[0]] = true;
		if (template.types[1]) {
			hasType[template.types[1]] = true;
		}
		/**@type {{[k: string]: true}} */
		let hasAbility = {};
		hasAbility[template.abilities[0]] = true;
		if (template.abilities[1]) {
			// @ts-ignore
			hasAbility[template.abilities[1]] = true;
		}
		if (template.abilities['H']) {
			// @ts-ignore
			hasAbility[template.abilities['H']] = true;
		}
		let availableHP = 0;
		for (const moveid of movePool) {
			if (moveid.startsWith('hiddenpower')) availableHP++;
		}

		// These moves can be used even if we aren't setting up to use them:
		let SetupException = ['closecombat', 'extremespeed', 'superpower', 'clangingscales', 'dracometeor', 'leafstorm', 'overheat'];

		let counterAbilities = ['Adaptability', 'Contrary', 'Hustle', 'Iron Fist', 'Skill Link'];
		let ateAbilities = ['Aerilate', 'Galvanize', 'Pixilate', 'Refrigerate'];

		/**@type {{[k: string]: boolean}} */
		let hasMove = {};
		let counter;

		do {
			// Keep track of all moves we have:
			hasMove = {};
			for (const moveid of moves) {
				if (moveid.startsWith('hiddenpower')) {
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moveid] = true;
				}
			}

			// Choose next 4 moves from learnset/viable moves and add them to moves list:
			while (moves.length < 4 && movePool.length) {
				let moveid = this.sampleNoReplace(movePool);
				if (moveid.startsWith('hiddenpower')) {
					availableHP--;
					if (hasMove['hiddenpower']) continue;
					hasMove['hiddenpower'] = true;
				} else {
					hasMove[moveid] = true;
				}
				moves.push(moveid);
			}

			counter = this.queryMoves(moves, hasType, hasAbility, movePool);

			// Iterate through the moves again, this time to cull them:
			for (const [k, moveId] of moves.entries()) {
				let move = this.getMove(moveId);
				let moveid = move.id;
				let rejected = false;
				let isSetup = false;

				switch (moveid) {
				// Not very useful without their supporting moves
				case 'clangingscales': case 'happyhour':
					if (teamDetails.zMove || hasMove['rest']) rejected = true;
					break;
				case 'cottonguard': case 'defendorder':
					if (!counter['recovery'] && !hasMove['rest']) rejected = true;
					break;
				case 'dig': case 'fly':
					if (teamDetails.zMove || counter.setupType !== 'Physical') rejected = true;
					break;
				case 'focuspunch':
					if (!hasMove['substitute'] || counter.damagingMoves.length < 2) rejected = true;
					break;
				case 'perishsong':
					if (!hasMove['protect']) rejected = true;
					break;
				case 'reflect':
					if (!hasMove['calmmind'] && !hasMove['lightscreen']) rejected = true;
					if (movePool.length > 1) {
						let screen = movePool.indexOf('lightscreen');
						if (screen >= 0) this.fastPop(movePool, screen);
					}
					break;
				case 'rest':
					if (movePool.includes('sleeptalk')) rejected = true;
					break;
				case 'sleeptalk':
					if (!hasMove['rest']) rejected = true;
					if (movePool.length > 1) {
						let rest = movePool.indexOf('rest');
						if (rest >= 0) this.fastPop(movePool, rest);
					}
					break;
				case 'storedpower':
					if (!counter.setupType && !hasMove['cosmicpower']) rejected = true;
					break;

				// Set up once and only if we have the moves for it
				case 'bellydrum': case 'bulkup': case 'coil': case 'curse': case 'dragondance': case 'honeclaws': case 'swordsdance':
					if (counter.setupType !== 'Physical' || counter['physicalsetup'] > 1) {
						if (!hasMove['growth'] || hasMove['sunnyday']) rejected = true;
					}
					if (counter.Physical + counter['physicalpool'] < 2 && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'calmmind': case 'geomancy': case 'nastyplot': case 'quiverdance': case 'tailglow':
					if (counter.setupType !== 'Special' || counter['specialsetup'] > 1) rejected = true;
					if (counter.Special + counter['specialpool'] < 2 && (!hasMove['rest'] || !hasMove['sleeptalk'])) rejected = true;
					isSetup = true;
					break;
				case 'growth': case 'shellsmash': case 'workup':
					if (counter.setupType !== 'Mixed' || counter['mixedsetup'] > 1) rejected = true;
					if (counter.damagingMoves.length + counter['physicalpool'] + counter['specialpool'] < 2) rejected = true;
					if (moveid === 'growth' && !hasMove['sunnyday']) rejected = true;
					isSetup = true;
					break;
				case 'agility': case 'autotomize': case 'rockpolish':
					if (counter.damagingMoves.length < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!counter.setupType) isSetup = true;
					break;
				case 'flamecharge':
					if (counter.damagingMoves.length < 3 && !counter.setupType) rejected = true;
					if (hasMove['dracometeor'] || hasMove['overheat']) rejected = true;
					break;
				case 'conversion':
					if (teamDetails.zMove || hasMove['triattack']) rejected = true;
					break;

				// Bad after setup
				case 'circlethrow': case 'dragontail':
					if (counter.setupType && ((!hasMove['rest'] && !hasMove['sleeptalk']) || hasMove['stormthrow'])) rejected = true;
					if (!!counter['speedsetup'] || hasMove['encore'] || hasMove['raindance'] || hasMove['roar'] || hasMove['whirlwind']) rejected = true;
					break;
				case 'defog':
					if (counter.setupType || hasMove['spikes'] || hasMove['stealthrock'] || (hasMove['rest'] && hasMove['sleeptalk']) || teamDetails.hazardClear) rejected = true;
					break;
				case 'fakeout':
					if (counter.setupType || hasMove['substitute'] || hasMove['switcheroo'] || hasMove['trick']) rejected = true;
					break;
				case 'foulplay':
					if (counter.setupType || !!counter['speedsetup'] || counter['Dark'] > 2 || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (counter.damagingMoves.length - 1 === counter['priority']) rejected = true;
					break;
				case 'haze': case 'spikes': case 'waterspout':
					if (counter.setupType || !!counter['speedsetup'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					break;
				case 'healbell':
					if (counter['speedsetup']) rejected = true;
					break;
				case 'healingwish': case 'memento':
					if (counter.setupType || !!counter['recovery'] || hasMove['substitute']) rejected = true;
					break;
				case 'leechseed': case 'roar': case 'whirlwind':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['dragontail']) rejected = true;
					break;
				case 'nightshade': case 'seismictoss': case 'superfang':
					if (counter.damagingMoves.length > 1 || counter.setupType) rejected = true;
					break;
				case 'protect':
					if (counter.setupType && !hasMove['wish']) rejected = true;
					if (hasMove['rest'] || hasMove['lightscreen'] && hasMove['reflect']) rejected = true;
					break;
				case 'pursuit':
					if (counter.setupType || (hasMove['rest'] && hasMove['sleeptalk']) || (hasMove['knockoff'] && !hasType['Dark'])) rejected = true;
					break;
				case 'rapidspin':
					if (counter.setupType || teamDetails.hazardClear) rejected = true;
					break;
				case 'reversal':
					if (hasMove['substitute'] && teamDetails.zMove) rejected = true;
					break;
				case 'stealthrock':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['rest'] || teamDetails.stealthRock) rejected = true;
					break;
				case 'switcheroo': case 'trick':
					if (counter.Physical + counter.Special < 3 || counter.setupType) rejected = true;
					if (hasMove['acrobatics'] || hasMove['lightscreen'] || hasMove['reflect'] || hasMove['suckerpunch'] || hasMove['trickroom']) rejected = true;
					break;
				case 'toxicspikes':
					if (counter.setupType || teamDetails.toxicSpikes) rejected = true;
					break;
				case 'trickroom':
					if (counter.setupType || !!counter['speedsetup'] || counter.damagingMoves.length < 2) rejected = true;
					if (hasMove['lightscreen'] || hasMove['reflect']) rejected = true;
					break;
				case 'uturn':
					if (counter.setupType || !!counter['speedsetup'] || hasAbility['Protean'] && counter.Status > 2) rejected = true;
					if (hasType['Bug'] && counter.stab < 2 && counter.damagingMoves.length > 2 && !hasAbility['Adaptability'] && !hasMove['technoblast']) rejected = true;
					break;
				case 'voltswitch':
					if (counter.setupType || !!counter['speedsetup'] || hasMove['magnetrise'] || hasMove['uturn']) rejected = true;
					break;

				// Bit redundant to have both
				// Attacks:
				case 'bugbite': case 'bugbuzz': case 'signalbeam':
					if (hasMove['uturn'] && !counter.setupType) rejected = true;
					break;
				case 'lunge':
					if (hasMove['leechlife']) rejected = true;
					break;
				case 'darkestlariat': case 'nightslash':
					if (hasMove['knockoff'] || hasMove['pursuit']) rejected = true;
					break;
				case 'darkpulse':
					if (hasMove['shadowball']) rejected = true;
					if ((hasMove['crunch'] || hasMove['hyperspacefury']) && counter.setupType !== 'Special') rejected = true;
					break;
				case 'suckerpunch':
					if (counter['Dark'] > 1 && !hasType['Dark']) rejected = true;
					if (counter.damagingMoves.length < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'dragonclaw':
					if (hasMove['dragontail'] || hasMove['outrage']) rejected = true;
					break;
				case 'dracometeor':
					if (hasMove['swordsdance'] || counter.setupType === 'Physical' && hasMove['outrage']) rejected = true;
					break;
				case 'dragonpulse': case 'spacialrend':
					if (hasMove['dracometeor'] || hasMove['outrage']) rejected = true;
					break;
				case 'outrage':
					if (hasMove['dracometeor'] && counter.damagingMoves.length < 3) rejected = true;
					if (hasMove['clangingscales'] && !teamDetails.zMove) rejected = true;
					break;
				case 'chargebeam':
					if (hasMove['thunderbolt'] && counter.Special < 3) rejected = true;
					break;
				case 'thunder':
					if (hasMove['thunderbolt'] && !hasMove['raindance']) rejected = true;
					break;
				case 'thunderbolt':
					if (hasMove['discharge'] || (hasMove['raindance'] && hasMove['thunder']) || (hasMove['voltswitch'] && hasMove['wildcharge'])) rejected = true;
					break;
				case 'thunderpunch':
					if (hasAbility['Galvanize'] && !!counter['Normal']) rejected = true;
					break;
				case 'dazzlinggleam':
					if (hasMove['playrough'] && counter.setupType !== 'Special') rejected = true;
					break;
				case 'drainingkiss':
					if (hasMove['dazzlinggleam'] || counter.setupType !== 'Special' && !hasAbility['Triage']) rejected = true;
					break;
				case 'moonblast':
					if (isDoubles && hasMove['dazzlinggleam']) rejected = true;
					break;
				case 'aurasphere': case 'focusblast':
					if ((hasMove['closecombat'] || hasMove['superpower']) && counter.setupType !== 'Special') rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'drainpunch':
					if (!hasMove['bulkup'] && (hasMove['closecombat'] || hasMove['highjumpkick'])) rejected = true;
					if ((hasMove['focusblast'] || hasMove['superpower']) && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'closecombat': case 'highjumpkick':
					if ((hasMove['aurasphere'] || hasMove['focusblast'] || movePool.includes('aurasphere')) && counter.setupType === 'Special') rejected = true;
					if (hasMove['bulkup'] && hasMove['drainpunch']) rejected = true;
					break;
				case 'machpunch':
					if (hasType['Fighting'] && counter.stab < 2 && !hasAbility['Technician']) rejected = true;
					break;
				case 'stormthrow':
					if (hasMove['circlethrow'] && hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'superpower':
					if (counter['Fighting'] > 1 && counter.setupType) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'vacuumwave':
					if ((hasMove['closecombat'] || hasMove['machpunch']) && counter.setupType !== 'Special') rejected = true;
					break;
				case 'fierydance': case 'firefang': case 'firepunch': case 'flamethrower': case 'flareblitz':
					if (hasMove['blazekick'] || hasMove['heatwave'] || hasMove['overheat'] || hasMove['sacredfire']) rejected = true;
					if (hasMove['fireblast'] && counter.setupType !== 'Physical' && !hasAbility['Reckless']) rejected = true;
					break;
				case 'fireblast':
					if (hasMove['lavaplume'] && !counter.setupType && !counter['speedsetup']) rejected = true;
					if (hasMove['mindblown'] && counter.setupType) rejected = true;
					if (hasMove['flareblitz'] && hasAbility['Reckless']) rejected = true;
					break;
				case 'lavaplume':
					if (hasMove['firepunch'] || hasMove['fireblast'] && (counter.setupType || !!counter['speedsetup'])) rejected = true;
					break;
				case 'overheat':
					if (hasMove['fireblast'] || hasMove['lavaplume'] || counter.setupType === 'Special') rejected = true;
					break;
				case 'acrobatics':
					if (hasMove['hurricane'] && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'airslash':
					if (hasMove['acrobatics'] || hasMove['bravebird'] || hasMove['hurricane']) rejected = true;
					break;
				case 'hex':
					if (!hasMove['willowisp']) rejected = true;
					break;
				case 'shadowball':
					if (hasMove['hex'] && hasMove['willowisp']) rejected = true;
					break;
				case 'shadowclaw':
					if (hasMove['phantomforce'] || hasMove['shadowforce'] || hasMove['shadowsneak']) rejected = true;
					if (hasMove['shadowball'] && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'shadowsneak':
					if (hasType['Ghost'] && template.types.length > 1 && counter.stab < 2) rejected = true;
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'gigadrain':
					if (hasMove['petaldance'] || hasMove['powerwhip'] || (hasMove['seedbomb'] && !isDoubles)) rejected = true;
					if (counter.Special < 4 && !counter.setupType && hasMove['leafstorm']) rejected = true;
					break;
				case 'leafblade': case 'woodhammer':
					if (hasMove['gigadrain'] && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'leafstorm':
					if (counter['Grass'] > 1 && counter.setupType) rejected = true;
					break;
				case 'seedbomb':
					if (isDoubles && hasMove['gigadrain']) rejected = true;
					break;
				case 'solarbeam':
					if ((!hasAbility['Drought'] && !hasMove['sunnyday']) || hasMove['gigadrain'] || hasMove['leafstorm']) rejected = true;
					break;
				case 'bonemerang': case 'precipiceblades':
					if (hasMove['earthquake']) rejected = true;
					break;
				case 'earthpower':
					if (hasMove['earthquake'] && counter.setupType !== 'Special') rejected = true;
					break;
				case 'icebeam':
					if (hasMove['blizzard'] || hasMove['freezedry']) rejected = true;
					break;
				case 'iceshard':
					if (hasMove['freezedry']) rejected = true;
					break;
				case 'bodyslam':
					if (hasMove['glare'] && hasMove['headbutt']) rejected = true;
					break;
				case 'endeavor':
					if (slot > 0) rejected = true;
					break;
				case 'explosion':
					if (counter.setupType || (hasAbility['Refrigerate'] && hasMove['freezedry']) || hasMove['wish']) rejected = true;
					break;
				case 'extremespeed':
					if (counter.setupType !== 'Physical' && hasMove['vacuumwave']) rejected = true;
					break;
				case 'facade':
					if (hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					break;
				case 'hiddenpower':
					if (hasMove['rest'] || !counter.stab && counter.damagingMoves.length < 2) rejected = true;
					break;
				case 'hypervoice':
					if (hasMove['blizzard'] || hasMove['naturepower'] || hasMove['return']) rejected = true;
					break;
				case 'judgment':
					if (counter.setupType !== 'Special' && counter.stab > 1) rejected = true;
					break;
				case 'quickattack':
					if (hasType['Normal'] && (!counter.stab || counter['Normal'] > 2)) rejected = true;
					if (hasMove['feint']) rejected = true;
					break;
				case 'return': case 'rockclimb':
					if (hasMove['bodyslam'] || hasMove['doubleedge']) rejected = true;
					break;
				case 'weatherball':
					if (!hasMove['raindance'] && !hasMove['sunnyday']) rejected = true;
					break;
				case 'acidspray':
					if (hasMove['sludgebomb'] || counter.Special < 2) rejected = true;
					break;
				case 'poisonjab':
					if (hasMove['gunkshot']) rejected = true;
					break;
				case 'sludgewave':
					if (hasMove['poisonjab']) rejected = true;
					break;
				case 'photongeyser': case 'psychic':
					if (hasMove['psyshock'] || counter.setupType === 'Special' && hasMove['storedpower']) rejected = true;
					break;
				case 'psychocut': case 'zenheadbutt':
					if ((hasMove['psychic'] || hasMove['psyshock']) && counter.setupType !== 'Physical') rejected = true;
					break;
				case 'psyshock':
					if (movePool.length > 1) {
						let psychic = movePool.indexOf('psychic');
						if (psychic >= 0) this.fastPop(movePool, psychic);
					}
					break;
				case 'headsmash':
					if (hasMove['stoneedge'] || isDoubles && hasMove['rockslide']) rejected = true;
					break;
				case 'rockblast': case 'rockslide':
					if ((hasMove['headsmash'] || hasMove['stoneedge']) && !isDoubles) rejected = true;
					break;
				case 'stoneedge':
					if (isDoubles && hasMove['rockslide']) rejected = true;
					break;
				case 'bulletpunch':
					if (hasType['Steel'] && counter.stab < 2 && !hasAbility['Adaptability'] && !hasAbility['Technician']) rejected = true;
					break;
				case 'flashcannon':
					if (hasMove['ironhead'] || hasMove['meteormash']) rejected = true;
					break;
				case 'hydropump':
					if (hasMove['liquidation'] || hasMove['razorshell'] || hasMove['waterfall'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (hasMove['scald'] && (counter.Special < 4 || template.types.length > 1 && counter.stab < 3)) rejected = true;
					break;
				case 'originpulse': case 'surf':
					if (hasMove['hydropump'] || hasMove['scald']) rejected = true;
					break;
				case 'scald':
					if (hasMove['liquidation'] || hasMove['waterfall'] || hasMove['waterpulse']) rejected = true;
					break;

				// Status:
				case 'electroweb': case 'stunspore': case 'thunderwave':
					if (counter.setupType || !!counter['speedsetup'] || (hasMove['rest'] && hasMove['sleeptalk'])) rejected = true;
					if (hasMove['discharge'] || hasMove['gyroball'] || hasMove['spore'] || hasMove['toxic'] || hasMove['trickroom'] || hasMove['yawn']) rejected = true;
					break;
				case 'toxic':
					if (counter.setupType || hasMove['flamecharge'] || hasMove['hypnosis'] || hasMove['sleeppowder'] || hasMove['willowisp'] || hasMove['yawn']) rejected = true;
					break;
				case 'willowisp':
					if (hasMove['scald']) rejected = true;
					break;
				case 'raindance':
					if (counter.Physical + counter.Special < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!hasType['Water'] && !hasMove['thunder']) rejected = true;
					break;
				case 'sunnyday':
					if (counter.Physical + counter.Special < 2 || hasMove['rest'] && hasMove['sleeptalk']) rejected = true;
					if (!hasAbility['Chlorophyll'] && !hasAbility['Flower Gift'] && !hasMove['solarbeam']) rejected = true;
					if (rejected && movePool.length > 1) {
						let solarbeam = movePool.indexOf('solarbeam');
						if (solarbeam >= 0) this.fastPop(movePool, solarbeam);
						if (movePool.length > 1) {
							let weatherball = movePool.indexOf('weatherball');
							if (weatherball >= 0) this.fastPop(movePool, weatherball);
						}
					}
					break;
				case 'milkdrink': case 'moonlight': case 'painsplit': case 'recover': case 'roost': case 'softboiled': case 'synthesis':
					if (hasMove['leechseed'] || hasMove['rest'] || hasMove['wish']) rejected = true;
					break;
				case 'safeguard':
					if (hasMove['destinybond']) rejected = true;
					break;
				case 'substitute':
					if (hasMove['dracometeor'] || (hasMove['leafstorm'] && !hasAbility['Contrary']) || hasMove['pursuit'] || hasMove['rest'] || hasMove['taunt'] || hasMove['uturn'] || hasMove['voltswitch']) rejected = true;
					break;
				case 'powersplit':
					if (hasMove['guardsplit']) rejected = true;
					break;
				case 'wideguard':
					if (hasMove['protect']) rejected = true;
					break;
				}

				// Increased/decreased priority moves are unneeded with moves that boost only speed
				if (move.priority !== 0 && (!!counter['speedsetup'] || hasMove['copycat'])) {
					rejected = true;
				}

				// Certain Pokemon should always have a recovery move
				if (!counter.recovery && template.baseStats.hp >= 165 && movePool.includes('wish')) {
					if (move.category === 'Status' || !hasType[move.type] && !move.damage) rejected = true;
				}
				if (template.nfe && !isSetup && !counter.recovery && !!counter['Status'] && (movePool.includes('recover') || movePool.includes('roost'))) {
					if (move.category === 'Status' || !hasType[move.type]) rejected = true;
				}

				// This move doesn't satisfy our setup requirements:
				if ((move.category === 'Physical' && counter.setupType === 'Special') || (move.category === 'Special' && counter.setupType === 'Physical')) {
					// Reject STABs last in case the setup type changes later on
					if (!SetupException.includes(moveid) && (!hasType[move.type] || counter.stab > 1 || counter[move.category] < 2)) rejected = true;
				}
				// @ts-ignore
				if (counter.setupType && !isSetup && counter.setupType !== 'Mixed' && move.category !== counter.setupType && counter[counter.setupType] < 2 && moveid !== 'rest' && moveid !== 'sleeptalk') {
					// Mono-attacking with setup and RestTalk is allowed
					// Reject Status moves only if there is nothing else to reject
					// @ts-ignore
					if (move.category !== 'Status' || counter[counter.setupType] + counter.Status > 3 && counter['physicalsetup'] + counter['specialsetup'] < 2) rejected = true;
				}
				if (counter.setupType === 'Special' && moveid === 'hiddenpower' && template.types.length > 1 && counter['Special'] <= 2 && !hasType[move.type] && !counter['Physical'] && counter['specialpool']) {
					// Hidden Power isn't good enough
					rejected = true;
				}

				// Pokemon should have moves that benefit their Type/Ability/Weather, as well as moves required by its forme
				// @ts-ignore
				if (!rejected && (counter['physicalsetup'] + counter['specialsetup'] < 2 && (!counter.setupType || counter.setupType === 'Mixed' || (move.category !== counter.setupType && move.category !== 'Status') || counter[counter.setupType] + counter.Status > 3)) &&
					((counter.damagingMoves.length === 0 && !hasMove['metalburst']) ||
					(!counter.stab && (counter.Status < 2 || counter.setupType || template.types.length > 1 || (template.types[0] !== 'Normal' && template.types[0] !== 'Psychic') || !hasMove['icebeam']) && (counter['physicalpool'] || counter['specialpool'])) ||
					(hasType['Bug'] && (movePool.includes('megahorn') || movePool.includes('pinmissile') || (hasType['Flying'] && !hasMove['hurricane'] && movePool.includes('bugbuzz')))) ||
					((hasType['Dark'] && !counter['Dark']) || hasMove['suckerpunch'] && counter.stab < template.types.length) ||
					(hasType['Dragon'] && !counter['Dragon'] && !hasAbility['Aerilate'] && !hasAbility['Pixilate'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
					(hasType['Electric'] && !counter['Electric'] && !hasAbility['Galvanize']) ||
					(hasType['Fighting'] && !counter['Fighting'] && (counter.setupType || !counter['Status'])) ||
					(hasType['Fire'] && !counter['Fire']) ||
					(hasType['Ghost'] && !hasType['Dark'] && !counter['Ghost'] && !hasAbility['Steelworker']) ||
					(hasType['Ground'] && !counter['Ground'] && !hasMove['rest'] && !hasMove['sleeptalk']) ||
					(hasType['Ice'] && !counter['Ice'] && !hasAbility['Refrigerate']) ||
					(hasType['Psychic'] && !!counter['Psychic'] && !hasType['Flying'] && !hasAbility['Pixilate'] && template.types.length > 1 && counter.stab < 2) ||
					(((hasType['Steel'] && hasAbility['Technician']) || hasAbility['Steelworker']) && !counter['Steel']) ||
					(hasType['Water'] && (!counter['Water'] || !counter.stab) && !hasAbility['Protean']) ||
					// @ts-ignore
					((hasAbility['Adaptability'] && !counter.setupType && template.types.length > 1 && (!counter[template.types[0]] || !counter[template.types[1]])) ||
					((hasAbility['Aerilate'] || (hasAbility['Galvanize'] && !counter['Electric']) || hasAbility['Pixilate'] || (hasAbility['Refrigerate'] && !hasMove['blizzard'])) && !counter['Normal']) ||
					(hasAbility['Contrary'] && !counter['contrary'] && template.species !== 'Shuckle') ||
					(hasAbility['Dark Aura'] && !counter['Dark']) ||
					(hasAbility['Gale Wings'] && !counter['Flying']) ||
					(hasAbility['Grassy Surge'] && !counter['Grass']) ||
					(hasAbility['Guts'] && hasType['Normal'] && movePool.includes('facade')) ||
					(hasAbility['Psychic Surge'] && !counter['Psychic']) ||
					(hasAbility['Slow Start'] && movePool.includes('substitute')) ||
					(hasAbility['Stance Change'] && !counter.setupType && movePool.includes('kingsshield')) ||
					(movePool.includes('technoblast') || template.requiredMove && movePool.includes(toId(template.requiredMove)))))) {
					// Reject Status or non-STAB
					if (!isSetup && !move.weather && moveid !== 'judgment' && moveid !== 'rest' && moveid !== 'sleeptalk' && moveid !== 'technoblast') {
						if (move.category === 'Status' || !hasType[move.type] || move.selfSwitch || move.basePower && move.basePower < 40 && !move.multihit) rejected = true;
					}
				}

				// Sleep Talk shouldn't be selected without Rest
				if (moveid === 'rest' && rejected) {
					let sleeptalk = movePool.indexOf('sleeptalk');
					if (sleeptalk >= 0) {
						if (movePool.length < 2) {
							rejected = false;
						} else {
							this.fastPop(movePool, sleeptalk);
						}
					}
				}

				// Remove rejected moves from the move list
				if (rejected && (movePool.length - availableHP || availableHP && (moveid === 'hiddenpower' || !hasMove['hiddenpower']))) {
					moves.splice(k, 1);
					break;
				}
			}
		} while (moves.length < 4 && movePool.length);

		// Moveset modifications
		if (hasMove['autotomize'] && hasMove['heavyslam']) {
			if (template.id === 'celesteela') {
				moves[moves.indexOf('heavyslam')] = 'flashcannon';
			} else {
				moves[moves.indexOf('autotomize')] = 'rockpolish';
			}
		}
		if (moves[0] === 'conversion') {
			moves[0] = moves[3];
			moves[3] = 'conversion';
		}

		/**@type {[string, string | undefined, string | undefined]} */
		// @ts-ignore
		let abilities = Object.values(baseTemplate.abilities);
		abilities.sort((a, b) => this.getAbility(b).rating - this.getAbility(a).rating);
		let ability0 = this.getAbility(abilities[0]);
		let ability1 = this.getAbility(abilities[1]);
		let ability2 = this.getAbility(abilities[2]);
		if (abilities[1]) {
			if (abilities[2] && ability1.rating <= ability2.rating && this.randomChance(1, 2)) {
				[ability1, ability2] = [ability2, ability1];
			}
			if (ability0.rating <= ability1.rating && this.randomChance(1, 2)) {
				[ability0, ability1] = [ability1, ability0];
			} else if (ability0.rating - 0.6 <= ability1.rating && this.randomChance(2, 3)) {
				[ability0, ability1] = [ability1, ability0];
			}
			ability = ability0.name;

			let rejectAbility;
			do {
				rejectAbility = false;
				if (counterAbilities.includes(ability)) {
					// Adaptability, Contrary, Hustle, Iron Fist, Skill Link
					// @ts-ignore
					rejectAbility = !counter[toId(ability)];
				} else if (ateAbilities.includes(ability)) {
					rejectAbility = !counter['Normal'];
				} else if (ability === 'Blaze') {
					rejectAbility = !counter['Fire'];
				} else if (ability === 'Chlorophyll') {
					rejectAbility = !hasMove['sunnyday'] && !teamDetails['sun'];
				} else if (ability === 'Competitive') {
					rejectAbility = !counter['Special'] || (hasMove['rest'] && hasMove['sleeptalk']);
				} else if (ability === 'Compound Eyes' || ability === 'No Guard') {
					rejectAbility = !counter['inaccurate'];
				} else if (ability === 'Defiant' || ability === 'Moxie') {
					rejectAbility = !counter['Physical'];
				} else if (ability === 'Flare Boost' || ability === 'Moody') {
					rejectAbility = true;
				} else if (ability === 'Gluttony') {
					rejectAbility = !hasMove['bellydrum'];
				} else if (ability === 'Hydration' || ability === 'Rain Dish' || ability === 'Swift Swim') {
					rejectAbility = !hasMove['raindance'] && !teamDetails['rain'];
				} else if (ability === 'Ice Body' || ability === 'Slush Rush' || ability === 'Snow Cloak') {
					rejectAbility = !teamDetails['hail'];
				} else if (ability === 'Lightning Rod') {
					rejectAbility = template.types.includes('Ground');
				} else if (ability === 'Limber') {
					rejectAbility = template.types.includes('Electric');
				} else if (ability === 'Liquid Voice') {
					rejectAbility = !hasMove['hypervoice'];
				} else if (ability === 'Overgrow') {
					rejectAbility = !counter['Grass'];
				} else if (ability === 'Poison Heal') {
					rejectAbility = abilities.includes('Technician') && !!counter['technician'];
				} else if (ability === 'Power Construct') {
					rejectAbility = template.forme === '10%' && !hasMove['substitute'];
				} else if (ability === 'Prankster') {
					rejectAbility = !counter['Status'];
				} else if (ability === 'Pressure' || ability === 'Synchronize') {
					rejectAbility = counter.Status < 2;
				} else if (ability === 'Regenerator') {
					rejectAbility = abilities.includes('Magic Guard');
				} else if (ability === 'Quick Feet') {
					rejectAbility = hasMove['bellydrum'];
				} else if (ability === 'Reckless' || ability === 'Rock Head') {
					rejectAbility = !counter['recoil'];
				} else if (ability === 'Sand Force' || ability === 'Sand Rush' || ability === 'Sand Veil') {
					rejectAbility = !teamDetails['sand'];
				} else if (ability === 'Scrappy') {
					rejectAbility = !template.types.includes('Normal');
				} else if (ability === 'Serene Grace') {
					rejectAbility = !counter['serenegrace'] || template.species === 'Blissey' || template.species === 'Togetic';
				} else if (ability === 'Sheer Force') {
					rejectAbility = !counter['sheerforce'] || template.isMega || (abilities.includes('Iron Fist') && counter['ironfist'] > counter['sheerforce']);
				} else if (ability === 'Simple') {
					rejectAbility = !counter.setupType && !hasMove['cosmicpower'] && !hasMove['flamecharge'];
				} else if (ability === 'Snow Warning') {
					rejectAbility = hasMove['hypervoice'];
				} else if (ability === 'Solar Power') {
					rejectAbility = !counter['Special'] || template.isMega;
				} else if (ability === 'Strong Jaw') {
					rejectAbility = !counter['bite'];
				} else if (ability === 'Sturdy') {
					rejectAbility = !!counter['recoil'] && !counter['recovery'];
				} else if (ability === 'Swarm') {
					rejectAbility = !counter['Bug'];
				} else if (ability === 'Technician') {
					rejectAbility = !counter['technician'] || (abilities.includes('Skill Link') && counter['skilllink'] >= counter['technician']);
				} else if (ability === 'Tinted Lens') {
					rejectAbility = counter['damage'] >= counter.damagingMoves.length || (counter.Status > 2 && !counter.setupType);
				} else if (ability === 'Torrent') {
					rejectAbility = !counter['Water'];
				} else if (ability === 'Triage') {
					rejectAbility = !counter['recovery'] && !counter['drain'];
				} else if (ability === 'Unburden') {
					rejectAbility = template.isMega || (!counter.setupType && !hasMove['acrobatics']);
				} else if (ability === 'Water Absorb') {
					rejectAbility = abilities.includes('Volt Absorb') || (abilities.includes('Water Bubble') && !!counter['Water']);
				}

				if (rejectAbility) {
					if (ability === ability0.name && ability1.rating > 1) {
						ability = ability1.name;
					} else if (ability === ability1.name && abilities[2] && ability2.rating > 1) {
						ability = ability2.name;
					} else {
						// Default to the highest rated ability if all are rejected
						ability = abilities[0];
						rejectAbility = false;
					}
				}
			} while (rejectAbility);

			if (abilities.includes('Galvanize') && !!counter['Normal']) {
				ability = 'Galvanize';
			} else if (abilities.includes('Guts') && ability !== 'Quick Feet' && (hasMove['facade'] || hasMove['protect'] || (hasMove['rest'] && hasMove['sleeptalk']))) {
				ability = 'Guts';
			} else if (abilities.includes('Prankster') && counter.Status > 1) {
				ability = 'Prankster';
			} else if (abilities.includes('Swift Swim') && hasMove['raindance']) {
				ability = 'Swift Swim';
			} else if (abilities.includes('Triage') && !!counter['drain']) {
				ability = 'Triage';
			} else if (abilities.includes('Unburden') && hasMove['acrobatics']) {
				ability = 'Unburden';
			} else if (isDoubles && abilities.includes('Intimidate')) {
				ability = 'Intimidate';
			}

			if (template.species === 'Ambipom' && !counter['technician']) {
				// If it doesn't qualify for Technician, Skill Link is useless on it
				ability = 'Pickup';
			} else if (template.baseSpecies === 'Basculin') {
				ability = 'Adaptability';
			} else if (template.species === 'Lopunny' && hasMove['switcheroo'] && this.randomChance(2, 3)) {
				ability = 'Klutz';
			} else if ((template.species === 'Rampardos' && !hasMove['headsmash']) || hasMove['rockclimb']) {
				ability = 'Sheer Force';
			} else if (template.species === 'Torterra' && !counter['Grass']) {
				ability = 'Shell Armor';
			} else if (template.species === 'Umbreon') {
				ability = 'Synchronize';
			} else if (template.id === 'venusaurmega') {
				ability = 'Chlorophyll';
			}
		} else {
			ability = ability0.name;
		}

		item = !isDoubles ? 'Leftovers' : 'Sitrus Berry';
		if (template.requiredItems) {
			// @ts-ignore
			if (template.baseSpecies === 'Arceus' && (hasMove['judgment'] || !counter[template.types[0]])) {
				// Judgment doesn't change type with Z-Crystals
				item = template.requiredItems[0];
			} else {
				item = this.sample(template.requiredItems);
			}
		} else if (hasMove['magikarpsrevenge']) {
			// PoTD Magikarp
			item = 'Choice Band';

		// First, the extra high-priority items
		} else if (template.species === 'Clamperl' && !hasMove['shellsmash']) {
			item = 'Deep Sea Tooth';
		} else if (template.species === 'Cubone' || template.baseSpecies === 'Marowak') {
			item = 'Thick Club';
		} else if (template.species === 'Decidueye' && hasMove['spiritshackle'] && counter.setupType && !teamDetails.zMove) {
			item = 'Decidium Z';
		} else if (template.species === 'Dedenne') {
			item = 'Petaya Berry';
		} else if (template.species === 'Deoxys-Attack') {
			item = (slot === 0 && hasMove['stealthrock']) ? 'Focus Sash' : 'Life Orb';
		} else if (template.species === 'Farfetch\'d') {
			item = 'Stick';
		} else if (template.species === 'Kommo-o' && !teamDetails.zMove) {
			item = hasMove['clangingscales'] ? 'Kommonium Z' : 'Dragonium Z';
		} else if (template.species === 'Lycanroc' && hasMove['stoneedge'] && counter.setupType && !teamDetails.zMove) {
			item = 'Lycanium Z';
		} else if (template.species === 'Marshadow' && hasMove['spectralthief'] && counter.setupType && !teamDetails.zMove) {
			item = 'Marshadium Z';
		} else if (template.species === 'Mimikyu' && hasMove['playrough'] && counter.setupType && !teamDetails.zMove) {
			item = 'Mimikium Z';
		} else if ((template.species === 'Necrozma-Dusk-Mane' || template.species === 'Necrozma-Dawn-Wings') && !teamDetails.zMove) {
			if (hasMove['autotomize'] && hasMove['sunsteelstrike']) {
				item = 'Solganium Z';
			} else if (hasMove['trickroom'] && hasMove['moongeistbeam']) {
				item = 'Lunalium Z';
			} else {
				item = 'Ultranecrozium Z';
				if (!hasMove['photongeyser']) {
					for (const moveid of moves) {
						let move = this.getMove(moveid);
						if (move.category === 'Status' || hasType[move.type]) continue;
						moves[moves.indexOf(moveid)] = 'photongeyser';
						break;
					}
				}
			}
		} else if (template.baseSpecies === 'Pikachu') {
			item = 'Light Ball';
		} else if (template.species === 'Raichu-Alola' && hasMove['thunderbolt'] && !teamDetails.zMove && this.randomChance(1, 4)) {
			item = 'Aloraichium Z';
		} else if (template.species === 'Shedinja' || template.species === 'Smeargle') {
			item = 'Focus Sash';
		} else if (template.species === 'Unfezant' && counter['Physical'] >= 2) {
			item = 'Scope Lens';
		} else if (template.species === 'Unown') {
			item = 'Choice Specs';
		} else if (template.species === 'Wobbuffet') {
			if (hasMove['destinybond']) {
				item = 'Custap Berry';
			} else {
				item = isDoubles || this.randomChance(1, 2) ? 'Sitrus Berry' : 'Leftovers';
			}
		} else if (template.species === 'Zygarde-10%' && hasMove['substitute'] && !teamDetails.zMove) {
			item = hasMove['outrage'] ? 'Dragonium Z' : 'Groundium Z';
		} else if (ability === 'Imposter') {
			item = 'Choice Scarf';
		} else if (hasMove['geomancy']) {
			item = 'Power Herb';
		} else if (ability === 'Klutz' && hasMove['switcheroo']) {
			// To perma-taunt a Pokemon by giving it Assault Vest
			item = 'Assault Vest';
		} else if (hasMove['switcheroo'] || hasMove['trick']) {
			if (template.baseStats.spe >= 60 && template.baseStats.spe <= 108) {
				item = 'Choice Scarf';
			} else {
				item = (counter.Physical > counter.Special) ? 'Choice Band' : 'Choice Specs';
			}
		} else if (hasMove['conversion'] || hasMove['happyhour']) {
			item = 'Normalium Z';
		} else if (hasMove['dig'] && !teamDetails.zMove) {
			item = 'Groundium Z';
		} else if (hasMove['mindblown'] && !!counter['Status'] && !teamDetails.zMove) {
			item = 'Firium Z';
		} else if (!teamDetails.zMove && (hasMove['fly'] || ((hasMove['bounce'] || (hasAbility['Gale Wings'] && hasMove['bravebird'])) && counter.setupType))) {
			item = 'Flyinium Z';
		} else if (hasMove['solarbeam'] && !hasAbility['Drought'] && !hasMove['sunnyday'] && !teamDetails['sun']) {
			item = !teamDetails.zMove ? 'Grassium Z' : 'Power Herb';
		} else if (template.evos.length) {
			item = (ability === 'Technician' && counter.Physical >= 4) ? 'Choice Band' : 'Eviolite';
		} else if (template.species === 'Latias' || template.species === 'Latios') {
			item = 'Soul Dew';
		} else if (hasMove['bellydrum']) {
			if (ability === 'Gluttony') {
				item = this.sample(['Aguav', 'Figy', 'Iapapa', 'Mago', 'Wiki']) + ' Berry';
			} else if (template.baseStats.spe <= 50 && !teamDetails.zMove && this.randomChance(1, 2)) {
				item = 'Normalium Z';
			} else {
				item = 'Sitrus Berry';
			}
		} else if (hasMove['shellsmash']) {
			item = (ability === 'Solid Rock' && counter['priority']) ? 'Weakness Policy' : 'White Herb';
		} else if (ability === 'Harvest') {
			item = hasMove['rest'] ? 'Lum Berry' : 'Sitrus Berry';
		} else if ((ability === 'Magic Guard' || ability === 'Sheer Force') && counter.damagingMoves.length > 1) {
			item = 'Life Orb';
		} else if (ability === 'Poison Heal' || ability === 'Toxic Boost') {
			item = 'Toxic Orb';
		} else if (hasMove['rest'] && !hasMove['sleeptalk'] && ability !== 'Natural Cure' && ability !== 'Shed Skin') {
			item = (hasMove['raindance'] && ability === 'Hydration') ? 'Damp Rock' : 'Chesto Berry';
		} else if (hasMove['raindance']) {
			item = (ability === 'Swift Swim' && counter.Status < 2) ? 'Life Orb' : 'Damp Rock';
		} else if (hasMove['sunnyday']) {
			item = (ability === 'Chlorophyll' && counter.Status < 2) ? 'Life Orb' : 'Heat Rock';
		} else if (hasMove['auroraveil'] || hasMove['lightscreen'] && hasMove['reflect']) {
			item = 'Light Clay';
		} else if (hasMove['psychoshift'] || (ability === 'Guts' || hasMove['facade']) && !hasMove['sleeptalk']) {
			item = (hasType['Fire'] || ability === 'Quick Feet') ? 'Toxic Orb' : 'Flame Orb';
		} else if (ability === 'Unburden') {
			if (hasMove['fakeout']) {
				item = 'Normal Gem';
			} else {
				item = 'Sitrus Berry';
			}
		} else if (hasMove['acrobatics']) {
			item = '';

		// Medium priority
		} else if (((ability === 'Speed Boost' && !hasMove['substitute']) || (ability === 'Stance Change')) && counter.Physical + counter.Special > 2) {
			item = 'Life Orb';
		} else if (hasType['Grass'] && template.baseStats.spe <= 70 && hasMove['sleeppowder'] && counter.setupType && !teamDetails.zMove) {
			item = 'Grassium Z';
		} else if (counter.Physical >= 4 && !hasMove['bodyslam'] && !hasMove['dragontail'] && !hasMove['fakeout'] && !hasMove['flamecharge'] && !hasMove['rapidspin'] && !hasMove['suckerpunch'] && !isDoubles) {
			item = template.baseStats.atk >= 100 && template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && !counter['priority'] && this.randomChance(2, 3) ? 'Choice Scarf' : 'Choice Band';
		} else if (counter.Special >= 4 && !hasMove['acidspray'] && !hasMove['chargebeam'] && !hasMove['clearsmog'] && !hasMove['fierydance'] && !isDoubles) {
			item = template.baseStats.spa >= 100 && template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && !counter['priority'] && this.randomChance(2, 3) ? 'Choice Scarf' : 'Choice Specs';
		} else if (((counter.Physical >= 3 && hasMove['defog']) || (counter.Special >= 3 && hasMove['uturn'])) && template.baseStats.spe >= 60 && template.baseStats.spe <= 108 && !counter['priority'] && !hasMove['foulplay'] && this.randomChance(2, 3) && !isDoubles) {
			item = 'Choice Scarf';
		} else if (ability === 'Defeatist' || hasMove['eruption'] || hasMove['waterspout']) {
			item = counter.Status <= 1 ? 'Expert Belt' : 'Leftovers';
		} else if (isDoubles && counter.damagingMoves.length >= 4 && template.baseStats.spe >= 60 && !hasMove['fakeout'] && !hasMove['flamecharge'] && !hasMove['suckerpunch'] && ability !== 'Multiscale' && ability !== 'Sturdy') {
			item = 'Life Orb';
		} else if (hasMove['reversal'] && hasMove['substitute'] && !teamDetails.zMove) {
			item = 'Fightinium Z';
		} else if ((hasMove['endeavor'] || hasMove['flail'] || hasMove['reversal']) && ability !== 'Sturdy') {
			item = 'Focus Sash';
		} else if (this.getEffectiveness('Ground', template) >= 2 && ability !== 'Levitate' && !hasMove['magnetrise']) {
			item = 'Air Balloon';
		} else if (hasMove['outrage'] && (counter.setupType || ability === 'Multiscale')) {
			item = 'Lum Berry';
		} else if (isDoubles && this.getEffectiveness('Ice', template) >= 2) {
			item = 'Yache Berry';
		} else if (isDoubles && this.getEffectiveness('Rock', template) >= 2) {
			item = 'Charti Berry';
		} else if (isDoubles && this.getEffectiveness('Fire', template) >= 2) {
			item = 'Occa Berry';
		} else if (isDoubles && this.getImmunity('Fighting', template) && this.getEffectiveness('Fighting', template) >= 2) {
			item = 'Chople Berry';
		} else if ((ability === 'Slow Start' || hasMove['clearsmog'] || hasMove['curse'] || hasMove['detect'] || hasMove['protect'] || hasMove['sleeptalk']) && !isDoubles) {
			item = 'Leftovers';
		} else if (hasMove['substitute']) {
			item = counter.damagingMoves.length > 2 && !!counter['drain'] ? 'Life Orb' : 'Leftovers';
		} else if ((ability === 'Iron Barbs' || ability === 'Rough Skin') && this.randomChance(1, 2)) {
			item = 'Rocky Helmet';
		} else if (counter.Physical + counter.Special >= 4 && template.baseStats.spd >= 65 && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 235) {
			item = 'Assault Vest';
		} else if (counter.damagingMoves.length >= 4) {
			item = (!!counter['Dragon'] || !!counter['Normal'] || (hasMove['suckerpunch'] && !hasType['Dark'])) ? 'Life Orb' : 'Expert Belt';
		} else if (template.species === 'Palkia' && (hasMove['dracometeor'] || hasMove['spacialrend']) && hasMove['hydropump']) {
			item = 'Lustrous Orb';
		} else if (counter.damagingMoves.length >= 3 && !!counter['speedsetup'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd >= 300) {
			item = 'Weakness Policy';
		} else if (slot === 0 && ability !== 'Regenerator' && ability !== 'Sturdy' && !counter['recoil'] && !counter['recovery'] && template.baseStats.hp + template.baseStats.def + template.baseStats.spd < 285) {
			item = 'Focus Sash';
		} else if (counter.damagingMoves.length >= 3 && ability !== 'Sturdy' && !hasMove['acidspray'] && !hasMove['dragontail'] && !hasMove['foulplay'] && !hasMove['rapidspin'] && !hasMove['superfang']) {
			item = (template.baseStats.hp + template.baseStats.def + template.baseStats.spd < 285 || !!counter['speedsetup'] || hasMove['trickroom']) ? 'Life Orb' : 'Leftovers';

		// This is the "REALLY can't think of a good item" cutoff
		} else if (ability === 'Sturdy' && hasMove['explosion'] && !counter['speedsetup']) {
			item = 'Custap Berry';
		} else if (ability === 'Super Luck') {
			item = 'Scope Lens';
		} else if (hasType['Poison']) {
			item = 'Black Sludge';
		} else if (this.getEffectiveness('Rock', template) >= 1 || hasMove['dragontail']) {
			item = 'Leftovers';
		} else if (this.getImmunity('Ground', template) && this.getEffectiveness('Ground', template) >= 1 && ability !== 'Levitate' && ability !== 'Solid Rock' && !hasMove['magnetrise'] && !hasMove['sleeptalk']) {
			item = 'Air Balloon';
		}

		// For Trick / Switcheroo
		if (item === 'Leftovers' && hasType['Poison']) {
			item = 'Black Sludge';
		}

		let level = 75;

		if (!isDoubles) {
			let levelScale = {
				LC: 88,
				'LC Uber': 86,
				NFE: 84,
				PU: 83,
				PUBL: 82,
				NU: 81,
				NUBL: 80,
				RU: 79,
				RUBL: 78,
				UU: 77,
				UUBL: 76,
				OU: 75,
				Uber: 73,
				AG: 71,
			};
			let customScale = {
				// Banned Abilities
				Dugtrio: 77, Gothitelle: 77, Pelipper: 79, Politoed: 79, Wobbuffet: 77,

				// Holistic judgement
				Unown: 100,
			};
			let tier = template.tier;
			if (tier.includes('Unreleased') && baseTemplate.tier === 'Uber') {
				tier = 'Uber';
			}
			if (tier.charAt(0) === '(') {
				tier = tier.slice(1, -1);
			}
			// @ts-ignore
			level = levelScale[tier] || 75;
			// @ts-ignore
			if (customScale[template.name]) level = customScale[template.name];

			// Custom level based on moveset
			if (ability === 'Power Construct') level = 73;
			if (item === 'Kommonium Z') level = 77;
		} else {
			// We choose level based on BST. Min level is 70, max level is 99. 600+ BST is 70, less than 300 is 99. Calculate with those values.
			// Every 10.34 BST adds a level from 70 up to 99. Results are floored. Uses the Mega's stats if holding a Mega Stone
			let baseStats = template.baseStats;
			// If Wishiwashi, use the school-forme's much higher stats
			if (template.baseSpecies === 'Wishiwashi') baseStats = this.getTemplate('wishiwashischool').baseStats;

			let bst = baseStats.hp + baseStats.atk + baseStats.def + baseStats.spa + baseStats.spd + baseStats.spe;
			// Adjust levels of mons based on abilities (Pure Power, Sheer Force, etc.) and also Eviolite
			// For the stat boosted, treat the Pokemon's base stat as if it were multiplied by the boost. (Actual effective base stats are higher.)
			let templateAbility = (baseTemplate === template ? ability : template.abilities[0]);
			if (templateAbility === 'Huge Power' || templateAbility === 'Pure Power') {
				bst += baseStats.atk;
			} else if (templateAbility === 'Parental Bond') {
				bst += 0.25 * (counter.Physical > counter.Special ? baseStats.atk : baseStats.spa);
			} else if (templateAbility === 'Protean') {
				bst += 0.3 * (counter.Physical > counter.Special ? baseStats.atk : baseStats.spa);
			} else if (templateAbility === 'Fur Coat') {
				bst += baseStats.def;
			} else if (templateAbility === 'Slow Start') {
				bst -= baseStats.atk / 2 + baseStats.spe / 2;
			} else if (templateAbility === 'Truant') {
				bst *= 2 / 3;
			}
			if (item === 'Eviolite') {
				bst += 0.5 * (baseStats.def + baseStats.spd);
			}
			level = 70 + Math.floor(((600 - this.clampIntRange(bst, 300, 600)) / 10.34));
		}

		if (template.species === 'Stunfisk') {
			// This is just to amuse Zarel
			ability = 'Limber';
			item = 'Cheri Berry';
			level += 2;
		}

		// Prepare optimal HP
		let srWeakness = this.getEffectiveness('Rock', template);
		while (evs.hp > 1) {
			let hp = Math.floor(Math.floor(2 * template.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
			if (hasMove['substitute'] && hasMove['reversal']) {
				// Reversal users should be able to use four Substitutes
				if (hp % 4 > 0) break;
			} else if (hasMove['substitute'] && (item === 'Sitrus Berry' || ability === 'Power Construct' && item !== 'Leftovers')) {
				// Two Substitutes should activate Sitrus Berry or Power Construct
				if (hp % 4 === 0) break;
			} else if (hasMove['bellydrum'] && (item === 'Sitrus Berry' || ability === 'Gluttony')) {
				// Belly Drum should activate Sitrus Berry
				if (hp % 2 === 0) break;
			} else {
				// Maximize number of Stealth Rock switch-ins
				if (srWeakness <= 0 || hp % (4 / srWeakness) > 0) break;
			}
			evs.hp -= 4;
		}

		// Minimize confusion damage
		if (!counter['Physical'] && !hasMove['copycat'] && !hasMove['transform']) {
			evs.atk = 0;
			ivs.atk = 0;
		}

		if (ability === 'Beast Boost' && counter.Special < 1) {
			evs.spa = 0;
			ivs.spa = 0;
		}

		if (hasMove['gyroball'] || hasMove['trickroom']) {
			evs.spe = 0;
			ivs.spe = 0;
		}

		return {
			name: template.baseSpecies,
			species: species,
			gender: template.gender,
			moves: moves,
			ability: ability,
			evs: evs,
			ivs: ivs,
			item: item,
			level: level,
			shiny: this.randomChance(1, 1024),
		};
	}

	randomTeam() {
		let pokemon = [];

		const excludedTiers = ['NFE', 'LC Uber', 'LC'];
		const allowedNFE = ['Chansey', 'Doublade', 'Gligar', 'Porygon2', 'Scyther', 'Togetic'];

		// For Monotype
		let isMonotype = this.format.id === 'gen7monotyperandombattle';
		let typePool = Object.keys(this.data.TypeChart);
		let type = this.sample(typePool);

		let pokemonPool = [];
		for (let id in this.data.FormatsData) {
			let template = this.getTemplate(id);
			if (isMonotype) {
				let types = template.types;
				if (template.battleOnly) types = this.getTemplate(template.baseSpecies).types;
				if (types.indexOf(type) < 0) continue;
			}
			if (template.gen <= this.gen && !excludedTiers.includes(template.tier) && !template.isMega && !template.isPrimal && !template.isNonstandard && template.randomBattleMoves) {
				pokemonPool.push(id);
			}
		}

		// PotD stuff
		let potd;
		if (global.Config && Config.potd && this.getRuleTable(this.getFormat()).has('potd')) {
			potd = this.getTemplate(Config.potd);
		}

		/**@type {{[k: string]: number}} */
		let typeCount = {};
		/**@type {{[k: string]: number}} */
		let typeComboCount = {};
		/**@type {{[k: string]: number}} */
		let baseFormes = {};
		let uberCount = 0;
		let puCount = 0;
		/**@type {RandomTeamsTypes["TeamDetails"]} */
		let teamDetails = {};

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Limit to one of each species (Species Clause)
			if (baseFormes[template.baseSpecies]) continue;

			// Only certain NFE Pokemon are allowed
			if (template.evos.length && !allowedNFE.includes(template.species)) continue;

			let tier = template.tier;
			switch (tier) {
			case 'Uber':
				// Ubers are limited to 2 but have a 20% chance of being added anyway.
				if (uberCount > 1 && this.randomChance(4, 5)) continue;
				break;
			case 'PU':
				// PUs are limited to 2 but have a 20% chance of being added anyway.
				if (puCount > 1 && this.randomChance(4, 5)) continue;
				break;
			case 'Unreleased': case 'CAP':
				// Unreleased and CAP have 20% the normal rate
				if (this.randomChance(4, 5)) continue;
			}

			// Adjust rate for species with multiple formes
			switch (template.baseSpecies) {
			case 'Arceus': case 'Silvally':
				if (this.randomChance(17, 18)) continue;
				break;
			case 'Pikachu':
				if (this.randomChance(6, 7)) continue;
				continue;
			case 'Genesect':
				if (this.randomChance(4, 5)) continue;
				break;
			case 'Castform': case 'Gourgeist': case 'Oricorio':
				if (this.randomChance(3, 4)) continue;
				break;
			case 'Basculin': case 'Cherrim': case 'Greninja': case 'Hoopa': case 'Meloetta': case 'Meowstic':
				if (this.randomChance(1, 2)) continue;
				break;
			}

			if (potd && potd.exists) {
				// The Pokemon of the Day belongs in slot 2
				if (pokemon.length === 1) {
					template = potd;
					if (template.species === 'Magikarp') {
						// @ts-ignore
						template.randomBattleMoves = ['bounce', 'flail', 'splash', 'magikarpsrevenge'];
					} else if (template.species === 'Delibird') {
						// @ts-ignore
						template.randomBattleMoves = ['present', 'bestow'];
					}
				} else if (template.species === potd.species) {
					continue; // No thanks, I've already got one
				}
			}

			let types = template.types;

			if (!isMonotype) {
				// Limit 2 of any type
				let skip = false;
				for (const type of types) {
					if (typeCount[type] > 1 && this.randomChance(4, 5)) {
						skip = true;
						break;
					}
				}
				if (skip) continue;
			}

			let set = this.randomSet(template, pokemon.length, teamDetails, this.format.gameType !== 'singles');

			// Illusion shouldn't be the last Pokemon of the team
			if (set.ability === 'Illusion' && pokemon.length > 4) continue;

			// Pokemon shouldn't have Physical and Special setup on the same set
			let incompatibleMoves = ['bellydrum', 'swordsdance', 'calmmind', 'nastyplot'];
			let intersectMoves = set.moves.filter(move => incompatibleMoves.includes(move));
			if (intersectMoves.length > 1) continue;

			// Limit 1 of any type combination, 2 in monotype
			let typeCombo = types.slice().sort().join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle' || set.ability === 'Sand Stream') {
				// Drought, Drizzle and Sand Stream don't count towards the type combo limit
				typeCombo = set.ability;
				if (typeCombo in typeComboCount) continue;
			} else {
				if (typeComboCount[typeCombo] >= (isMonotype ? 2 : 1)) continue;
			}

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			if (pokemon.length === 6) {
				// Set Zoroark's level to be the same as the last Pokemon
				let illusion = teamDetails['illusion'];
				if (illusion) pokemon[illusion - 1].level = pokemon[5].level;
				break;
			}

			// Now that our Pokemon has passed all checks, we can increment our counters
			baseFormes[template.baseSpecies] = 1;

			// Increment type counters
			for (const type of types) {
				if (type in typeCount) {
					typeCount[type]++;
				} else {
					typeCount[type] = 1;
				}
			}
			if (typeCombo in typeComboCount) {
				typeComboCount[typeCombo]++;
			} else {
				typeComboCount[typeCombo] = 1;
			}

			// Increment Uber/PU counters
			if (tier === 'Uber') {
				uberCount++;
			} else if (tier === 'PU') {
				puCount++;
			}

			// Team has Mega/weather/hazards
			let item = this.getItem(set.item);
			if (item.megaStone) teamDetails['megaStone'] = 1;
			if (item.zMove) teamDetails['zMove'] = 1;
			if (set.ability === 'Snow Warning') teamDetails['hail'] = 1;
			if (set.moves.includes('raindance') || set.ability === 'Drizzle' && !item.onPrimal) teamDetails['rain'] = 1;
			if (set.ability === 'Sand Stream') teamDetails['sand'] = 1;
			if (set.moves.includes('sunnyday') || set.ability === 'Drought' && !item.onPrimal) teamDetails['sun'] = 1;
			if (set.moves.includes('stealthrock')) teamDetails['stealthRock'] = 1;
			if (set.moves.includes('toxicspikes')) teamDetails['toxicSpikes'] = 1;
			if (set.moves.includes('defog') || set.moves.includes('rapidspin')) teamDetails['hazardClear'] = 1;

			// For setting Zoroark's level
			if (set.ability === 'Illusion') teamDetails['illusion'] = pokemon.length;
		}
		return pokemon;
	}

	/**
	 * @param {Template} template
	 * @param {number} slot
	 * @param {RandomTeamsTypes["FactoryTeamDetails"]} teamData
	 * @param {string} tier
	 * @return {RandomTeamsTypes["RandomFactorySet"] | false}
	 */
	randomFactorySet(template, slot, teamData, tier) {
		let speciesId = toId(template.species);
		// let flags = this.randomFactorySets[tier][speciesId].flags;
		let setList = this.randomFactorySets[tier][speciesId].sets;

		/**@type {{[k: string]: number}} */
		let itemsMax = {'choicespecs': 1, 'choiceband': 1, 'choicescarf': 1};
		/**@type {{[k: string]: number}} */
		let movesMax = {'rapidspin': 1, 'batonpass': 1, 'stealthrock': 1, 'defog': 1, 'spikes': 1, 'toxicspikes': 1};
		let requiredMoves = {'stealthrock': 'hazardSet', 'rapidspin': 'hazardClear', 'defog': 'hazardClear'};
		let weatherAbilitiesRequire = {
			'hydration': 'raindance', 'swiftswim': 'raindance',
			'leafguard': 'sunnyday', 'solarpower': 'sunnyday', 'chlorophyll': 'sunnyday',
			'sandforce': 'sandstorm', 'sandrush': 'sandstorm', 'sandveil': 'sandstorm',
			'slushrush': 'hail', 'snowcloak': 'hail',
		};
		let weatherAbilities = ['drizzle', 'drought', 'snowwarning', 'sandstream'];

		// Build a pool of eligible sets, given the team partners
		// Also keep track of sets with moves the team requires
		/**@type {{set: AnyObject, moveVariants?: number[]}[]} */
		let effectivePool = [];
		let priorityPool = [];
		for (const curSet of setList) {
			let item = this.getItem(curSet.item);
			if (teamData.megaCount > 0 && item.megaStone) continue; // reject 2+ mega stones
			if (teamData.zCount && teamData.zCount > 0 && item.zMove) continue; // reject 2+ Z stones
			if (itemsMax[item.id] && teamData.has[item.id] >= itemsMax[item.id]) continue;

			let ability = this.getAbility(curSet.ability);
			// @ts-ignore
			if (weatherAbilitiesRequire[ability.id] && teamData.weather !== weatherAbilitiesRequire[ability.id]) continue;
			if (teamData.weather && weatherAbilities.includes(ability.id)) continue; // reject 2+ weather setters

			let reject = false;
			let hasRequiredMove = false;
			let curSetVariants = [];
			for (const move of curSet.moves) {
				let variantIndex = this.random(move.length);
				let moveId = toId(move[variantIndex]);
				if (movesMax[moveId] && teamData.has[moveId] >= movesMax[moveId]) {
					reject = true;
					break;
				}
				// @ts-ignore
				if (requiredMoves[moveId] && !teamData.has[requiredMoves[moveId]]) {
					hasRequiredMove = true;
				}
				curSetVariants.push(variantIndex);
			}
			if (reject) continue;
			effectivePool.push({set: curSet, moveVariants: curSetVariants});
			if (hasRequiredMove) priorityPool.push({set: curSet, moveVariants: curSetVariants});
		}
		if (priorityPool.length) effectivePool = priorityPool;

		if (!effectivePool.length) {
			if (!teamData.forceResult) return false;
			for (const curSet of setList) {
				effectivePool.push({set: curSet});
			}
		}

		let setData = this.sample(effectivePool);
		let moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moveVariants ? moveSlot[setData.moveVariants[i]] : this.sample(moveSlot));
		}

		let item = Array.isArray(setData.set.item) ? this.sample(setData.set.item) : setData.set.item;
		let ability = Array.isArray(setData.set.ability) ? this.sample(setData.set.ability) : setData.set.ability;
		let nature = Array.isArray(setData.set.nature) ? this.sample(setData.set.nature) : setData.set.nature;

		return {
			name: setData.set.name || template.baseSpecies,
			species: setData.set.species,
			gender: setData.set.gender || template.gender || (this.randomChance(1, 2) ? 'M' : 'F'),
			item: item || '',
			ability: ability || template.abilities['0'],
			shiny: typeof setData.set.shiny === 'undefined' ? this.randomChance(1, 1024) : setData.set.shiny,
			level: setData.set.level ? setData.set.level : tier === "LC" ? 5 : 100,
			happiness: typeof setData.set.happiness === 'undefined' ? 255 : setData.set.happiness,
			evs: Object.assign({hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}, setData.set.evs),
			ivs: Object.assign({hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}, setData.set.ivs),
			nature: nature || 'Serious',
			moves: moves,
		};
	}

	/**
	 * @param {number} [depth]
	 * @return {RandomTeamsTypes["RandomFactorySet"][]}
	 */
	randomFactoryTeam(depth = 0) {
		let forceResult = (depth >= 4);

		// The teams generated depend on the tier choice in such a way that
		// no exploitable information is leaked from rolling the tier in getTeam(p1).
		let availableTiers = ['Uber', 'OU', 'UU', 'RU', 'NU', 'PU', 'LC', 'Mono'];
		if (!this.FactoryTier) this.FactoryTier = this.sample(availableTiers);
		const chosenTier = this.FactoryTier;

		/**@type {{[k: string]: number}} */
		const tierValues = {
			'Uber': 5,
			'OU': 4, 'UUBL': 4,
			'UU': 3, 'RUBL': 3,
			'RU': 2, 'NUBL': 2,
			'NU': 1, 'PUBL': 1,
			'PU': 0,
		};

		let pokemon = [];
		let pokemonPool = Object.keys(this.randomFactorySets[chosenTier]);

		let typePool = Object.keys(this.data.TypeChart);
		const type = this.sample(typePool);

		/**@type {TeamData} */
		let teamData = {typeCount: {}, typeComboCount: {}, baseFormes: {}, megaCount: 0, zCount: 0, has: {}, forceResult: forceResult, weaknesses: {}, resistances: {}};
		let requiredMoveFamilies = ['hazardSet', 'hazardClear'];
		/**@type {{[k: string]: string}} */
		let requiredMoves = {'stealthrock': 'hazardSet', 'rapidspin': 'hazardClear', 'defog': 'hazardClear'};
		/**@type {{[k: string]: string}} */
		let weatherAbilitiesSet = {'drizzle': 'raindance', 'drought': 'sunnyday', 'snowwarning': 'hail', 'sandstream': 'sandstorm'};
		/**@type {{[k: string]: string[]}} */
		let resistanceAbilities = {
			'dryskin': ['Water'], 'waterabsorb': ['Water'], 'stormdrain': ['Water'],
			'flashfire': ['Fire'], 'heatproof': ['Fire'],
			'lightningrod': ['Electric'], 'motordrive': ['Electric'], 'voltabsorb': ['Electric'],
			'sapsipper': ['Grass'],
			'thickfat': ['Ice', 'Fire'],
			'levitate': ['Ground'],
		};

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			// Lessen the need of deleting sets of Pokemon after tier shifts
			if (chosenTier in tierValues && template.tier in tierValues && tierValues[template.tier] > tierValues[chosenTier]) continue;

			let speciesFlags = this.randomFactorySets[chosenTier][template.speciesid].flags;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[template.baseSpecies]) continue;

			// Limit the number of Megas to one
			if (teamData.megaCount >= 1 && speciesFlags.megaOnly) continue;

			let set = this.randomFactorySet(template, pokemon.length, teamData, chosenTier);
			if (!set) continue;

			let itemData = this.getItem(set.item);

			// Actually limit the number of Megas to one
			if (teamData.megaCount >= 1 && itemData.megaStone) continue;

			// Limit the number of Z moves to one
			if (teamData.zCount >= 1 && itemData.zMove) continue;

			let types = template.types;

			// Enforce Monotype
			if (chosenTier === 'Mono') {
				// Prevents Mega Evolutions from breaking the type limits
				if (itemData.megaStone) {
					let megaTemplate = this.getTemplate(itemData.megaStone);
					if (types.length > megaTemplate.types.length) types = [template.types[0]];
					// Only check the second type because a Mega Evolution should always share the first type with its base forme.
					if (megaTemplate.types[1] && types[1] && megaTemplate.types[1] !== types[1]) {
						types = [megaTemplate.types[0]];
					}
				}
				if (!types.includes(type)) continue;
			} else {
			// If not Monotype, limit to two of each type
				let skip = false;
				for (const type of types) {
					if (teamData.typeCount[type] > 1 && this.randomChance(4, 5)) {
						skip = true;
						break;
					}
				}
				if (skip) continue;

				// Limit 1 of any type combination
				let typeCombo = types.slice().sort().join();
				if (set.ability + '' === 'Drought' || set.ability + '' === 'Drizzle') {
				// Drought and Drizzle don't count towards the type combo limit
					typeCombo = set.ability + '';
				}
				if (typeCombo in teamData.typeComboCount) continue;
			}

			// Okay, the set passes, add it to our team
			pokemon.push(set);
			let typeCombo = types.slice().sort().join();
			// Now that our Pokemon has passed all checks, we can update team data:
			for (const type of types) {
				if (type in teamData.typeCount) {
					teamData.typeCount[type]++;
				} else {
					teamData.typeCount[type] = 1;
				}
			}
			teamData.typeComboCount[typeCombo] = 1;

			teamData.baseFormes[template.baseSpecies] = 1;

			if (itemData.megaStone) teamData.megaCount++;
			if (itemData.zMove) teamData.zCount++;
			if (itemData.id in teamData.has) {
				teamData.has[itemData.id]++;
			} else {
				teamData.has[itemData.id] = 1;
			}

			let abilityData = this.getAbility(set.ability);
			if (abilityData.id in weatherAbilitiesSet) {
				teamData.weather = weatherAbilitiesSet[abilityData.id];
			}

			for (const move of set.moves) {
				let moveId = toId(move);
				if (moveId in teamData.has) {
					teamData.has[moveId]++;
				} else {
					teamData.has[moveId] = 1;
				}
				if (moveId in requiredMoves) {
					teamData.has[requiredMoves[moveId]] = 1;
				}
			}

			for (let typeName in this.data.TypeChart) {
				// Cover any major weakness (3+) with at least one resistance
				if (teamData.resistances[typeName] >= 1) continue;
				if (resistanceAbilities[abilityData.id] && resistanceAbilities[abilityData.id].includes(typeName) || !this.getImmunity(typeName, types)) {
					// Heuristic: assume that Pokémon with these abilities don't have (too) negative typing.
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
					continue;
				}
				let typeMod = this.getEffectiveness(typeName, types);
				if (typeMod < 0) {
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
				} else if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (pokemon.length < 6) return this.randomFactoryTeam(++depth);

		// Quality control
		if (!teamData.forceResult) {
			for (const requiredFamily of requiredMoveFamilies) {
				if (!teamData.has[requiredFamily]) return this.randomFactoryTeam(++depth);
			}
			for (let type in teamData.weaknesses) {
				if (teamData.weaknesses[type] >= 3) return this.randomFactoryTeam(++depth);
			}
		}

		return pokemon;
	}

	/**
	 * @param {Template} template
	 * @param {number} slot
	 * @param {RandomTeamsTypes["FactoryTeamDetails"]} teamData
	 * @return {RandomTeamsTypes["RandomFactorySet"] | false}
	 */
	randomBSSFactorySet(template, slot, teamData) {
		let speciesId = toId(template.species);
		// let flags = this.randomBSSFactorySets[tier][speciesId].flags;
		let setList = this.randomBSSFactorySets[speciesId].sets;

		/**@type {{[k: string]: number}} */
		let movesMax = {'batonpass': 1, 'stealthrock': 1, 'spikes': 1, 'toxicspikes': 1, 'doubleedge': 1, 'trickroom': 1};
		/**@type {{[k: string]: string}} */
		let requiredMoves = {};
		/**@type {{[k: string]: string}} */
		let weatherAbilitiesRequire = {
			'swiftswim': 'raindance',
			'sandrush': 'sandstorm', 'sandveil': 'sandstorm',
		};
		let weatherAbilities = ['drizzle', 'drought', 'snowwarning', 'sandstream'];

		// Build a pool of eligible sets, given the team partners
		// Also keep track of sets with moves the team requires
		/**@type {{set: AnyObject, moveVariants?: number[], itemVariants?: number, abilityVariants?: number}[]} */
		let effectivePool = [];
		let priorityPool = [];
		for (const curSet of setList) {
			let item = this.getItem(curSet.item);
			if (teamData.megaCount > 1 && item.megaStone) continue; // reject 3+ mega stones
			if (teamData.zCount && teamData.zCount > 1 && item.zMove) continue; // reject 3+ Z stones
			if (teamData.has[item.id]) continue; // Item clause

			let ability = this.getAbility(curSet.ability);
			if (weatherAbilitiesRequire[ability.id] && teamData.weather !== weatherAbilitiesRequire[ability.id]) continue;
			if (teamData.weather && weatherAbilities.includes(ability.id)) continue; // reject 2+ weather setters

			if (curSet.species === 'Aron' && teamData.weather !== 'sandstorm') continue; // reject Aron without a Sand Stream user

			let reject = false;
			let hasRequiredMove = false;
			let curSetVariants = [];
			for (const move of curSet.moves) {
				let variantIndex = this.random(move.length);
				let moveId = toId(move[variantIndex]);
				if (movesMax[moveId] && teamData.has[moveId] >= movesMax[moveId]) {
					reject = true;
					break;
				}
				if (requiredMoves[moveId] && !teamData.has[requiredMoves[moveId]]) {
					hasRequiredMove = true;
				}
				curSetVariants.push(variantIndex);
			}
			if (reject) continue;
			effectivePool.push({set: curSet, moveVariants: curSetVariants});
			if (hasRequiredMove) priorityPool.push({set: curSet, moveVariants: curSetVariants});
		}
		if (priorityPool.length) effectivePool = priorityPool;

		if (!effectivePool.length) {
			if (!teamData.forceResult) return false;
			for (const curSet of setList) {
				effectivePool.push({set: curSet});
			}
		}

		let setData = this.sample(effectivePool);
		let moves = [];
		for (const [i, moveSlot] of setData.set.moves.entries()) {
			moves.push(setData.moveVariants ? moveSlot[setData.moveVariants[i]] : this.sample(moveSlot));
		}

		return {
			name: setData.set.nickname || setData.set.name || template.baseSpecies,
			species: setData.set.species,
			gender: setData.set.gender || template.gender || (this.randomChance(1, 2) ? 'M' : 'F'),
			item: setData.set.item || '',
			ability: setData.set.ability || template.abilities['0'],
			shiny: typeof setData.set.shiny === 'undefined' ? this.randomChance(1, 1024) : setData.set.shiny,
			level: setData.set.level || 50,
			happiness: typeof setData.set.happiness === 'undefined' ? 255 : setData.set.happiness,
			evs: Object.assign({hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0}, setData.set.evs),
			ivs: Object.assign({hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31}, setData.set.ivs),
			nature: setData.set.nature || 'Serious',
			moves: moves,
		};
	}

	/**
	 * @param {number} [depth]
	 * @return {RandomTeamsTypes["RandomFactorySet"][]}
	 */
	randomBSSFactoryTeam(depth = 0) {
		let forceResult = (depth >= 4);

		let pokemon = [];

		let pokemonPool = Object.keys(this.randomBSSFactorySets);

		/**@type {TeamData} */
		let teamData = {typeCount: {}, typeComboCount: {}, baseFormes: {}, megaCount: 0, zCount: 0, eeveeLimCount: 0, has: {}, forceResult: forceResult, weaknesses: {}, resistances: {}};
		/**@type {string[]} */
		let requiredMoveFamilies = [];
		/**@type {{[k: string]: string}} */
		let requiredMoves = {};
		/**@type {{[k: string]: string}} */
		let weatherAbilitiesSet = {'drizzle': 'raindance', 'drought': 'sunnyday', 'snowwarning': 'hail', 'sandstream': 'sandstorm'};
		/**@type {{[k: string]: string[]}} */
		let resistanceAbilities = {
			'waterabsorb': ['Water'],
			'flashfire': ['Fire'],
			'lightningrod': ['Electric'], 'voltabsorb': ['Electric'],
			'thickfat': ['Ice', 'Fire'],
			'levitate': ['Ground'],
		};

		while (pokemonPool.length && pokemon.length < 6) {
			let template = this.getTemplate(this.sampleNoReplace(pokemonPool));
			if (!template.exists) continue;

			let speciesFlags = this.randomBSSFactorySets[template.speciesid].flags;

			// Limit to one of each species (Species Clause)
			if (teamData.baseFormes[template.baseSpecies]) continue;

			// Limit the number of Megas + Z-moves to 3
			if (teamData.megaCount + teamData.zCount >= 3 && speciesFlags.megaOnly) continue;

			// Limit 2 of any type
			let types = template.types;
			let skip = false;
			for (const type of types) {
				if (teamData.typeCount[type] > 1 && this.randomChance(4, 5)) {
					skip = true;
					break;
				}
			}
			if (skip) continue;

			// Restrict Eevee with certain Pokemon
			if (speciesFlags.limEevee) teamData.eeveeLimCount++;
			if (teamData.eeveeLimCount >= 1 && speciesFlags.limEevee) continue;

			let set = this.randomBSSFactorySet(template, pokemon.length, teamData);
			if (!set) continue;

			// Limit 1 of any type combination
			let typeCombo = types.slice().sort().join();
			if (set.ability === 'Drought' || set.ability === 'Drizzle') {
				// Drought and Drizzle don't count towards the type combo limit
				typeCombo = set.ability;
			}
			if (typeCombo in teamData.typeComboCount) continue;

			// Okay, the set passes, add it to our team
			pokemon.push(set);

			// Now that our Pokemon has passed all checks, we can update team data:
			for (const type of types) {
				if (type in teamData.typeCount) {
					teamData.typeCount[type]++;
				} else {
					teamData.typeCount[type] = 1;
				}
			}
			teamData.typeComboCount[typeCombo] = 1;

			teamData.baseFormes[template.baseSpecies] = 1;

			// Limit Mega and Z-move
			let itemData = this.getItem(set.item);
			if (itemData.megaStone) teamData.megaCount++;
			if (itemData.zMove) teamData.zCount++;
			teamData.has[itemData.id] = 1;

			let abilityData = this.getAbility(set.ability);
			if (abilityData.id in weatherAbilitiesSet) {
				teamData.weather = weatherAbilitiesSet[abilityData.id];
			}

			for (const move of set.moves) {
				let moveId = toId(move);
				if (moveId in teamData.has) {
					teamData.has[moveId]++;
				} else {
					teamData.has[moveId] = 1;
				}
				if (moveId in requiredMoves) {
					teamData.has[requiredMoves[moveId]] = 1;
				}
			}

			for (let typeName in this.data.TypeChart) {
				// Cover any major weakness (3+) with at least one resistance
				if (teamData.resistances[typeName] >= 1) continue;
				if (resistanceAbilities[abilityData.id] && resistanceAbilities[abilityData.id].includes(typeName) || !this.getImmunity(typeName, types)) {
					// Heuristic: assume that Pokémon with these abilities don't have (too) negative typing.
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
					continue;
				}
				let typeMod = this.getEffectiveness(typeName, types);
				if (typeMod < 0) {
					teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
					if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
				} else if (typeMod > 0) {
					teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
				}
			}
		}
		if (pokemon.length < 6) return this.randomBSSFactoryTeam(++depth);

		// Quality control
		if (!teamData.forceResult) {
			for (const requiredFamily of requiredMoveFamilies) {
				if (!teamData.has[requiredFamily]) return this.randomBSSFactoryTeam(++depth);
			}
			for (let type in teamData.weaknesses) {
				if (teamData.weaknesses[type] >= 3) return this.randomBSSFactoryTeam(++depth);
			}
		}

		return pokemon;
	}
	randomFormatsTeam(){
		let teams={gen3pu:[
			'|beedrill|salacberry||sludgebomb,hiddenpowerbug,swordsdance,endure|Hasty|,4,,252,,252||,30,30,,30,|||]|houndour|leftovers|1|fireblast,crunch,pursuit,hiddenpowergrass|Timid|,,,252,4,252||,2,,30,,|||]|aipom|leftovers|1|doubleedge,shadowball,irontail,hiddenpowergrass|Naive|,252,,4,,252||,30,,30,,|||]|quilava|leftovers||fireblast,hiddenpowerice,toxic,substitute|Hasty|,4,,252,,252||,2,30,,,|||]|drowzee|leftovers||protect,wish,thunderwave,seismictoss|Calm|252,,4,,252,||,0,,,,|||]|omanyte|leftovers|1|spikes,toxic,surf,icebeam|Bold|252,,252,,4,||,0,,,,|||',
			
			'|snorunt|salacberry||spikes,icywind,icebeam,endure|Timid|252,,,,4,252||,0,,,,|||]|aipom|leftovers|1|hiddenpowergrass,batonpass,substitute,agility|Timid|252,,,4,,252||,2,,30,,|||]|seviper|leftovers||sludgebomb,earthquake,crunch,rest|Adamant|,252,,,4,252|||||]|sunflora|leftovers||gigadrain,hiddenpowerice,substitute,growth|Calm|252,,,,64,192||,2,30,,,|||]|clamperl|deepseatooth||surf,icebeam,hiddenpowerelectric,substitute|Modest|,,,252,4,252||,3,,30,,|||]|gastly|leftovers||thunderbolt,hiddenpowerice,gigadrain,destinybond|Naive|,4,,252,,252||,2,30,,,|||',
			
			'|corsola|leftovers|1|surf,icebeam,recover,calmmind|Bold|252,,252,,4,||,0,,,,|||]|sunflora|leftovers||gigadrain,hiddenpowerice,substitute,growth|Calm|252,,,,64,192||,2,30,,,|||]|houndour|salacberry|1|fireblast,crunch,pursuit,hiddenpowergrass|Timid|,,,252,4,252||,2,,30,,|||]|pineco|leftovers||spikes,rapidspin,explosion,toxic|Careful|252,,4,,252,|||||]|aipom|choiceband||doubleedge,shadowball,irontail,batonpass|Jolly|4,252,,,,252|||||]|duskull|leftovers||willowisp,nightshade,rest,sleeptalk|Bold|252,,252,,4,||,0,,,,|||',
			
			'|snorunt|salacberry||spikes,icywind,icebeam,endure|Timid|252,,,,4,252||,0,,,,|||]|dragonair|leftovers||hiddenpowerground,dragondance,doubleedge,irontail|Adamant|,252,4,,,252||,,,30,30,|||0]|minun|magnet||thunderbolt,batonpass,hiddenpowergrass,substitute|Timid|4,,,252,,252||,30,,30,,|||]|beedrill|salacberry||swordsdance,sludgebomb,endure,brickbreak|Jolly|,252,,,4,252|||||]|combusken|salacberry||reversal,endure,swordsdance,flamethrower|Hasty|,252,,4,,252|||||]|sealeo|leftovers||protect,surf,icebeam,toxic|Bold|252,,252,,4,||,0,,,,|||',
			
			'|marshtomp|choiceband||earthquake,rockslide,hiddenpowerghost,bodyslam|Adamant|,252,,,4,252||,,30,,30,|||0]|ponyta|leftovers|1|fireblast,hiddenpowergrass,quickattack,toxic|Timid|,,,252,4,252||,30,,30,,|||]|dragonair|leftovers||thunderbolt,icebeam,hiddenpowergrass,thunderwave|Modest|,,,252,4,252||,2,,30,,|||]|corsola|leftovers|1|calmmind,recover,surf,icebeam|Bold|252,,252,,,4||,0,,,,|||]|gastly|leftovers||thunderbolt,hiddenpowerice,gigadrain,substitute|Timid|,,,252,4,252||,2,30,,,|||]|yanma|liechiberry||substitute,reversal,hiddenpowerflying,toxic|Jolly|,252,,,4,252||30,30,30,30,30,|||',
			
			'|omanyte|leftovers|1|spikes,toxic,surf,icebeam|Bold|252,,252,,4,||,0,,,,|||]|weepinbell|leftovers||solarbeam,hiddenpowerfire,sleeppowder,sunnyday|Modest|,,,252,4,252||,2,,30,,30|||]|lickitung|leftovers|1|wish,protect,seismictoss,healbell|Careful|252,,,,252,4||,0,,,,|||]|dustox|leftovers||moonlight,toxic,protect,psychic|Bold|252,,160,,,96||,0,,,,|||]|machoke|leftovers||bulkup,crosschop,rockslide,hiddenpowerghost|Adamant|104,252,,,,152||,,30,,30,|||]|rhyhorn|leftovers||protect,toxic,rockslide,earthquake|Impish|252,4,252,,,|||||',
			
			'|minun|leftovers||thunderbolt,hiddenpowerice,quickattack,toxic|Timid|,,,252,4,252|F|,30,30,,,|||]|combusken|leftovers||fireblast,hiddenpowergrass,skyuppercut,quickattack|Mild|,,,252,4,252||,30,,30,,|||]|dragonair|leftovers||dragondance,doubleedge,irontail,hiddenpowerground|Adamant|,252,,,4,252|M|,,,30,30,|||]|yanma|liechiberry||substitute,reversal,hiddenpowerflying,shadowball|Jolly|,252,4,,,252|F|30,30,30,30,30,|||]|marshtomp|leftovers||earthquake,surf,toxic,protect|Relaxed|252,,252,,4,|F||||]|wigglytuff|leftovers||protect,wish,thunderwave,hypervoice|Bold|248,,252,,8,|||||',
			
			'|aipom|choiceband||frustration,irontail,shadowball,batonpass|Jolly|,252,,,4,252|||||0]|furret|leftovers|1|doubleedge,shadowball,substitute,focuspunch|Naive|,252,4,,,252|||||]|beedrill|leftovers||swordsdance,sludgebomb,hiddenpowerghost,brickbreak|Jolly|,252,,,4,252||,,30,,30,|||]|marshtomp|leftovers||earthquake,surf,toxic,protect|Relaxed|252,,252,,4,|||||]|shuckle|leftovers||toxic,wrap,encore,protect|Impish|252,,252,,,4|||||]|dragonair|leftovers||thunderwave,rest,thunderbolt,icebeam|Bold|252,,216,,,40||,0,,,,|||',
			
			'|furret|choiceband|1|doubleedge,shadowball,irontail,focuspunch|Naive|,252,,4,,252|||||]|gastly|leftovers||thunderbolt,hiddenpowerice,gigadrain,destinybond|Timid|,,,252,4,252||,2,30,,,|||]|omanyte|leftovers|1|surf,icebeam,toxic,spikes|Bold|252,,252,,4,||,0,,,,|||]|dragonair|leftovers||thunderbolt,icebeam,fireblast,thunderwave|Timid|,,,252,4,252||,0,,,,|||]|vibrava|choiceband||earthquake,rockslide,hiddenpowerghost,quickattack|Jolly|,252,,,4,252||,,30,,30,|||]|marshtomp|choiceband||earthquake,rockslide,bodyslam,hiddenpowerghost|Adamant|,252,,,4,252||,,30,,30,|||',
			
			'|omanyte|leftovers|1|spikes,icebeam,toxic,protect|Bold|248,,248,,,12|F|,0,,,,|S||]|drowzee|leftovers||wish,protect,seismictoss,toxic|Calm|240,,,,252,16|F|,0,,,,|S||]|shuckle|leftovers||wrap,toxic,encore,rest|Impish|248,,248,,,12|F||S||]|tentacool|leftovers|1|rapidspin,surf,toxic,protect|Calm|248,,,,248,12|F|,0,,,,|S||]|mightyena|leftovers||crunch,roar,protect,healbell|Bold|248,,248,,,12|F|,0,,,,|||]|bayleef|leftovers||hiddenpowergrass,leechseed,synthesis,reflect|Bold|240,,224,,,44|F|,2,,30,,|S||',
			
			'|aipom|leftovers|1|substitute,batonpass,doubleedge,hiddenpowergrass|Naive|,252,,4,,252||,30,,30,,|||]|dragonair|leftovers||icebeam,thunderbolt,toxic,rest|Calm|248,,,,252,8|||||]|clamperl|deepseatooth||surf,icebeam,hiddenpowerelectric,substitute|Modest|,,4,252,,252||,3,,30,,|||]|shuckle|leftovers||toxic,wrap,encore,rest|Impish|252,,252,,,4|||||]|marshtomp|leftovers||earthquake,surf,toxic,protect|Relaxed|248,,252,,8,|||||]|ivysaur|leftovers||synthesis,hiddenpowergrass,toxic,leechseed|Calm|252,,,,224,32||,2,,30,,|||',
			
			'|omanyte|leftovers|1|spikes,protect,surf,icebeam|Bold|244,,228,,36,||,0,,,,|||]|smoochum|salacberry||icebeam,psychic,calmmind,substitute|Timid|,,4,252,,252||28,0,,,,|||]|duskull|leftovers||taunt,rest,nightshade,willowisp|Careful|252,4,,,252,||,0,,,,|||]|mightyena|leftovers||roar,protect,healbell,crunch|Bold|252,,252,,4,||,0,,,,|||]|quilava|leftovers||overheat,fireblast,quickattack,hiddenpowergrass|Timid|,4,,252,,252||,30,,30,,|||]|drowzee|leftovers||wish,seismictoss,thunderwave,protect|Calm|252,,4,,252,||,0,,,,|||',
			
			'|aipom|choiceband||doubleedge,irontail,shadowball,batonpass|Jolly|,252,4,,,252|F||S||]|omanyte|leftovers|1|spikes,icebeam,toxic,protect|Bold|248,,248,,,12|F|,0,,,,|S||]|marshtomp|choiceband||earthquake,doubleedge,rockslide,hiddenpowerflying|Adamant|,252,4,,,252|F|30,30,30,30,30,|S||]|dragonair|leftovers||fireblast,icebeam,thunderbolt,agility|Modest|168,,,224,,116|F|,0,,,,|S||]|vibrava|choiceband||earthquake,doubleedge,rockslide,quickattack|Jolly|,252,4,,,252|F||S||]|gastly|magnet||thunderbolt,hiddenpowerice,willowisp,destinybond|Timid|,,4,252,,252|F|,2,30,,,|S||',
			
			'|marshtomp|choiceband||earthquake,rockslide,hiddenpowerghost,bodyslam|Adamant|,252,,,4,252||,,30,,30,|||]|sealeo|leftovers||substitute,surf,icebeam,encore|Modest|52,,,252,,204||,0,,,,|||]|houndour|leftovers|1|pursuit,crunch,fireblast,hiddenpowergrass|Modest|,,,252,4,252||,2,,30,,|||]|shuckle|leftovers||rocktomb,toxic,encore,rest|Impish|248,,248,,,12|||||]|minun|leftovers||wish,protect,batonpass,thunderbolt|Timid|,,,252,4,252||,0,,,,|||]|doduo|choiceband|1|doubleedge,drillpeck,hiddenpowerground,quickattack|Jolly|,252,4,,,252||,,,30,30,|||',
			
			'|omanyte|leftovers|1|spikes,hydropump,icebeam,toxic|Bold|252,,252,4,,||,0,,,,|||]|gastly|leftovers||thunderbolt,psychic,taunt,explosion|Hasty|,4,,252,,252|||||]|dragonair|leftovers||dragondance,doubleedge,thunder,hiddenpowerfighting|Hasty|,252,,,4,252||,,30,30,30,30|||]|marshtomp|leftovers||protect,hydropump,icebeam,earthquake|Relaxed|252,,252,,4,|||||]|ivysaur|leftovers||synthesis,swordsdance,sludgebomb,doubleedge|Impish|252,,252,,4,|||||]|wartortle|leftovers||rapidspin,surf,icebeam,toxic|Calm|252,,,4,252,||,0,,,,|||'
			
			],
			
			gen4lc:[
			
			'|chimchar|focussash||fakeout,overheat,hiddenpowergrass,stealthrock|Hasty|4,56,,216,4,188||,30,,30,,||5|]|elekid|lifeorb||thunderbolt,icepunch,crosschop,hiddenpowergrass|Hasty|,96,,160,,240||,30,,30,,||5|]|clamperl|deepseascale||rest,sleeptalk,surf,hiddenpowerelectric|Bold|236,,236,8,,20||,,,30,,||5|]|munchlax|oranberry|1|recycle,pursuit,return,firepunch|Sassy|76,,196,,236,||||5|]|drifloon|oranberry|1|calmmind,shadowball,hiddenpowerfighting,substitute|Modest|116,,8,200,8,120||,,30,30,30,30||5|]|croagunk|lifeorb|1|fakeout,suckerpunch,vacuumwave,darkpulse|Lonely|,188,,188,,116||||5|',
			
			
			'|meowth|focussash|1|fakeout,seedbomb,bite,hypnosis|Jolly|,236,76,,,196||||5|]|dratini|lifeorb||dragondance,outrage,waterfall,extremespeed|Adamant|28,244,,,36,196||||5|]|munchlax|oranberry|1|recycle,pursuit,return,firepunch|Sassy|76,,196,,236,||||5|]|bronzor|oranberry||stealthrock,recycle,earthquake,hiddenpowerice|Relaxed|220,8,156,4,68,12||,30,30,,,||5|]|magby|lifeorb||flareblitz,machpunch,thunderpunch,overheat|Hasty|,240,,,,252||||5|]|gligar|choicescarf||uturn,earthquake,aerialace,aquatail|Jolly|,236,,,,236||||5|',
			
			'|machop|oranberry|1|bulletpunch,dynamicpunch,icepunch,protect|Adamant|196,196,36,,76,||||5|]|stunky|lifeorb|1|crunch,explosion,hiddenpowerground,suckerpunch|Jolly|12,252,,,,244||,,,30,30,||5|]|gligar|oranberry|1|aquatail,earthquake,stoneedge,swordsdance|Jolly|76,156,,,,236||||5|]|staryu|lifeorb|1|hiddenpowerfire,hydropump,icebeam,thunderbolt|Timid|,,,200,,240||,30,,30,,30||5|]|gastly|choicescarf||explosion,shadowball,sludgebomb,thunderbolt|Rash|36,76,,196,,196||||5|]|croagunk|lifeorb|1|fakeout,icepunch,suckerpunch,vacuumwave|Mild|,188,,188,,116||||5|',
			
			'|omanyte|lifeorb||hydropump,ancientpower,icebeam,stealthrock|Modest|236,,,36,,236||||5|]|stunky|lifeorb|1|crunch,suckerpunch,explosion,hiddenpowerground|Jolly|12,252,,,,244||,,,30,30,||5|]|gligar|choicescarf|1|earthquake,aquatail,stoneedge,uturn|Adamant|,236,,,,236||||5|]|chinchou|lifeorb||agility,hydropump,thunderbolt,icebeam|Modest|,,58,228,,220||||5|]|porygon|lifeorb||agility,triattack,icebeam,shadowball|Timid|76,,,236,,196||||5|]|staryu|lifeorb|1|hydropump,icebeam,thunderbolt,hiddenpowerfire|Timid|,,,240,,240||,30,,30,,30||5|',
			
			'|bronzor|oranberry||stealthrock,psychic,earthquake,raindance|Relaxed|220,8,152,4,68,12||||5|]|munchlax|oranberry|1|icepunch,bodyslam,earthquake,pursuit|Impish|236,,36,,236,||||5|]|gastly|lifeorb||substitute,shadowball,hiddenpowerfighting,explosion|Naive|,76,,200,,200||,,30,30,30,30||5|]|mantyke|oranberry||raindance,hydropump,icebeam,hiddenpowerelectric|Modest|36,,36,200,36,196||,,,30,,||5|]|croagunk|lifeorb|1|fakeout,suckerpunch,vacuumwave,icepunch|Lonely|,188,,188,,116||||5|]|gligar|oranberry||swordsdance,earthquake,stoneedge,aquatail|Jolly|,236,,,,236||||5|',
			
			'|machop|oranberry|1|dynamicpunch,icepunch,payback,bulletpunch|Adamant|116,196,36,,76,76||||5|]|houndour|lifeorb|1|suckerpunch,crunch,fireblast,pursuit|Lonely|,196,,196,36,76||||5|]|aron|oranberry|1|rockpolish,headsmash,earthquake,magnetrise|Jolly|36,196,36,,36,196||||5|]|wynaut|oranberry||encore,counter,mirrorcoat,destinybond|Impish|76,,132,,212,12||||5|]|chinchou|oranberry||agility,hydropump,thunderbolt,icebeam|Modest|,,52,228,,220||||5|]|psyduck|choicescarf|1|hydropump,icebeam,crosschop,hiddenpowergrass|Naive|,24,,240,,236||,30,,30,,||5|',
			
			'|chimchar|focussash||fakeout,overheat,hiddenpowergrass,stealthrock|Hasty|4,56,,216,4,188||,30,,30,,||5|]|gligar|oranberry|1|swordsdance,agility,batonpass,earthquake|Impish|156,,76,,236,||||5|]|teddiursa|toxicorb|1|facade,closecombat,crunch,protect|Jolly|36,196,36,,36,196||||5|]|munchlax|oranberry|1|return,earthquake,pursuit,firepunch|Adamant|,236,36,,236,||||5|]|elekid|lifeorb||thunderbolt,icepunch,lowkick,psychic|Hasty|,92,,160,,240||||5|]|snover|lifeorb||swordsdance,substitute,iceshard,woodhammer|Adamant|36,184,36,,36,120||||5|',
			
			'|houndour|focussash||suckerpunch,taunt,overheat,reversal|Naive|,76,,196,,236||||5|]|gligar|choicescarf|1|uturn,earthquake,aquatail,aerialace|Adamant|,236,,,,236||||5|]|magnemite|oranberry||magnetrise,substitute,thunderbolt,hiddenpowerice|Modest|76,,40,236,,156||,30,30,,,||5|]|bronzor|oranberry||psychic,earthquake,hiddenpowerice,stealthrock|Relaxed|220,8,152,4,68,12||,30,30,,,||5|]|totodile|lifeorb||swordsdance,waterfall,return,aquajet|Jolly|36,236,4,,52,172||||5|]|snover|oranberry||blizzard,woodhammer,iceshard,hiddenpowerfire|Adamant|196,184,36,24,,40||,30,,30,,30||5|',
			
			'|gastly|focussash||trickroom,explosion,shadowball,hypnosis|Quiet|36,,166,196,76,||,,,,,0||5|]|munchlax|oranberry|1|return,earthquake,pursuit,firepunch|Adamant|,236,36,,236,||||5|]|numel|lifeorb||fireblast,earthquake,hiddenpowerelectric,return|Quiet|36,196,36,240,,||,,,30,,||5|]|porygon|oranberry||trickroom,triattack,thunderbolt,recover|Quiet|236,,36,236,,||,0,,,,||5|]|cubone|thickclub||earthquake,doubleedge,firepunch,icebeam|Brave|196,196,76,,36,||,,,,,0||5|]|slowpoke|oranberry|1|fireblast,aquatail,slackoff,trickroom|Relaxed|196,,236,,36,||||5|',
			
			'|kabuto|focussash||stealthrock,aquajet,rockslide,earthpower|Naughty|,196,,76,,236||||5|]i|chinchou|choicescarf||hydropump,thunderbolt,icebeam,hiddenpowergrass|Modest|,,52,232,,220||,30,,30,,||5|]u|barboach|oranberry|1|dragondance,earthquake,waterfall,return|Adamant|36,212,12,,28,196||||5|]wesleys theory|mantyke|lifeorb|1|agility,hydropump,icebeam,hiddenpowerflying|Modest|76,,36,200,,196||30,30,30,30,30,||5|]politics|horsea|lifeorb||raindance,hydropump,icebeam,hiddenpowergrass|Timid|,,36,200,76,196||,30,,30,,||5|]king kunta|totodile|lifeorb||swordsdance,aquajet,return,waterfall|Jolly|36,236,4,,52,172||||5|',
			
			'|drifloon|focussash|1|explosion,shadowball,suckerpunch,thunderbolt|Hasty|,116,,196,,196||||5|]|doduo|lifeorb|1|bravebird,return,quickattack,hiddenpowerfighting|Naughty|,240,,,,240||,,30,30,30,30||5|]|gligar|choicescarf|1|uturn,earthquake,aquatail,aerialace|Adamant|,236,,,,236||||5|]|taillow|toxicorb||facade,bravebird,quickattack,uturn|Jolly|36,236,,,,236||||5|]|magnemite|oranberry||magnetrise,substitute,thunderbolt,hiddenpowerice|Modest|76,,40,236,,156||,30,30,,,||5|]|diglett|focussash|1|earthquake,hiddenpowerice,suckerpunch,substitute|Hasty|,240,,,,236||,30,30,,,||5|',
			
			'|gastly|focussash||hypnosis,shadowball,sludgebomb,explosion|Hasty|,76,,196,,196||||5|]|gligar|choicescarf|1|uturn,earthquake,aquatail,aerialace|Adamant|,236,,,,236||||5|]|bronzor|oranberry||psychic,earthquake,hiddenpowerice,stealthrock|Relaxed|220,8,152,4,68,12||,30,30,,,||5|]|ponyta|oranberry|1|fireblast,return,quickattack,hiddenpowergrass|Hasty|36,240,,,,196||,30,,30,,||5|]|croagunk|lifeorb|1|fakeout,suckerpunch,vacuumwave,darkpulse|Lonely|,188,,188,,116||||5|]|bagon|oranberry||dragondance,outrage,firefang,dragonclaw|Adamant|,236,36,,36,196|||S|5|',
			
			'|diglett|focussash|1|stealthrock,earthquake,suckerpunch,protect|Jolly|36,236,,,,236||||5|]|bellsprout|lifeorb||swordsdance,seedbomb,suckerpunch,sleeppowder|Jolly|36,236,,,36,196||||5|]|munchlax|oranberry|1|sunnyday,return,earthquake,pursuit|Sassy|156,,196,,156,||||5|]|bronzor|heatrock||sunnyday,psychic,earthquake,hiddenpowerice|Relaxed|220,8,152,4,68,12||,30,30,,,||5|]|ponyta|oranberry|1|fireblast,solarbeam,sunnyday,hiddenpowerelectric|Timid|72,,,240,,196||,3,,30,,|S|5|]|machop|oranberry|1|bulkup,dynamicpunch,bulletpunch,icepunch|Adamant|196,36,36,,236,||||5|',
			
			'|abra|lightclay|1|reflect,lightscreen,encore,psychic|Timid|236,,76,,,196||||5|]|gligar|oranberry|1|swordsdance,agility,batonpass,earthquake|Impish|156,,76,,236,||||5|]|bronzor|lightclay||reflect,lightscreen,psychic,stealthrock|Sassy|220,4,148,4,68,12||,0,,,,||5|]|mankey|choicescarf||closecombat,uturn,payback,icepunch|Adamant|116,196,,,,196||||5|]|cranidos|lifeorb||rockpolish,stoneedge,earthquake,icebeam|Naughty|60,236,,,,212||||5|]|bidoof|oranberry||substitute,return,quickattack,aquatail|Jolly|44,236,36,,,188||||5|',
			
			'|gligar|focussash|1|stealthrock,earthquake,quickattack,aquatail|Jolly|,236,,,,236||||5|]|wailmer|choicescarf||waterspout,hydropump,icebeam,hiddenpowerelectric|Modest|36,,76,200,,196||,3,,30,,||5|]|bronzor|oranberry||psychic,earthquake,recycle,hiddenpowerfire|Relaxed|220,8,152,4,68,12||,30,,30,,30||5|]|snover|oranberry||blizzard,woodhammer,iceshard,swordsdance|Adamant|196,184,36,,52,40||||5|]|gastly|choicescarf||shadowball,sludgebomb,hiddenpowerground,explosion|Timid|36,,40,200,,200||,,,30,30,||5|]|machop|oranberry|1|bulkup,dynamicpunch,bulletpunch,icepunch|Adamant|196,36,36,,236,||||5|',
			
			
			'|staryu|oranberry|1|rapidspin,hydropump,thunderbolt,icebeam|Timid|36,,,196,,236||,0,,,,|S|5|]|magnemite|oranberry||magnetrise,substitute,thunderbolt,hiddenpowerice|Modest|76,,40,236,,156||,30,30,,,|S|5|]|snover|lifeorb||swordsdance,substitute,iceshard,seedbomb|Adamant|36,184,36,,36,120|||S|5|]|gligar|choicescarf|1|uturn,earthquake,aquatail,aerialace|Jolly|,236,,,,236|||S|5|]|gastly|oranberry||substitute,hypnosis,sludgebomb,shadowball|Timid|4,,,196,112,196|||S|5|]|aron|lifeorb|1|rockpolish,headsmash,earthquake,ironhead|Adamant|36,196,36,,36,196|||S|5|',
			
			'|gastly|focussash||trickroom,explosion,shadowball,hypnosis|Quiet|36,,166,196,76,||,,,,,0||5|]|bronzor|oranberry||trickroom,psychic,earthquake,hiddenpowerice|Relaxed|220,8,152,4,68,12||,,,,,2||5|]|slowpoke|oranberry|1|flamethrower,aquatail,slackoff,trickroom|Relaxed|196,,236,,36,||||5|]|porygon|oranberry||trickroom,triattack,thunderbolt,shadowball|Quiet|236,,36,236,,||||5|]|cubone|thickclub||earthquake,doubleedge,firepunch,icebeam|Brave|196,196,76,,36,||,,,,,0||5|]|makuhita|oranberry||bellydrum,closecombat,bulletpunch,icepunch|Brave|180,,116,,36,||||5|',
			
			'|drifloon|focussash|1|raindance,explosion,suckerpunch,thunder|Naive|,196,,116,,196||||5|]rssp1|bronzor|damprock||raindance,psychic,stealthrock,hiddenpowerfighting|Bold|220,,152,4,68,16||,3,30,30,30,30||5|]cheek pouch|voltorb|damprock|1|raindance,thunder,explosion,taunt|Hasty|36,40,,236,,196||||5|]nineage|croagunk|lifeorb|1|fakeout,suckerpunch,vacuumwave,darkpulse|Lonely|,188,,188,,116||||5|]soldier|mantyke|lifeorb||hydropump,icebeam,hiddenpowerflying,raindance|Modest|76,,36,200,,196||30,2,30,30,30,||5|]sparktrain|buizel|lifeorb||waterfall,aquajet,return,bulkup|Jolly|,236,,,36,236||||5|',
			
			'|dratini|focussash||protect,dracometeor,surf,extremespeed|Hasty|28,84,,196,,196||||5|]|stunky|lifeorb|1|crunch,suckerpunch,explosion,fireblast|Hasty|12,252,,,,244||||5|]|gastly|lifeorb||substitute,shadowball,sludgebomb,hypnosis|Modest|,,36,200,,200||,0,,,,|S|5|]|ponyta|oranberry|1|fireblast,return,quickattack,hiddenpowergrass|Hasty|36,240,,,,196||,30,,30,,|S|5|]|gligar|choicescarf|1|uturn,earthquake,aquatail,aerialace|Jolly|,236,,,,236|||S|5|]|riolu|lifeorb|1|agility,highjumpkick,crunch,icepunch|Adamant|,196,36,,36,196||||5|',
			
			'|wingull|focussash||airslash,icebeam,hiddenpowerground,quickattack|Naive|,32,,240,,236||,,,30,30,||5|]|chinchou|lifeorb||agility,hydropump,thunderbolt,hiddenpowerfire|Modest|,,52,228,,220||,2,,30,,30||5|]|bronzor|oranberry||psychic,stealthrock,recycle,hiddenpowerfire|Bold|220,,152,4,68,16||,2,,30,,30||5|]|dratini|lifeorb||substitute,extremespeed,fireblast,dracometeor|Lonely|,244,,116,,116||||5|]|bagon|oranberry||dragondance,outrage,firefang,dragonclaw|Adamant|,236,36,,36,196||||5|]|gligar|choicescarf|1|uturn,earthquake,aquatail,aerialace|Jolly|,236,,,,236|||S|5|',
			
			'|carvanha|focussash||hydropump,icebeam,taunt,aquajet|Timid|,36,,236,,236||||5|]|stunky|lifeorb|1|pursuit,crunch,fireblast,suckerpunch|Naive|,252,,12,,244||||5|]|houndour|lifeorb||fireblast,darkpulse,suckerpunch,willowisp|Timid|,,76,196,,236||||5|]|bronzor|oranberry||psychic,stealthrock,recycle,hiddenpowerfire|Bold|220,,152,4,68,16||,2,,30,,30||5|]|mankey|choicescarf||closecombat,payback,icepunch,uturn|Jolly|,196,,,76,196||||5|]|krabby|oranberry|1|agility,swordsdance,crabhammer,xscissor|Adamant|,236,,,76,196||||5|'
			
			],
			
			gen5pu:[
			
			'|torterra|leftovers||stealthrock,woodhammer,earthquake,synthesis|Adamant|252,128,128,,,|||||]|chinchou|eviolite||voltswitch,scald,rest,sleeptalk|Calm|252,,,,252,4||,0,,,,|||]|fraxure|eviolite|1|taunt,dragondance,outrage,superpower|Jolly|,252,,,4,252|||||]|rotomfrost|choicescarf||voltswitch,blizzard,thunderbolt,trick|Timid|,,,252,4,252||,0,,,,|||]|volbeat|leftovers|H|thunderwave,encore,uturn,roost|Impish|248,,252,,8,|||||]|klang|eviolite|H|shiftgear,geargrind,rest,sleeptalk|Impish|248,,144,,,116|||||',
			
			'|maractus|leftovers||spikes,gigadrain,synthesis,leechseed|Bold|252,,120,,,136||,0,,,,|||]|bronzor|eviolite||stealthrock,psywave,toxic,rest|Bold|252,,144,,112,||,0,,,,|||]|audino|leftovers|1|wish,protect,healbell,frustration|Careful|252,4,,,252,|||||0]|duosion|eviolite|1|calmmind,acidarmor,psyshock,recover|Bold|252,,252,4,,||,0,,,,|||]|frillish|eviolite||scald,willowisp,nightshade,recover|Calm|252,,4,,252,||,0,,,,|||]|zweilous|eviolite||dragontail,roar,sleeptalk,rest|Careful|252,4,,,252,|||||',
			
			'|beheeyem|leftovers|1|calmmind,recover,psychic,shadowball|Bold|252,,252,4,,||,0,,,,|||]|jumpluff|flyinggem||sleeppowder,swordsdance,acrobatics,seedbomb|Jolly|,252,4,,,252|||||]|mawile|leftovers|1|stealthrock,swordsdance,batonpass,ironhead|Impish|252,,252,,,4|||||]|simipour|choicespecs|H|hydropump,scald,icebeam,grassknot|Timid|,,4,252,,252||,0,,,,|||]|stunfisk|leftovers||scald,discharge,earthpower,toxic|Calm|252,,4,,252,||,0,,,,|||]|throh|choiceband||superpower,earthquake,stoneedge,sleeptalk|Adamant|252,252,,,,4|||||',
			
			'|zebstrika|choicespecs|H|voltswitch,thunderbolt,overheat,hiddenpowergrass|Timid|,,4,252,,252||,2,,30,,|||]|chinchou|eviolite||voltswitch,scald,healbell,thunderwave|Calm|252,,208,,48,||,0,,,,|||]|torterra|leftovers||stealthrock,woodhammer,synthesis,earthquake|Adamant|252,156,100,,,|||||]|beheeyem|leftovers|H|calmmind,recover,psychic,shadowball|Relaxed|252,,252,4,,||,0,,,,|||]Shoutout Swagger|murkrow|eviolite|H|thunderwave,taunt,bravebird,roost|Jolly|,252,4,,,252|||||]|machoke|eviolite|1|dynamicpunch,rockslide,icepunch,sleeptalk|Adamant|252,128,128,,,|||||',
			
			'|muk|choiceband|H|gunkshot,shadowsneak,firepunch,explosion|Adamant|252,252,,,4,|||||]|simipour|lifeorb|H|superpower,hydropump,icebeam,hiddenpowerelectric|Hasty|,4,,252,,252||,,,30,,|||]|rotomfrost|choicescarf||voltswitch,thunderbolt,blizzard,trick|Timid|,,,252,4,252||,0,,,,|||]|torterra|leftovers||stealthrock,woodhammer,earthquake,synthesis|Adamant|180,252,,,,76|||||]|fraxure|eviolite|1|dragondance,outrage,lowkick,toxic|Jolly|,252,4,,,252|||||]|rapidash|lifeorb|1|flareblitz,wildcharge,lowkick,morningsun|Jolly|,252,,,4,252|||||',
			
			'|gothorita|choicescarf|H|psychic,toxic,rest,trick|Bold|252,,172,,,84||,0,,,,|||]|muk|leftovers|1|poisonjab,curse,sleeptalk,rest|Careful|252,4,,,252,|||||]|torterra|leftovers||stealthrock,woodhammer,earthquake,synthesis|Adamant|252,128,128,,,|||||]|natu|colburberry|H|nightshade,thunderwave,uturn,roost|Bold|248,,204,,,56|||||]|vullaby|eviolite|1|foulplay,bravebird,whirlwind,roost|Bold|252,,252,,,4|||||]|chinchou|eviolite||scald,voltswitch,icebeam,rest|Calm|252,,4,,252,||,0,,,,|||',
			
			'|combusken|eviolite|H|fireblast,focusblast,substitute,protect|Modest|,,,252,4,252||,0,,,,|||]|graveler|eviolite|1|earthquake,stoneedge,stealthrock,rest|Impish|252,,252,,4,|||||]|natu|colburberry|H|nightshade,reflect,uturn,roost|Impish|248,,204,,,56|||||]|persian|choiceband||doubleedge,seedbomb,switcheroo,uturn|Jolly|,252,,,4,252|||||]|beheeyem|leftovers|H|psychic,signalbeam,nastyplot,recover|Modest|172,,,252,,84||,0,,,,|||]|maractus|leftovers||spikes,gigadrain,synthesis,leechseed|Bold|252,,120,,,136||,0,,,,|||',
			
			'|combusken|eviolite|H|fireblast,focusblast,substitute,protect|Modest|,,,252,4,252||,0,,,,|||]|chinchou|eviolite||voltswitch,scald,rest,sleeptalk|Calm|252,,,,252,4||,0,,,,|||]|graveler|eviolite|1|earthquake,stoneedge,stealthrock,rest|Impish|252,,252,,4,|||||]|zweilous|choiceband||outrage,crunch,superpower,headsmash|Jolly|,252,,,4,252|||||]|vileplume|blacksludge|H|gigadrain,sludgebomb,sleeppowder,moonlight|Bold|252,,252,,4,||,0,,,,|||]Shoutout Swagger|murkrow|eviolite|H|thunderwave,taunt,bravebird,roost|Jolly|,252,4,,,252|||||',
			
			'|monferno|focussash||overheat,taunt,stealthrock,endeavor|Timid|252,,,4,,252||,0,,,,|||]|rotomfrost|choicescarf||blizzard,thunderbolt,voltswitch,trick|Timid|,,,252,4,252||,0,,,,|||]|fraxure|eviolite|1|outrage,lowkick,taunt,dragondance|Adamant|,252,,,4,252|||||]|simipour|lifeorb|H|hydropump,icebeam,hiddenpowergrass,nastyplot|Timid|,,,252,4,252||,2,,30,,|||]|victreebel|lifeorb||sleeppowder,leafstorm,sludgebomb,suckerpunch|Rash|,4,,252,,252|||||]|vigoroth|eviolite||bulkup,taunt,slackoff,return|Careful|252,,,,224,32|||||',
			
			'|beedrill|focussash||endeavor,tailwind,toxicspikes,uturn|Jolly|252,,,,4,252|||||]|combusken|eviolite|H|fireblast,focusblast,substitute,protect|Modest|,,,252,4,252||,0,,,,|||]|dodrio|choiceband|1|bravebird,return,pursuit,quickattack|Jolly|,252,4,,,252|||||]|beheeyem|leftovers|1|nastyplot,recover,psychic,signalbeam|Bold|252,,252,4,,||,0,,,,|||]|rotomfrost|choicescarf||voltswitch,thunderbolt,blizzard,trick|Timid|,,,252,4,252||,0,,,,|||]|graveler|eviolite|1|earthquake,stoneedge,stealthrock,rest|Impish|252,,252,,4,|||||'
			
			],
			
			gen2nu:[
			
			'|dugtrio|leftovers||earthquake,sludgebomb,rockslide,substitute|||||||]|sudowoodo|leftovers||selfdestruct,rockslide,toxic,protect|||||||]|seadra|leftovers||hydropump,icebeam,hiddenpowerelectric,agility||||14,28,,,,|||]|raticate|leftovers||doubleedge,shadowball,superfang,hiddenpowerground||||14,24,,,,|||]|mrmime|leftovers||psychic,firepunch,thunderbolt,encore|||||||]|rapidash|leftovers||fireblast,doubleedge,sunnyday,hiddenpowerground||||14,24,,,,|||',
			
			'|pineco|leftovers||spikes,explosion,toxic,rapidspin|||||||]|dugtrio|leftovers||earthquake,sludgebomb,rockslide,doubleedge|||||||]|dewgong|leftovers||icebeam,surf,encore,protect|||||||]|rapidash|leftovers||fireblast,doubleedge,hiddenpowerground,agility||||14,24,,,,|||]|hitmontop|leftovers||curse,machpunch,hiddenpowerghost,rollingkick||||22,26,28,,,|||]|haunter|leftovers||explosion,psychic,thunderbolt,hiddenpowerfire||||6,28,24,,,|||',
			
			'|sudowoodo|leftovers||rockslide,toxic,selfdestruct,psychup|||||||]|arbok|leftovers||sludgebomb,earthquake,glare,curse|||||||]|murkrow|leftovers||drillpeck,pursuit,hiddenpowerdark,shadowball|||||||]|hitmontop|leftovers||rollingkick,machpunch,hiddenpowerdark,curse|||||||]|lickitung|leftovers||curse,bodyslam,sleeptalk,rest|||||||]|pikachu|lightball||thunderbolt,surf,hiddenpowerice,substitute||||,,26,,,|||',
			
			'|venomoth|leftovers||sleeppowder,stunspore,psychic,sludgebomb|||||||]|sudowoodo|leftovers||rockslide,selfdestruct,toxic,protect|||||||]|dugtrio|leftovers||earthquake,rockslide,sludgebomb,substitute|||||||]|octillery|leftovers||surf,icebeam,hiddenpowerelectric,return||||14,28,,,,|||]|hitmonchan|leftovers||agility,highjumpkick,return,hiddenpowerghost||||22,26,28,,,|||]|rapidash|leftovers||sunnyday,fireblast,return,hiddenpowerground||||14,24,,,,|||',
			
			'|haunter|leftovers||shadowball,hypnosis,thunderbolt,explosion|||||||]|murkrow|leftovers||drillpeck,hiddenpowerground,pursuit,shadowball||||14,24,,,,|||]|pikachu|lightball||sing,thunderbolt,hiddenpowerice,surf||||,,26,,,|||]|hitmontop|leftovers||hiddenpowerghost,machpunch,rollingkick,curse||||22,26,28,,,|||]|mantine|leftovers||surf,toxic,rest,sleeptalk|||||||]|dugtrio|leftovers||earthquake,rockslide,substitute,sludgebomb|||||||',
			
			'|venomoth|leftovers||sleeppowder,stunspore,sludgebomb,psychic|||||||]|pikachu|lightball||thunderbolt,surf,hiddenpowerice,substitute||||,,26,,,|||]|dunsparce|leftovers||glare,rest,sleeptalk,return|||||||]|murkrow|leftovers||drillpeck,drillpeck,pursuit,hiddenpowerground||||14,24,,,,|||]|dugtrio|leftovers||earthquake,rockslide,sludgebomb,substitute|||||||]|kingler|leftovers||substitute,return,swordsdance,surf|||||||',
			
			'|pikachu|lightball||thunderbolt,surf,hiddenpowerice,substitute||||,,26,,,|||]|mrmime|leftovers||psychic,thunderbolt,barrier,batonpass|||||||]|murkrow|leftovers||hiddenpowerground,drillpeck,pursuit,shadowball||||14,24,,,,|||]|dewgong|leftovers||icebeam,surf,encore,protect|||||||]|lickitung|leftovers||curse,bodyslam,sleeptalk,rest|||||||]|pineco|leftovers||spikes,explosion,toxic,rapidspin|||||||',
			
			'|dugtrio|miracleberry||earthquake,rockslide,sludgebomb,substitute|||||||]|ariados|berserkgene||hiddenpowerbug,sludgebomb,agility,batonpass||||,26,26,,,|||]|dewgong|leftovers||surf,icebeam,toxic,encore|||||||]|sudowoodo|leftovers||rockslide,selfdestruct,toxic,protect|||||||]|rapidash|leftovers||sunnyday,fireblast,doubleedge,hiddenpowerground||||14,24,,,,|||]My Bro|pikachu|lightball|1|thunderbolt,surf,hiddenpowerfire,substitute||||6,28,24,,,|||',
			
			'|poliwhirl|leftovers||bodyslam,earthquake,lovelykiss,bellydrum|||||||]|arbok|leftovers||sludgebomb,earthquake,glare,curse|||||||]|clefairy|leftovers||return,shadowball,bellydrum,rest|||||||]|dugtrio|miracleberry||earthquake,rockslide,sludgebomb,substitute|||||||]|mrmime|leftovers||psychic,thunderbolt,barrier,batonpass|Bashful|252,,252,252,252,252|||||]|haunter|leftovers|1|thunderbolt,hiddenpowerice,hypnosis,explosion||||,,26,,,|||',
			
			'|pikachu|leftovers|1|thunderbolt,surf,sing,substitute|||||||]|dugtrio|miracleberry||earthquake,rockslide,sludgebomb,substitute|||||||]|tangela|leftovers||gigadrain,sleeppowder,stunspore,synthesis|||||||]|venomoth|leftovers||sleeppowder,stunspore,sludgebomb,psychic|||||||]|sudowoodo|leftovers||rockslide,selfdestruct,toxic,protect|||||||]|hitmonchan|leftovers||agility,highjumpkick,return,hiddenpowerghost||||22,26,28,,,|||'
			
			],
			
			gen4uu:[
			
			'|mesprit|leftovers||stealthrock,grassknot,psychic,uturn|Modest|120,,,252,,136|||||]|leafeon|leftovers||doubleedge,swordsdance,leafblade,synthesis|Jolly|4,252,,,,252|||||]|swellow|toxicorb||facade,uturn,quickattack,bravebird|Jolly|4,252,,,,252|||||]|dugtrio|choiceband|1|earthquake,suckerpunch,beatup,stoneedge|Jolly|12,244,,,,252|||||]|kabutops|leftovers||aquajet,rapidspin,swordsdance,stoneedge|Adamant|120,252,,,,136|||||]|arcanine|leftovers||willowisp,flareblitz,extremespeed,morningsun|Careful|252,,4,,252,|||||',
			
			'|uxie|damprock||raindance,psychic,uturn,stealthrock|Bold|252,,252,,4,|||||]2ND MASCOT|ludicolo|lifeorb||hydropump,energyball,hiddenpowerpsychic,raindance|Modest|32,,,248,,228||,2,,,,30|||]SHAOLIN SLUM|kabutops|lifeorb||swordsdance,stoneedge,waterfall,aquajet|Adamant|,252,,,4,252||29,,,,,|||]OVERUSED MEME|dugtrio|choiceband|1|earthquake,stoneedge,toxic,beatup|Jolly|4,252,,,,252|||||]DAT CROAK|toxicroak|lifeorb|1|nastyplot,focusblast,sludgebomb,vacuumwave|Timid|8,,,248,,252||,0,,,,|||]STALEMATE|registeel|leftovers||curse,ironhead,rest,sleeptalk|Careful|252,4,,,252,|||||',
			
			'|moltres|choicespecs||overheat,airslash,hiddenpowergrass,uturn|Modest|,,,252,4,252||,30,,30,,|||]|venusaur|choicescarf||sleeppowder,leafstorm,sludgebomb,hiddenpowerrock|Timid|,,,252,4,252||,3,30,,30,30|||]|aggron|stoneplate|1|headsmash,earthquake,magnetrise,toxic|Adamant|,252,4,,,252|||||]|donphan|leftovers||stealthrock,earthquake,toxic,rapidspin|Impish|252,32,216,,,8|||||]|milotic|leftovers||surf,haze,toxic,recover|Bold|252,,188,,56,12||,0,,,,30|||]|clefable|leftovers|1|icebeam,thunderbolt,calmmind,softboiled|Calm|252,,32,,216,8||,0,,,,|||',
			
			'|mismagius|choicespecs||shadowball,thunderbolt,energyball,trick|Timid|,,,252,4,252||,0,,,,|||]|arcanine|leftovers||flareblitz,toxic,extremespeed,morningsun|Careful|248,,4,,252,4|||||]|kabutops|leftovers||swordsdance,aquajet,waterfall,stoneedge|Jolly|,252,,,4,252|||||]|sceptile|lifeorb||synthesis,leafstorm,focusblast,hiddenpowerice|Timid|,,,252,4,252||30,,30,,,|||]|donphan|leftovers||earthquake,headsmash,rapidspin,stealthrock|Adamant|252,252,,,,4|||||]|registeel|leftovers||ironhead,curse,rest,sleeptalk|Careful|252,,32,,224,|||||',
			
			'|mismagius|leftovers||taunt,willowisp,shadowball,thunderbolt|Timid|48,,,208,,252||,0,,,,|||]|registeel|leftovers||stealthrock,ironhead,thunderwave,counter|Impish|248,,96,,164,|||||]|venusaur|leftovers||swordsdance,powerwhip,earthquake,sleeppowder|Jolly|16,240,,,,252|||||]|milotic|leftovers||surf,hiddenpowergrass,recover,icebeam|Bold|248,,244,,,16||,2,,30,,|||]|houndoom|passhoberry|1|nastyplot,fireblast,darkpulse,hiddenpowergrass|Timid|,,,252,4,252||,2,,30,,|||]|primeape|choicescarf||closecombat,stoneedge,icepunch,uturn|Jolly|,252,,,4,252|||||',
			
			'|jynx|focussash||lovelykiss,icebeam,psychic,protect|Timid|,,,252,4,252||,0,,,,|||]|clefable|lifeorb|1|calmmind,icebeam,thunderbolt,softboiled|Modest|160,,,252,,96||,0,,,,|||]|feraligatr|leftovers||substitute,dragondance,waterfall,return|Adamant|100,252,,,,156|||||]|rhyperior|leftovers|1|stealthrock,stoneedge,earthquake,megahorn|Adamant|168,16,,,240,84|||||]|milotic|leftovers||surf,icebeam,haze,recover|Calm|252,,192,,56,8|||||]|toxicroak|blacksludge|1|swordsdance,icepunch,lowkick,suckerpunch|Adamant|228,252,,,,28|||||',
			
			'|omastar|focussash||stealthrock,spikes,surf,icebeam|Timid|4,,,252,,252|||||]|swellow|toxicorb||protect,facade,bravebird,quickattack|Jolly|,252,4,,,252|||||]|houndoom|passhoberry|1|nastyplot,fireblast,darkpulse,hiddenpowergrass|Timid|,,,252,4,252||,30,,30,,|||]|rotom|choicescarf||thunderbolt,shadowball,hiddenpowerice,trick|Timid|4,,,252,,252||,30,30,,,|||]|exeggutor|lifeorb||sunnyday,solarbeam,psychic,explosion|Rash|,4,,252,,252|||||]|toxicroak|lifeorb|1|nastyplot,vacuumwave,sludgebomb,darkpulse|Timid|4,,,252,,252|||||',
			
			'|ambipom|silkscarf||fakeout,return,pursuit,uturn|Jolly|,252,,,4,252|||||]|drapion|leftovers||taunt,crunch,swordsdance,earthquake|Jolly|252,,,,120,136|||||]|kabutops|leftovers||stoneedge,aquajet,swordsdance,rapidspin|Adamant|132,252,,,,124|||||]|torterra|leftovers||woodhammer,stealthrock,earthquake,synthesis|Careful|252,,4,,252,|||||]|moltres|lifeorb||fireblast,airslash,hiddenpowergrass,roost|Timid|,,,252,4,252||,30,,30,,|||]|poliwrath|leftovers||waterfall,focuspunch,substitute,encore|Adamant|152,252,,,,104|||||',
			
			'|rotom|leftovers||substitute,thunderbolt,willowisp,shadowball|Timid|252,,4,,,252|||||]|kabutops|leftovers||stoneedge,aquajet,swordsdance,rapidspin|Adamant|132,252,,,,124|||||]|milotic|leftovers||surf,hiddenpowergrass,toxic,recover|Bold|248,,252,,,8||,30,,30,,|||]|arcanine|choiceband||flareblitz,extremespeed,thunderfang,morningsun|Jolly|,252,,,4,252|||||]|torterra|leftovers||woodhammer,earthquake,stealthrock,synthesis|Careful|252,,,,252,4|||||]|drapion|leftovers||crunch,swordsdance,taunt,earthquake|Jolly|252,,,,120,136|||||',
			
			'|mesprit|colburberry||psychic,uturn,grassknot,stealthrock|Brave|252,96,,160,,|||||]|azumarill|leftovers|1|substitute,focuspunch,return,aquajet|Adamant|252,224,,,,32|||||]|registeel|leftovers||curse,ironhead,rest,sleeptalk|Careful|248,,,,240,20|||||]|arcanine|leftovers||flareblitz,extremespeed,toxic,morningsun|Careful|252,4,,,252,|||||]|donphan|leftovers||earthquake,rapidspin,odorsleuth,headsmash|Adamant|224,252,,,8,24|||||]|sceptile|lifeorb||leafstorm,focusblast,hiddenpowerice,synthesis|Timid|,,,252,4,252||,2,30,,,|||',
			
			'|cloyster|leftovers||surf,spikes,toxicspikes,rapidspin|Calm|252,,,,252,4||,0,,,,|||]|mismagius|leftovers||willowisp,taunt,painsplit,shadowball|Timid|252,,,4,,252||,0,,,,|||]|aggron|shucaberry|1|headsmash,magnetrise,stealthrock,lowkick|Adamant|200,252,,,,56|||||]|sceptile|lifeorb||leafstorm,hiddenpowerice,focusblast,synthesis|Timid|,,,252,4,252||,2,30,,,|||]|houndoom|lifeorb|1|pursuit,darkpulse,fireblast,suckerpunch|Hasty|,4,,252,,252|||||]|primeape|choicescarf||stoneedge,uturn,closecombat,earthquake|Jolly|,252,,,4,252|||||'
			
			],
			
			gen5uu:[
			
			'|golurk|leftovers||stealthrock,earthquake,protect,icepunch|Adamant|236,252,,,,20|||||]|druddigon|choiceband||outrage,earthquake,firepunch,sleeptalk|Adamant|196,252,,,,60|||||]|heracross|choicescarf|H|closecombat,megahorn,stoneedge,earthquake|Jolly|,252,,,4,252|||||]|zapdos|lifeorb||thunderbolt,heatwave,hiddenpowergrass,roost|Timid|,,,252,4,252||,30,,30,,|||]|bisharp|lifeorb||swordsdance,ironhead,suckerpunch,pursuit|Adamant|,252,,,4,252|||||]|suicune|leftovers||calmmind,hydropump,icebeam,hiddenpowerelectric|Timid|,,,252,4,252||,,,30,,|||',
			
			'|mew|leftovers||softboiled,willowisp,taunt,psyshock|Timid|248,,,,84,176|||||]|rhyperior|leftovers|1|rockblast,earthquake,stealthrock,dragontail|Adamant|244,16,,,248,|M||||]|qwilfish|blacksludge|H|spikes,scald,painsplit,taunt|Bold|248,,200,,,60|F||||]|heracross|leftovers|1|swordsdance,megahorn,stoneedge,closecombat|Jolly|,252,4,,,252|F||||]|togekiss|leftovers|1|airslash,healbell,roost,nastyplot|Bold|248,,160,,,100|M||||]|umbreon|leftovers||wish,foulplay,protect,toxic|Calm|252,,,,252,4|M||||',
			
			'|rhyperior|lifeorb|1|rockpolish,stoneedge,earthquake,megahorn|Jolly|,252,,,4,252|||||]|cacturne|focussash|H|spikes,counter,darkpulse,focusblast|Timid|,,,252,4,252|||||]|hitmonlee|liechiberry|H|endure,reversal,stoneedge,machpunch|Adamant|,252,,,4,252|||||]|azelf|lifeorb||psychic,fireblast,shadowball,explosion|Hasty|,4,,252,,252|||||]|venomoth|insectplate|1|quiverdance,sleeppowder,bugbuzz,psychic|Timid|,,,252,4,252|||||]|cobalion|expertbelt||stealthrock,voltswitch,hiddenpowerice,closecombat|Naive|,4,,252,,252||,30,30,,,|||',
			
			'|zapdos|leftovers||thunderbolt,hiddenpowerflying,chargebeam,roost|Timid|252,,,,80,176||30,2,30,30,30,|||]|slowking|leftovers|H|scald,calmmind,dragontail,slackoff|Relaxed|248,16,244,,,|||||]|roserade|blacksludge||spikes,gigadrain,sludgebomb,rest|Calm|248,,,,220,40||,0,,,,|||]|gligar|eviolite|H|stealthrock,earthquake,knockoff,roost|Impish|232,,216,,,60|||||]|umbreon|leftovers||foulplay,wish,protect,healbell|Calm|252,,4,,252,||,0,,,,|||]|hitmontop|leftovers||rapidspin,toxic,rest,closecombat|Impish|252,,252,,,4|||||',
			
			'|raikou|leftovers||voltswitch,thunderbolt,hiddenpowerice,calmmind|Timid|,,4,252,,252||,2,30,,,|||]|cresselia|leftovers||calmmind,psyshock,hiddenpowerfighting,substitute|Bold|252,,176,,,80||30,2,,30,30,30|||]|togekiss|leftovers|1|nastyplot,airslash,thunderwave,roost|Timid|176,,,80,,252||,0,,,,|||]|umbreon|leftovers||wish,foulplay,healbell,protect|Calm|252,,4,,252,|||||]|gligar|eviolite|H|stealthrock,earthquake,aerialace,roost|Impish|236,,216,,,56|||||]|blastoise|leftovers|H|scald,toxic,rapidspin,roar|Bold|252,,252,,4,|||||',
			
			'|mew|normalgem||stealthrock,taunt,tailwind,explosion|Jolly|,252,,,4,252|||||]|victini|charcoal||vcreate,zenheadbutt,brickbreak,grassknot|Lonely|,252,,4,,252|||||]|tornadus|lifeorb||hurricane,superpower,grassknot,tailwind|Hasty|,4,,252,,252|||||]|suicune|leftovers||calmmind,hydropump,icebeam,hiddenpowerelectric|Timid|,,,252,4,252||,3,,30,,|||]|nidoking|lifeorb|H|earthpower,icebeam,fireblast,shadowball|Timid|,,,252,4,252||,0,,,,|||]|druddigon|choiceband|H|outrage,earthquake,dragonclaw,suckerpunch|Adamant|132,240,,,4,132|||||',
			
			'|victini|choiceband||vcreate,boltstrike,zenheadbutt,uturn|Adamant|,252,,,4,252|||||]|xatu|choicescarf|H|psyshock,heatwave,grassknot,trick|Timid|,,,252,4,252||,0,,,,|||]|seismitoad|choicespecs|H|hydropump,sludgewave,earthpower,grassknot|Modest|136,,,252,,120|||||]|cobalion|leftovers||stealthrock,thunderwave,sacredsword,hiddenpowerice|Lax|248,,220,,,40||,30,30,,,|||]|amoonguss|blacksludge|H|spore,stunspore,gigadrain,sludgebomb|Bold|248,,252,,8,||,0,,,,|||]|snorlax|leftovers|1|whirlwind,rest,sleeptalk,bodyslam|Careful|144,,188,,176,|||||',
			
			'|zapdos|leftovers||thunderbolt,toxic,roost,substitute|Calm|248,,180,,56,24||,0,,,,|||]|swampert|leftovers||stealthrock,scald,earthquake,roar|Relaxed|252,,252,,,4|||||]|umbreon|leftovers||foulplay,healbell,wish,protect|Calm|252,,4,,252,|||||]|roserade|focussash||gigadrain,spikes,toxicspikes,sludgebomb|Timid|,,,252,,252||,0,,,,|||]|mew|lifeorb||swordsdance,drainpunch,suckerpunch,zenheadbutt|Jolly|,252,,,4,252|||||]|heracross|choicescarf|H|closecombat,megahorn,earthquake,stoneedge|Jolly|4,252,,,,252|||||',
			
			'|mew|choicescarf||uturn,gigadrain,psychic,trick|Timid|4,,,252,,252|||||]|darmanitan|choicescarf||flareblitz,rockslide,superpower,uturn|Jolly|4,252,,,,252|||||]|lanturn|leftovers||voltswitch,scald,healbell,toxic|Sassy|252,,,4,252,|||||]|xatu|rockyhelmet|H|uturn,nightshade,grassknot,roost|Relaxed|252,,252,,4,|||||]|mienshao|lifeorb|1|fakeout,hijumpkick,stoneedge,uturn|Jolly|4,252,,,,252|||||]|gligar|eviolite|H|roost,stealthrock,uturn,earthquake|Impish|252,4,252,,,|||||',
			
			'|roserade|lifeorb||leafstorm,sludgebomb,sleeppowder,toxicspikes|Timid|,,,252,4,252|M|,0,,,,|||]|rhyperior|leftovers|1|stealthrock,earthquake,rockblast,dragontail|Adamant|248,16,,,244,|M||||]|cofagrigus|leftovers||trickroom,nastyplot,shadowball,hiddenpowerfighting|Quiet|248,,8,252,,|M|,2,30,30,30,2|||]|heracross|choicescarf|H|closecombat,megahorn,stoneedge,earthquake|Jolly|,252,,,4,252|M||||]|slowking|lifeorb|H|trickroom,surf,psyshock,nastyplot|Quiet|248,,8,252,,|M|,,,,,0|||]|escavalier|choiceband||ironhead,megahorn,pursuit,sleeptalk|Brave|248,252,,,8,|M|,,,,,0|||',
			
			'|victini|choicescarf||vcreate,uturn,boltstrike,flareblitz|Jolly|,252,,,4,252|||||]|durant|choiceband|1|ironhead,thunderfang,xscissor,superpower|Jolly|,252,,,4,252|M||||]|nidoqueen|lifeorb|H|earthpower,icebeam,focusblast,stealthrock|Modest|168,,,252,,88||,0,,,,|||]|zapdos|lifeorb||thunderbolt,hiddenpowergrass,roost,heatwave|Timid|,,,252,,252||,2,,30,,|||]|druddigon|choiceband|H|suckerpunch,outrage,earthquake,dragonclaw|Adamant|208,252,,,,48|F||||]|blastoise|leftovers||rapidspin,scald,roar,toxic|Bold|248,,236,,,24|M||||',
			
			'|qwilfish|blacksludge|H|taunt,spikes,waterfall,painsplit|Impish|232,,220,,,56|M||||]|rotom|choicespecs||voltswitch,shadowball,trick,thunderbolt|Timid|,,,252,4,252||,0,,,,|||]|rhyperior|leftovers|1|stealthrock,earthquake,rockblast,dragontail|Adamant|248,16,,,236,8|M||||]|shaymin|leftovers||seedflare,protect,psychic,leechseed|Timid|80,,,252,,176||,0,,,,|||]|mienshao|choicescarf|H|highjumpkick,uturn,aerialace,stoneedge|Jolly|,252,,,4,252|M||||]|escavalier|choiceband||ironhead,megahorn,pursuit,sleeptalk|Adamant|160,252,,,,96|M||||'
			
			],
			
			gen3uu:[
			
			'|nidoking|softsand||earthquake,megahorn,shadowball,icebeam|Jolly|4,252,,,,252|||||]|sharpedo|salacberry||endure,hydropump,icebeam,crunch|Modest|4,,,252,,252||,0,,,,|||]|kangaskhan|leftovers||doubleedge,earthquake,shadowball,focuspunch|Jolly|4,252,,,,252|||||]|scyther|salacberry||swordsdance,aerialace,hiddenpowerground,batonpass|Jolly|4,252,,,,252||,,,30,30,|||]|hypno|leftovers||psychic,reflect,toxic,wish|Sassy|252,,156,,100,||,0,,,,|||]|omastar|mysticwater||raindance,hydropump,icebeam,hiddenpowergrass|Modest|40,,,252,,216||,30,,30,,|||',
			
			'|ninetales|leftovers||willowisp,flamethrower,hiddenpowergrass,quickattack|Timid|4,,,252,,252||,30,,30,,|||]|tentacruel|leftovers|1|hydropump,icebeam,gigadrain,rapidspin|Timid|,,,252,4,252||,0,,,,|||]|lunatone|leftovers||calmmind,psychic,icebeam,batonpass|Bold|252,,160,,,96||,0,,,,|||]|shiftry|lumberry||sunnyday,solarbeam,hiddenpowerfire,explosion|Mild|,4,,252,,252||,30,,30,,30|||]|kangaskhan|choiceband||doubleedge,earthquake,shadowball,focuspunch|Jolly|4,252,,,,252|||||]|quagsire|leftovers|1|icebeam,earthquake,sleeptalk,rest|Relaxed|252,,216,,40,|||||',
			
			'|nidoking|choiceband||sludgebomb,earthquake,megahorn,icebeam|Jolly|,252,4,,,252|||||]|omastar|mysticwater||raindance,hydropump,icebeam,hiddenpowergrass|Modest|,,4,252,,252||,2,,30,,|||]|gorebyss|mysticwater||raindance,hydropump,hiddenpowergrass,icebeam|Modest|,,4,252,,252||,2,,30,,|||]|scyther|choiceband||hiddenpowerflying,silverwind,pursuit,quickattack|Jolly|,208,,,48,252||30,30,30,30,30,|||]|kangaskhan|leftovers||wish,return,shadowball,earthquake|Adamant|208,220,20,,,60|||||]|cradily|leftovers||toxic,recover,rockslide,earthquake|Careful|192,180,36,,84,16|||||',
			
			'|kangaskhan|leftovers||doubleedge,shadowball,earthquake,rest|Adamant|212,252,,,,44|||||]|muk|leftovers||sludgebomb,icepunch,explosion,hiddenpowerghost|Lonely|252,252,,4,,||,,30,,30,|||]|hypno|leftovers||wish,thunderwave,psychic,protect|Bold|252,,192,,,64||,0,,,,|||]|pinsir|leftovers||hiddenpowerbug,doubleedge,earthquake,swordsdance|Jolly|,252,4,,,252||,30,30,,30,|||]|lunatone|leftovers||calmmind,hypnosis,psychic,icebeam|Bold|252,,240,,,16||,0,,,,|||]|scyther|salacberry||endure,swordsdance,reversal,hiddenpowerbug|Adamant|128,252,,,,128||,30,30,,30,|||',
			
			'|omastar|leftovers||spikes,raindance,hydropump,icebeam|Modest|160,,,252,,96|M|,0,,,,|||]|hypno|leftovers||wish,protect,psychic,toxic|Bold|252,,176,,80,|M|,0,,,,|||]|gligar|leftovers||earthquake,hiddenpowerflying,irontail,swordsdance|Adamant|16,240,,,,252|M|30,30,30,30,30,|||]|tentacruel|leftovers||hydropump,sludgebomb,rapidspin,swordsdance|Hasty|,244,,80,,184|F|,,,30,30,|||]|kangaskhan|choiceband||return,earthquake,shadowball,focuspunch|Jolly|,252,,,4,252|||||]|sharpedo|salacberry||endure,crunch,hydropump,icebeam|Modest|,,,252,4,252||,0,,,,|||',
			
			'|scyther|salacberry||swordsdance,hiddenpowerbug,batonpass,aerialace|Jolly|,252,4,,,252|M|,30,30,,30,|||]mana|electrode|petayaberry||endure,thunderbolt,hiddenpowerice,explosion|Hasty|,4,,252,,252||,30,30,,,|||]is|kabutops|salacberry|1|flail,rockslide,endure,swordsdance|Jolly|12,252,68,,,176|||||]fat|nidoking|leftovers||earthquake,sludgebomb,megahorn,icebeam|Hasty|4,252,,,,252|||||]and|kangaskhan|leftovers||doubleedge,earthquake,rest,shadowball|Adamant|248,216,,,,44|||||]gay|misdreavus|leftovers||calmmind,thunderbolt,hiddenpowerice,thunderwave|Calm|240,,176,,16,76||,2,30,,,|||',
			
			'|omastar|leftovers|1|protect,spikes,surf,toxic|Bold|252,,248,,,8|M|,0,,,,|||]|hypno|leftovers||protect,toxic,seismictoss,wish|Calm|252,,,,252,4|M|,0,,,,|||]|altaria|leftovers||rest,roar,healbell,toxic|Calm|252,,236,,20,|F|,0,,,,|||]|gligar|leftovers||swordsdance,earthquake,hiddenpowerflying,toxic|Impish|252,,244,,,12|M|30,30,30,30,30,|||]|kangaskhan|leftovers||frustration,toxic,protect,wish|Careful|252,16,16,,216,8|||||0]|blastoise|leftovers||surf,rapidspin,roar,toxic|Bold|252,,252,,,4|M|,0,,,,|||',
			
			'|omastar|leftovers|1|spikes,surf,protect,toxic|Bold|240,,240,,,28||,0,,,,|||]|shedinja|lumberry||shadowball,swordsdance,protect,hiddenpowerbug|Adamant|,252,,4,,252||,30,30,,30,|||]|hitmontop|leftovers||rapidspin,hiddenpowerghost,toxic,brickbreak|Impish|248,,252,,8,||,,30,,30,|||]|kangaskhan|leftovers||frustration,roar,protect,wish|Careful|248,,44,,216,|||||0]|altaria|leftovers||icebeam,roar,healbell,rest|Bold|248,,200,,60,||,0,,,,|||]|gligar|leftovers||earthquake,hiddenpowerflying,toxic,swordsdance|Impish|252,,240,,,16||30,30,30,30,30,|||',
			
			'|kangaskhan|choiceband||return,shadowball,earthquake,focuspunch|Jolly|,252,,,4,252|||||]|muk|leftovers||sludgebomb,icepunch,explosion,hiddenpowerground|Lonely|252,252,,4,,||,,,30,30,|||]|lunatone|leftovers||calmmind,psychic,icebeam,hiddenpowergrass|Modest|252,,,252,4,||,2,,30,,|||]|pinsir|leftovers||hiddenpowerbug,doubleedge,earthquake,swordsdance|Jolly|,252,4,,,252||,30,30,,30,|||]|omastar|leftovers||raindance,hydropump,spikes,icebeam|Modest|116,,,252,,140||,0,,,,|||]Der F��hrer|scyther|choiceband||aerialace,pursuit,quickattack,hiddenpowerbug|Jolly|,252,,,4,252||,30,30,,30,|||',
			
			'|primeape|leftovers||bulkup,crosschop,hiddenpowerghost,rockslide|Jolly|32,252,,,,224||,,30,,30,|||]|hypno|leftovers||wish,reflect,psychic,protect|Calm|248,,176,,84,||,0,,,,|||]|omastar|leftovers||spikes,surf,toxic,protect|Bold|248,,240,,,20||,0,,,,|||]|kangaskhan|leftovers||focuspunch,return,shadowball,substitute|Adamant|212,252,,,,44|||||]|scyther|choiceband||hiddenpowerflying,silverwind,quickattack,steelwing|Hasty|4,252,,,,252||30,30,30,30,30,|||]|banette|salacberry||shadowball,destinybond,endure,hiddenpowerfighting|Adamant|12,252,,,,244||,,30,30,30,30|||',
			
			'|qwilfish|salacberry||destinybond,selfdestruct,spikes,hiddenpowergrass|Hasty|,252,,32,,224||,30,,30,,|||]|kangaskhan|choiceband||return,earthquake,fakeout,shadowball|Jolly|,252,,,4,252|||||]|manectric|petayaberry||substitute,thunderbolt,hiddenpowerice,crunch|Timid|44,,,248,,216||,2,30,,,|||]|golem|leftovers||earthquake,hiddenpowerrock,counter,protect|Adamant|252,240,,,16,||,,30,,30,30|||]|scyther|salacberry||swordsdance,hiddenpowerbug,reversal,endure|Hasty|,252,,4,,252||,30,30,,30,|||]|tentacruel|leftovers||hydropump,sludgebomb,substitute,swordsdance|Hasty|,232,,92,,184|||||',
			
			'|walrein|leftovers||surf,hiddenpowergrass,icebeam,encore|Modest|156,,,252,,100||,2,,30,,|||]|nidoqueen|leftovers||earthquake,counter,sludgebomb,superpower|Adamant|252,140,36,,,80|||||]|granbull|leftovers||return,earthquake,healbell,thunderwave|Impish|252,,252,,,4|||||]|hypno|leftovers||wish,protect,toxic,psychic|Bold|248,,176,84,,||,0,,,,|||]|omastar|leftovers||spikes,icebeam,surf,toxic|Bold|248,,216,,,44||,0,,,,|||]|scyther|choiceband||silverwind,hiddenpowerflying,quickattack,pursuit|Jolly|4,252,,,,252||30,30,30,30,30,|||',
			
			'|ninetales|leftovers||flamethrower,hiddenpowergrass,willowisp,quickattack|Hasty|,4,,252,,252||,30,,30,,|||]|shiftry|lumberry||solarbeam,sunnyday,hiddenpowerdark,explosion|Mild|,4,,252,,252|||||]|nidoqueen|choiceband||earthquake,superpower,shadowball,sludgebomb|Adamant|44,248,136,,,80|||||]|omastar|leftovers||spikes,surf,icebeam,toxic|Bold|252,,252,,4,||,0,,,,|||]|scyther|leftovers||substitute,swordsdance,hiddenpowerflying,silverwind|Jolly|,252,,,4,252||30,30,30,30,30,|||]|lanturn|leftovers||thunderbolt,toxic,icebeam,surf|Modest|164,,,252,,92||,0,,,,|||',
			
			'|manectric|petayaberry||crunch,hiddenpowerwater,substitute,thunderbolt|Timid|,,,252,4,252|M|,30,30,30,,|||]|kangaskhan|choiceband||earthquake,fakeout,return,shadowball|Adamant|4,252,,,,252|||||]|hypno|leftovers||calmmind,psychic,toxic,wish|Calm|252,,252,,4,|M||||]|golem|leftovers||earthquake,explosion,rockblast,toxic|Impish|252,176,80,,,|M||||]|vileplume|leftovers||aromatherapy,hiddenpowergrass,leechseed,sleeppowder|Bold|252,,108,,148,|F|,30,,30,,|||]|scyther|liechiberry||hiddenpowerflying,reversal,substitute,swordsdance|Jolly|4,252,,,,252|M|30,30,30,30,30,|||'
			
			],
			gen7monotype:[
				'|golemalola|airballoon||earthquake,firepunch,wildcharge,stealthrock|Adamant|,252,,,4,252|||||]|zeraora|choiceband||closecombat,plasmafists,irontail,knockoff|Jolly|,252,,,4,252|||||]|tapukoko|choicespecs||voltswitch,dazzlinggleam,thunderbolt,hiddenpowerice|Timid|,,4,252,,252||,0,,,,|||]|raichualola|aloraichiumz||psychic,nastyplot,thunderbolt,focusblast|Modest|,,,252,4,252||,0,,,,|||]|zapdos|leftovers||discharge,roost,defog,toxic|Bold|252,,240,,,16||,0,,,,|||]|rotomwash|leftovers||voltswitch,hydropump,willowisp,painsplit|Calm|252,,,,212,44||,0,,,,|',

				'|chansey|eviolite||seismictoss,softboiled,stealthrock,toxic|Bold|248,,252,,8,||,0,,,,|||]|porygon2|eviolite|1|icebeam,hiddenpowerfire,discharge,recover|Bold|252,,252,,4,||,0,,,,|||]|porygonz|normaliumz||shadowball,thunderbolt,icebeam,conversion|Timid|,,,252,4,252||,0,,,,|||]|lopunny|lopunnite|limber|highjumpkick,return,poweruppunch,encore|Jolly|,252,,,4,252|||||]|ditto|choicescarf|H|transform|Impish|248,,252,,8,||,0,,,,30|||]|staraptor|leftovers||bravebird,closecombat,roost,defog|Impish|240,,252,,,16|||||',

				'|ferrothorn|leftovers||leechseed,powerwhip,protect,spikes|Impish|252,,252,,4,|M||||]|excadrill|leftovers|H|swordsdance,stealthrock,earthquake,rockslide|Jolly|252,4,,,,252|M||||]|bisharp|lifeorb||swordsdance,suckerpunch,ironhead,knockoff|Adamant|,252,,,4,252|M||||]|jirachi|choicescarf||healingwish,ironhead,heartstamp,uturn|Jolly|,252,,,4,252|||||]|heatran|firiumz||magmastorm,earthpower,taunt,toxic|Timid|,,,252,4,252|M|,0,,,,|||]|celesteela|leftovers||heavyslam,leechseed,protect,toxic|Careful|248,,96,,164,|||||',

				'|mantine|leftovers|1|roost,scald,haze,defog|Calm|248,,,,164,96||,0,,,,|S||]|dragonite|dragoniumz|H|dragondance,extremespeed,firepunch,outrage|Jolly|,252,,,4,252|||S||]|celesteela|leftovers||heavyslam,leechseed,protect,flamethrower|Impish|248,,252,,8,|||S||]|gliscor|toxicorb|H|earthquake,roost,toxic,taunt|Careful|244,,20,,172,72|||S||]|zapdos|leftovers||defog,discharge,heatwave,roost|Calm|248,,,,180,80||,0,,,,|S||]|aerodactyl|aerodactylite||pursuit,stoneedge,earthquake,stealthrock|Jolly|,252,,,4,252|||||',

				'|gallade|galladite||swordsdance,closecombat,zenheadbutt,knockoff|Jolly|,252,,,4,252|||||]|latios|psychiumz||dracometeor,psyshock,healblock,defog|Timid|,,,252,4,252||,0,,,,|||]|victini|choiceband||vcreate,boltstrike,uturn,brickbreak|Jolly|,252,,,4,252|||||]|jirachi|colburberry||ironhead,uturn,stealthrock,healingwish|Careful|252,,,,148,108|||||]|celebi|colburberry||nastyplot,gigadrain,psychic,recover|Timid|136,,,208,4,160||,0,,,,|||]|meloetta|choicescarf||psychic,shadowball,uturn,focusblast|Timid|,,,252,4,252|||||',

				'|venusaur|venusaurite|chlorophyll|gigadrain,hiddenpowerfire,synthesis,leechseed|Bold|248,,128,,116,16|F|,0,,,,|||]|toxapex|blacksludge|H|scald,toxic,recover,banefulbunker|Bold|252,,144,,112,|F|,0,,,,|S||]|nihilego|choicescarf||powergem,thunder,hiddenpowerice,stealthrock|Timid|,,12,244,,252||,0,,,,|S||]|crobat|flyiniumz|H|bravebird,defog,roost,taunt|Jolly|,252,,,4,252|||||]|mukalola|assaultvest||gunkshot,knockoff,pursuit,firepunch|Adamant|248,136,12,,108,4|M||S||]|nidoking|lifeorb|H|earthpower,thunderbolt,fireblast,icebeam|Timid|,,,252,4,252||,0,,,,|||',

				'|golemalola|airballoon||stealthrock,stoneedge,earthquake,focuspunch|Careful|248,12,16,,188,44|||||]|magnezone|assaultvest||thunderbolt,flashcannon,voltswitch,hiddenpowerfire|Modest|168,,,152,,188||,0,,,,|||]|rotommow|iapapaberry||leafstorm,voltswitch,defog,painsplit|Bold|248,,88,,124,48||,0,,,,|||]|thundurus|flyiniumz||substitute,bulkup,fly,thunder|Jolly|8,248,,,,252|||||]|tapukoko|choicespecs||thunderbolt,voltswitch,hiddenpowerice,dazzlinggleam|Timid|,,,252,4,252||,0,,,,|||]|zeraora|choiceband||knockoff,closecombat,plasmafists,irontail|Jolly|,252,,,4,252|||||',

				'|aerodactyl|aerodactylite||stoneedge,earthquake,pursuit,icefang|Jolly|,252,,,4,252|||||]|celesteela|leftovers||leechseed,protect,heavyslam,toxic|Impish|248,,104,,156,|||||]|gliscor|toxicorb|H|earthquake,taunt,defog,roost|Careful|244,,,,204,60|||||]|mantine|leftovers|1|scald,haze,defog,roost|Calm|252,,64,,16,176||,0,,,,|||]|tornadustherian|||acrobatics,knockoff,uturn,defog|Jolly|80,216,,,,212|||||]|thundurustherian|electriumz||agility,thunderbolt,hiddenpowerflying,nastyplot|Timid|,,,252,4,252||,0,,,,|||',

				'|excadrill|focussash|H|stealthrock,rapidspin,earthquake,rocktomb|Jolly|,252,,,4,252|||||]|klefki|lightclay||reflect,lightscreen,spikes,toxic|Calm|248,,,,128,132||,0,,,,|||]|celesteela|metronome||autotomize,airslash,gigadrain,flamethrower|Modest|72,,,252,,184||,0,,,,|||]|heatran|choicescarf||overheat,earthpower,flashcannon,stoneedge|Timid|,,,252,4,252|||||]|bisharp|darkiniumz||swordsdance,knockoff,suckerpunch,ironhead|Jolly|,252,,,4,252|||||]|lucario|lifeorb|H|swordsdance,closecombat,stoneedge,extremespeed|Adamant|,252,,,4,252|||||',

				'|ribombee|focussash|1|stickyweb,moonblast,hiddenpowerfire,stunspore|Hasty|,,,252,4,252|F|,0,,,,|||]|tapufini|fairiumz||hydropump,moonblast,calmmind,hiddenpowerfire|Timid|4,,,252,,252||,0,,,,|||]|clefable|leftovers|1|calmmind,fireblast,moonblast,softboiled|Bold|252,,252,4,,||,0,,,,|||]|tapukoko|expertbelt||thunderbolt,grassknot,hiddenpowerice,uturn|Timid|,,,252,4,252||,30,30,,,|||]|diancie|diancite|clearbody|earthpower,stealthrock,diamondstorm,moonblast|Naive|,4,,252,,252|||||]|tapubulu|choiceband||stoneedge,hornleech,woodhammer,superpower|Adamant|,252,,,4,252|||||',

				'|charizard|charizarditex||dragondance,dragonclaw,flareblitz,swordsdance|Jolly|,252,,,4,252|||||]|torkoal|heatrock|1|stealthrock,yawn,lavaplume,rapidspin|Bold|252,,252,,4,||,0,,,,|||]|blacephalon|choicescarf||hiddenpowerice,fireblast,shadowball,trick|Timid|,,,252,4,252||,0,,,,|||]|heatran|airballoon||magmastorm,earthpower,taunt,flashcannon|Timid|,,,252,4,252||,0,,,,|||]|volcarona|buginiumz|H|quiverdance,bugbuzz,fireblast,hiddenpowerelectric|Timid|,,,252,4,252||,0,,,,|||]|infernape|choiceband|H|flareblitz,uturn,machpunch,closecombat|Jolly|,252,,,4,252|||||',

				'|smeargle|focussash||spore,stealthrock,stickyweb,whirlwind|Timid|252,,,,4,252||,0,,,,|||]|linoone|figyberry|1|bellydrum,extremespeed,stompingtantrum,seedbomb|Adamant|148,252,,,,108|||||]|diggersby|silkscarf|H|earthquake,return,quickattack,swordsdance|Adamant|,252,,,4,252|||||]|porygonz|normaliumz||shadowball,conversion,thunderbolt,recover|Timid|,,,252,4,252||,0,,,,|||]|ditto|choicescarf|H|transform|Relaxed|248,,252,,8,||,0,,,,|||]|lopunny|lopunnite|limber|encore,highjumpkick,return,poweruppunch|Jolly|,252,,,4,252|||||',

				'|pelipper|leftovers|1|hurricane,uturn,roost,defog|Bold|112,,252,,,144|||||]|swampert|swampertite|torrent|waterfall,earthquake,sludgewave,stealthrock|Adamant|,252,,,4,252|||||]|kingdra|choicespecs||hydropump,surf,dracometeor,icebeam|Modest|,,,252,4,252||,0,,,,|||]|gyarados|flyiniumz|H|waterfall,bounce,taunt,dragondance|Jolly|,252,,,4,252|||||]|greninja|lifeorb|H|darkpulse,icebeam,extrasensory,hydropump|Timid|,,,252,4,252||,0,,,,|||]|keldeo|choicespecs||secretsword,hydropump,scald,hiddenpowerelectric|Timid|,,,252,4,252||,,,30,,|||',

				//'|slowbro|colburberry|H|scald,grassknot,fireblast,slackoff|Bold|252,,232,,24,||,0,,,,|||]|jirachi|leftovers||stealthrock,thunderwave,ironhead,uturn|Timid|224,,,,204,80|||||]|reuniclus|leftovers|1|calmmind,psyshock,shadowball,recover|Bold|252,,212,,,44||,0,,,,|||]|victini|normaliumz||searingshot,focusblast,storedpower,celebrate|Timid|,,,252,4,252||,0,,,,|||]|gallade|galladite||swordsdance,closecombat,zenheadbutt,substitute|Jolly|,252,,,4,252|||||]|latios|choicescarf||dracometeor,psychic,thunderwave,defog|Timid|,,,252,4,252||,0,,,,|||',

				//'|whiscash|leftovers|H|rest,earthquake,toxic,whirlpool|Relaxed|248,8,252,,,|||||]|pelipper|leftovers|1|defog,roost,uturn,scald|Bold|248,,252,8,,|||||]|lanturn|leftovers||healbell,voltswitch,toxic,scald|Calm|252,,,4,252,||,0,,,,|||]|toxapex|leftovers|H|toxicspikes,scald,recover,haze|Bold|252,,252,,4,||,0,,,,|||]|slowbro|slowbronite|regenerator|scald,slackoff,calmmind,fireblast|Bold|252,,252,4,,||,0,,,,|||]|slowking|assaultvest|H|scald,powergem,fireblast,icebeam|Calm|252,,,4,252,||,0,,,,|||',

				'|steelix|steelixite|sturdy|heavyslam,curse,rest,sleeptalk|Impish|252,4,,,252,|||||]|landorus|lifeorb|H|earthpower,sludgewave,rockpolish,gravity|Timid|,,,252,4,252||,0,,,,|||]|garchomp|firiumz|H|earthquake,firefang,outrage,stealthrock|Jolly|,252,,,4,252|||||]|gastrodon|leftovers|1|scald,earthpower,recover,toxic|Bold|252,,252,4,,||,0,,,,|||]|dugtrio|focussash|1|earthquake,suckerpunch,reversal,sludgewave|Hasty|,252,,4,,252||21,,0,,0,|||]|excadrill|choicescarf|H|earthquake,ironhead,toxic,rapidspin|Jolly|,252,,,4,252|||||',

				'powergirl|mandibuzz|rockyhelmet|1|roost,foulplay,defog,uturn|Impish|248,,244,,,16|||||]chanel|hydreigon|lifeorb||roost,taunt,darkpulse,dracometeor|Timid|,,,252,4,252||,0,,,,|||]my boy|tyranitar|leftovers||stoneedge,stealthrock,protect,toxic|Careful|252,,,,252,|||||]broken clocks|sableye|sablenite|H|knockoff,willowisp,recover,protect|Careful|248,,116,,144,|||||]saved|greninja|choicescarf|H|uturn,spikes,icebeam,gunkshot|Naive|,4,,252,,252|||||]buzzcut season|mukalola|iapapaberry|1|knockoff,poisonjab,curse,recycle|Careful|252,4,,,252,|||||',

				'|crawdaunt|lifeorb|H|knockoff,crabhammer,aquajet,swordsdance|Jolly|,252,4,,,252|||||]|krookodile|focussash||stealthrock,taunt,knockoff,earthquake|Jolly|,252,4,,,252|||||]|tyranitar|tyranitarite||dragondance,stoneedge,earthquake,firepunch|Jolly|,252,,,4,252|||||]|hydreigon|expertbelt||dracometeor,darkpulse,fireblast,earthpower|Timid|,,,252,4,252||,0,,,,|||]|greninja|choicescarf|H|gunkshot,icebeam,extrasensory,hydropump|Hasty|,4,,252,,252|||||]|bisharp|darkiniumz||swordsdance,knockoff,ironhead,suckerpunch|Adamant|,252,4,,,252|||||',

				'Sargon of Akkad|dragonite|weaknesspolicy|H|dragondance,outrage,firepunch,extremespeed|Adamant|,252,,,4,252|||||]BBK|kyuremblack|lifeorb||outrage,icebeam,fusionbolt,hiddenpowerfire|Lonely|,240,,16,,252||,30,,30,,30|||]Chompo|garchomp|focussash|H|stealthrock,stoneedge,earthquake,swordsdance|Jolly|,252,,,4,252|||||]CottonBallQueen|altaria|altarianite||dragondance,frustration,roost,healbell|Jolly|248,,84,,,176|||S||0]TChalla|kommoo|kommoniumz|1|dragondance,clangingscales,drainpunch,flamethrower|Naive|,4,,252,,252|||||]Mercy|latias|choicescarf||dracometeor,psyshock,healingwish,defog|Timid|,,,252,4,252||,0,,,,|||',

				'|blacephalon|firiumz||substitute,calmmind,fireblast,shadowball|Timid|232,,,20,4,252||,0,,,,|||]|sableye|sablenite|prankster|knockoff,recover,willowisp,protect|Careful|252,,112,,144,|||||]|marowakalola|thickclub|1|shadowbone,firepunch,stealthrock,earthquake|Jolly|28,252,,,,228|||||]|gengar|choicescarf||shadowball,sludgewave,focusblast,thunderbolt|Timid|,,,252,4,252||,0,,,,|||]|mimikyu|lifeorb||playrough,swordsdance,shadowclaw,shadowsneak|Jolly|,252,,,4,252|||||]|jellicent|leftovers|1|scald,toxic,taunt,recover|Calm|252,,,,244,12||,0,,,,|||',

				'|araquanid|leftovers||spiderweb,soak,rest,toxic|Calm|252,,4,,252,||,0,,,,|||]|scizor|scizorite|lightmetal|swordsdance,bulletpunch,bugbite,superpower|Adamant|,252,,,4,252|||||]|volcarona|firiumz||quiverdance,fireblast,hiddenpowerground,gigadrain|Timid|,,4,252,,252||,,,30,30,|||]|galvantula|focussash||thunder,energyball,hiddenpowerice,stickyweb|Timid|,,,252,4,252||,0,,,,|||]|armaldo|leftovers||stealthrock,rapidspin,stoneedge,knockoff|Careful|252,,84,,172,|||||]|heracross|choicescarf|H|closecombat,megahorn,stoneedge,pursuit|Jolly|,252,,,4,252|||||',
                
                '|charizard|charizarditey||defog,fireblast,solarbeam,focusblast|Timid|,,,252,4,252||,0,,,,|||]|celesteela|leftovers||heavyslam,leechseed,protect,toxic|Impish|252,,132,,124,|||||]|dragonite|choiceband|H|extremespeed,firepunch,superpower,outrage|Adamant|,252,,,4,252|||||]|thundurustherian|electriumz||nastyplot,agility,thunderbolt,hiddenpowerice|Timid|,,,252,4,252||,0,,,,|||]|landorustherian|focussash||imprison,stealthrock,explosion,earthquake|Jolly|,252,,,4,252|||||]|hawlucha|sitrusberry|1|substitute,swordsdance,acrobatics,highjumpkick|Jolly|12,252,44,,,200|||||',
                
                '|galvantula|focussash||stickyweb,thunder,energyball,hiddenpowerice|Timid|,,,252,4,252||,0,,,,|||]|armaldo|leftovers||stealthrock,stoneedge,knockoff,rapidspin|Careful|248,,84,,176,|||||]|durant|choicescarf|1|ironhead,xscissor,rockslide,superpower|Jolly|,252,,,4,252|||||]|heracross|flameorb|1|swordsdance,closecombat,megahorn,facade|Jolly|,252,,,4,252|||||]|volcarona|psychiumz||quiverdance,fireblast,psychic,hiddenpowerelectric|Timid|,,,252,4,252||,0,,,,|||]|scizor|scizorite|lightmetal|swordsdance,bulletpunch,bugbite,superpower|Adamant|,252,,,4,252|||||',
                
                '|venusaur|venusaurite|chlorophyll|gigadrain,leechseed,hiddenpowerfire,synthesis|Bold|232,,144,,116,16||,0,,,,|||]|toxapex|blacksludge|H|scald,toxicspikes,recover,haze|Bold|252,,172,,84,||,0,,,,|||]|crobat|blacksludge|H|bravebird,roost,taunt,defog|Jolly|248,28,40,,,192|||||]|nidoking|lifeorb|H|stealthrock,earthpower,flamethrower,icebeam|Timid|,,,252,4,252||,0,,,,|||]|mukalola|assaultvest||knockoff,pursuit,poisonjab,fireblast|Sassy|200,84,44,,180,|||||]|gengar|fightiniumz||shadowball,focusblast,substitute,thunderbolt|Timid|,,,252,4,252||,0,,,,|||',
                
                '|venusaur|venusaurite|chlorophyll|leechseed,sludgebomb,hiddenpowerfire,synthesis|Bold|248,,164,,96,|M|,0,,,,|||]|ferrothorn|leftovers||spikes,leechseed,gyroball,protect|Relaxed|248,,168,,92,|F|,,,,,0|||]|cradily|leftovers|H|stealthrock,rockslide,toxic,recover|Careful|248,,56,,204,|M||||]|tapubulu|choiceband||woodhammer,megahorn,hornleech,superpower|Jolly|,252,,,4,252|||||]|breloom|rockiumz|H|stoneedge,swordsdance,machpunch,bulletseed|Jolly|,252,4,,,252|M||||]|whimsicott|choicescarf||tailwind,moonblast,stunspore,switcheroo|Timid|48,,,252,,208||,0,,,,|||'
                
                
                


			]};
		let realFormat=this.format.realFormat;

		return Dex.fastUnpackTeam(this.prng.sample(teams[realFormat]));
	}
}

module.exports = RandomTeams;
