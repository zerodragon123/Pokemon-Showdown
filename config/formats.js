'use strict';

// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.js

exports.Formats = [

	// US/UM Singles
	///////////////////////////////////////////////////////////////////
	{
		section: "US/UM Singles",
	},
	{
		name: "[Gen 7] Random Battle",
		desc: ["Randomized teams of level-balanced Pok&eacute;mon with sets that are generated to be competitively viable."],

		mod: 'gen7',
		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Unrated Random Battle",

		mod: 'gen7',
		team: 'random',
		challengeShow: false,
		rated: false,
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
    {
        name: "[Gen 7] 3DS 6V6",
        
        mod: 'gen7',
        forcedLevel: 50,
        timer: {starting: 15 * 60 - 10, perTurn: 10, maxPerTurn: 60, maxFirstTurn: 90, timeoutAutoChoose: true},
        ruleset: ['Pokemon', 'PSChina Clause'],
        requirePlus: true,
    },
	{
		name: "[Gen 7] OU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3621042/\">OU Metagame Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3587177/\">OU Banlist</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3621329/\">OU Viability Rankings</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3606650/\">OU Sample Teams</a>",
		],

		mod: 'gen7',
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: ['Uber', 'Arena Trap', 'Power Construct', 'Shadow Tag', 'Baton Pass'],
	},
	{
		name: "[Gen 7] Ubers",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3587184/\">Ubers Metagame Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3623296/\">Ubers Viability Rankings</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3599816/\">Ubers Sample Teams</a>",
		],

		mod: 'gen7',
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Mega Rayquaza Clause'],
		banlist: ['Baton Pass'],
	},
	{
		name: "[Gen 7] UU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3625273/\">UU Metagame Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3620980/\">UU Viability Rankings</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3621217/\">UU Sample Teams</a>",
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['OU', 'BL', 'Drizzle', 'Kommonium Z', 'Mewnium Z'],
	},
	{
		name: "[Gen 7] RU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3625382/\">RU Metagame Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3622740/\">RU Viability Rankings</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3622057/\">RU Sample Teams</a>",
		],

		mod: 'gen7',
		searchShow: false,
		ruleset: ['[Gen 7] UU'],
		banlist: ['UU', 'BL2', 'Aurora Veil'],
	},
	{
		name: "[Gen 7] RU (suspect test)",
		desc: ["&bullet; <a href=\"http://www.smogon.com/forums/threads/3625382/\">RU Suspect Test</a>"],

		mod: 'gen7',
		challengeShow: false,
		ruleset: ['[Gen 7] RU'],
	},
	{
		name: "[Gen 7] NU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3624392/\">NU Metagame Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3622107/\">NU Viability Rankings</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3606112/\">NU Sample Teams</a>",
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] RU'],
		banlist: ['RU', 'BL3', 'Drought'],
	},
	{
		name: "[Gen 7] PU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3614120/\">PU Metagame Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3614892/\">PU Viability Rankings</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3614470/\">PU Sample Teams</a>",
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] NU'],
		banlist: ['NU', 'BL4'],
	},
	{
		name: "[Gen 7] LC",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3587196/\">LC Metagame Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/dex/sm/formats/lc/\">LC Banlist</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3621440/\">LC Viability Rankings</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3588679/\">LC Sample Teams</a>",
		],

		mod: 'gen7',
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Team Preview', 'Little Cup'],
		banlist: [
			'Aipom', 'Cutiefly', 'Drifloon', 'Gligar', 'Gothita', 'Meditite', 'Misdreavus', 'Murkrow', 'Porygon', 'Scyther', 'Sneasel', 'Swirlix', 'Tangela', 'Vulpix-Base', 'Yanma',
			'Eevium Z', 'Dragon Rage', 'Sonic Boom',
		],
	},
	{
		name: "[Gen 7] Monotype",
		desc: [
			"All the Pok&eacute;mon on a team must share a type.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3621036/\">Monotype Metagame Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3622349\">Monotype Viability Rankings</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3599682/\">Monotype Sample Teams</a>",
		],

		mod: 'gen7',
		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Same Type Clause', 'Team Preview'],
		banlist: [
			'Aegislash', 'Arceus', 'Blaziken', 'Darkrai', 'Deoxys-Base', 'Deoxys-Attack', 'Dialga', 'Genesect', 'Gengar-Mega', 'Giratina', 'Groudon',
			'Ho-Oh', 'Hoopa-Unbound', 'Kangaskhan-Mega', 'Kartana', 'Kyogre', 'Kyurem-White', 'Lucario-Mega', 'Lugia', 'Lunala', 'Magearna',
			'Marshadow', 'Mawile-Mega', 'Medicham-Mega', 'Metagross-Mega', 'Mewtwo', 'Naganadel', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia',
			'Pheromosa', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky', 'Solgaleo', 'Tapu Lele', 'Xerneas', 'Yveltal', 'Zekrom', 'Zygarde',
			'Battle Bond', 'Shadow Tag', 'Damp Rock', 'Smooth Rock', 'Terrain Extender', 'Baton Pass',
		],
	},
	{
		name: "[Gen 7] Anything Goes",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3587441/\">Anything Goes</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3591711/\">AG Resources</a>",
		],

		mod: 'gen7',
		ruleset: ['Pokemon', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Illegal', 'Unreleased'],
	},
	{
		name: "[Gen 7] PO吧RUBY团赛",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3591711/\">AG Resources</a>",
		],

		mod: 'gen7',
		searchShow: false,
		ruleset: ['Pokemon', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause'],
		banlist: ['Illegal', 'Unreleased'],
	},
	{
		name: "[Gen 7] CAP",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3587865/\">CAP Metagame Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3597893/\">CAP Viability Rankings</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/7203358/\">CAP Sample Teams</a>",
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'Allow CAP'],
		banlist: ['Tomohawk + Earth Power', 'Tomohawk + Reflect'],
	},
	{
		name: "[Gen 7] CAP LC",
		desc: ["&bullet; <a href=\"http://www.smogon.com/forums/threads/3599594/\">CAP LC</a>"],

		mod: 'gen7',
		searchShow: false,
		maxLevel: 5,
		ruleset: ['[Gen 7] LC', 'Allow CAP'],
	},
	{
		name: "[Gen 7] Battle Spot Singles",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3601012/\">Introduction to Battle Spot Singles</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3605970/\">Battle Spot Singles Viability Ranking</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3601658/\">Battle Spot Singles Roles Compendium</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3593055/\">Battle Spot Singles Sample Teams</a>",
		],

		mod: 'gen7',
		maxForcedLevel: 50,
		teamLength: {
			validate: [3, 6],
			battle: 3,
		},
		ruleset: ['Pokemon', 'Standard GBU'],
		requirePentagon: true,
	},
	{
		name: "[Gen 7] Battle Spot Special 7",
		desc: ["&bullet; <a href=\"http://www.smogon.com/forums/threads/3621403/\">Battle Spot Special: Season 7</a>"],

		mod: 'gen7',
		maxForcedLevel: 50,
		teamLength: {
			validate: [3, 6],
			battle: 3,
		},
		ruleset: ['Pokemon', 'Standard GBU', 'Alola Pokedex'],
		banlist: ['Poipole', 'Naganadel', 'Stakataka', 'Blacephalon'],
		requirePlus: true,
	},
	{
		name: "[Gen 7] Dragon Cup",
		desc: [`&bullet; <a href="https://3ds.pokemon-gl.com/dl-regulation/6010">Dragon Cup: Official rules</a>`],

		mod: 'gen7',
		maxForcedLevel: 50,
		teamLength: {
			validate: [3, 6],
			battle: 3,
		},
		timer: {starting: 15 * 60 - 10, perTurn: 10, maxPerTurn: 60, maxFirstTurn: 90, timeoutAutoChoose: true},
		ruleset: ['Pokemon', 'Minimal GBU', 'Team Preview'],
		onValidateTeam: function (team) {
			const restrictedLegends = ['Mewtwo', 'Lugia', 'Ho-Oh', 'Kyogre', 'Groudon', 'Rayquaza', 'Dialga', 'Palkia', 'Giratina', 'Reshiram', 'Zekrom', 'Kyurem', 'Xerneas', 'Yveltal', 'Zygarde', 'Cosmog', 'Cosmoem', 'Solgaleo', 'Lunala', 'Necrozma'];
			let count = 0;
			for (const set of team) {
				const baseSpecies = this.getTemplate(set.species).baseSpecies;
				if (restrictedLegends.includes(baseSpecies)) count++;
				if (count > 1) return ["You can only use one Restricted Legendary Pok\u00E9mon."];
			}
		},
		requirePentagon: true,
	},
	{
		name: "[Gen 7] Battle Tree 3v3",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3621042/\">OU Metagame Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3587177/\">OU Banlist</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3621329/\">OU Viability Rankings</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3606650/\">OU Sample Teams</a>",
		],
      teamLength: {
         validate: [1, 3],
			battle: 3,
		},
      searchShow: false,
		mod: 'gen7',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber', 'Power Construct'],
	},
	{
		name: "[Gen 7] Custom Game",

		mod: 'gen7',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		teamLength: {
			validate: [1, 24],
			battle: 24,
		},
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

	// US/UM Doubles
	///////////////////////////////////////////////////////////////////

	{
		section: "US/UM Doubles",
	},
	{
		name: "[Gen 7] Random Doubles Battle",

		mod: 'gen7',
		gameType: 'doubles',
		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Doubles OU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3623271/\">Doubles OU Metagame Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3623347/\">Doubles OU Viability Rankings</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3590987/\">Doubles OU Sample Teams</a>",
		],

		mod: 'gen7',
		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard Doubles', 'Swagger Clause', 'Team Preview'],
		banlist: ['Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Jirachi', 'Kangaskhan-Mega', 'Kyogre', 'Kyurem-White', 'Lugia', 'Lunala',
			'Magearna', 'Marshadow', 'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Rayquaza', 'Reshiram', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom',
			'Power Construct', 'Eevium Z', 'Dark Void', 'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder',
		],
	},
	{
		name: "[Gen 7] Doubles Ubers",

		mod: 'gen7',
		gameType: 'doubles',
		ruleset: ['Pokemon', 'Standard Doubles', 'Team Preview'],
		banlist: ['Illegal', 'Unreleased', 'Dark Void'],
	},
	{
		name: "[Gen 7] Doubles UU",
		desc: ["&bullet; <a href=\"http://www.smogon.com/forums/threads/3598014/\">Doubles UU Metagame Discussion</a>"],

		mod: 'gen7',
		gameType: 'doubles',
		ruleset: ['[Gen 7] Doubles OU'],
		banlist: [
			'Aegislash', 'Amoonguss', 'Arcanine', 'Bronzong', 'Celesteela', 'Charizard-Mega-Y', 'Cresselia', 'Deoxys-Attack', 'Diancie', 'Diancie-Mega', 'Excadrill',
			'Ferrothorn', 'Garchomp', 'Gastrodon', 'Genesect', 'Gengar-Mega', 'Heatran', 'Hoopa-Unbound', 'Jirachi', 'Kangaskhan-Mega', 'Kartana', 'Kingdra',
			'Kyurem-Black', 'Landorus-Therian', 'Marowak-Alola', 'Marowak-Alola-Totem', 'Marshadow', 'Metagross-Mega', 'Mew', 'Mimikyu', 'Naganadel', 'Ninetales-Alola',
			'Oranguru', 'Pelipper', 'Politoed', 'Porygon2', 'Salamence-Mega', 'Scrafty', 'Snorlax', 'Stakataka', 'Swampert-Mega', 'Tapu Bulu', 'Tapu Fini',
			'Tapu Koko', 'Tapu Lele', 'Torkoal', 'Tyranitar', 'Volcanion', 'Volcarona', 'Whimsicott', 'Zapdos', 'Zygarde-Base',
		],
	},
	{
		name: "[Gen 7] VGC 2018",

		mod: 'gen7',
		gameType: 'doubles',
		forcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		timer: {starting: 5 * 60 - 10, perTurn: 10, maxPerTurn: 55, maxFirstTurn: 90, timeoutAutoChoose: true},
		ruleset: ['Pokemon', 'Standard GBU'],
		banlist: ['Unown'],
		requirePlus: true,
	},
	{
		name: "[Gen 7] VGC 2017",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3583926/\">VGC 2017 Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3591794/\">VGC 2017 Viability Rankings</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3590391/\">VGC 2017 Sample Teams</a>",
		],

		mod: 'vgc17',
		gameType: 'doubles',
		forcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		timer: {starting: 15 * 60 - 10, perTurn: 10, maxPerTurn: 60, maxFirstTurn: 90, timeoutAutoChoose: true},
		ruleset: ['Pokemon', 'Species Clause', 'Nickname Clause', 'Item Clause', 'Team Preview', 'Cancel Mod', 'Alola Pokedex'],
		banlist: ['Illegal', 'Unreleased', 'Solgaleo', 'Lunala', 'Necrozma', 'Magearna', 'Marshadow', 'Zygarde', 'Mega'],
		requirePlus: true,
	},
	{
		name: "[Gen 7] Battle Spot Doubles",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3595001/\">Battle Spot Doubles Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3593890/\">Battle Spot Doubles Viability Rankings</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3595859/\">Battle Spot Doubles Sample Teams</a>",
		],

		mod: 'gen7',
		gameType: 'doubles',
		maxForcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		ruleset: ['Pokemon', 'Standard GBU'],
		requirePentagon: true,
	},
	{
		name: "[Gen 7] Doubles Custom Game",

		mod: 'gen7',
		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		maxLevel: 9999,
		defaultLevel: 100,
		debug: true,
		teamLength: {
			validate: [2, 24],
			battle: 24,
		},
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

	// Other Metagames
	///////////////////////////////////////////////////////////////////

	{
		section: "OM of the Month",
		column: 2,
	},
	{
		name: "[Gen 7] Inheritance",
		desc: [
			"Pok&eacute;mon may use the ability and moves of another, as long as they forfeit their own learnset.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3592844/\">Inheritance</a>",
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: [
			'Blacephalon', 'Hoopa-Unbound', 'Kartana', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Gyaradosite',
			'Huge Power', 'Imposter', 'Innards Out', 'Pure Power', 'Speed Boost', 'Water Bubble', 'Assist', 'Chatter', 'Shell Smash',
		],
		noChangeForme: true,
		noChangeAbility: true,
		getEvoFamily: function (species) {
			let template = Dex.getTemplate(species);
			while (template.prevo) {
				template = Dex.getTemplate(template.prevo);
			}
			return template.speciesid;
		},
		validateSet: function (set, teamHas) {
			if (!this.format.abilityMap) {
				let abilityMap = Object.create(null);
				for (let speciesid in Dex.data.Pokedex) {
					let pokemon = Dex.data.Pokedex[speciesid];
					if (pokemon.num < 1 || pokemon.species === 'Smeargle') continue;
					if (Dex.data.FormatsData[speciesid].requiredItem || Dex.data.FormatsData[speciesid].requiredMove) continue;
					for (let key in pokemon.abilities) {
						let abilityId = toId(pokemon.abilities[key]);
						if (abilityMap[abilityId]) {
							abilityMap[abilityId][pokemon.evos ? 'push' : 'unshift'](speciesid);
						} else {
							abilityMap[abilityId] = [speciesid];
						}
					}
				}
				this.format.abilityMap = abilityMap;
			}

			this.format.noChangeForme = false;
			let problems = Dex.getFormat('Pokemon').onChangeSet.call(Dex, set, this.format) || [];
			this.format.noChangeForme = true;

			if (problems.length) return problems;

			let species = toId(set.species);
			let template = Dex.getTemplate(species);
			if (!template.exists) return [`The Pokemon "${set.species}" does not exist.`];
			if (template.isUnreleased) return [`${template.species} is unreleased.`];
			let megaTemplate = Dex.getTemplate(Dex.getItem(set.item).megaStone);
			if (template.tier === 'Uber' || megaTemplate.tier === 'Uber' || this.format.banlist.includes(template.species)) return [`${megaTemplate.tier === 'Uber' ? megaTemplate.species : template.species} is banned.`];

			let name = set.name;

			let abilityId = toId(set.ability);

			if (!abilityId || !(abilityId in Dex.data.Abilities)) return [`${name} needs to have a valid ability.`];
			let pokemonWithAbility = this.format.abilityMap[abilityId];
			if (!pokemonWithAbility) return [`"${set.ability}" is not available on a legal Pokemon.`];

			let canonicalSource = ''; // Specific for the basic implementation of Donor Clause (see onValidateTeam).
			let validSources = set.abilitySources = []; // Evolution families
			for (const donor of pokemonWithAbility) {
				let donorTemplate = Dex.getTemplate(donor);
				let evoFamily = this.format.getEvoFamily(donorTemplate);

				if (validSources.indexOf(evoFamily) >= 0) continue;

				if (set.name === set.species) delete set.name;
				set.species = donorTemplate.species;
				problems = this.validateSet(set, teamHas) || [];

				if (!problems.length) {
					canonicalSource = donorTemplate.species;
					validSources.push(evoFamily);
				}
				if (validSources.length > 1) {
					// Specific for the basic implementation of Donor Clause (see onValidateTeam).
					break;
				}
			}

			set.species = template.species;
			if (!validSources.length && pokemonWithAbility.length > 1) {
				return [`${template.species}'s set is illegal.`];
			}
			if (!validSources.length) {
				problems.unshift(`${template.species} has an illegal set with an ability from ${Dex.getTemplate(pokemonWithAbility[0]).name}.`);
				return problems;
			}

			// Protocol: Include the data of the donor species in the `ability` data slot.
			// Afterwards, we are going to reset the name to what the user intended. :]
			set.ability = `${set.ability}0${canonicalSource}`;
		},
		onValidateTeam: function (team, format) {
			// Donor Clause
			let evoFamilyLists = [];
			for (const set of team) {
				if (!set.abilitySources) continue;
				evoFamilyLists.push(set.abilitySources.map(format.getEvoFamily));
			}

			// Checking actual full incompatibility would require expensive algebra.
			// Instead, we only check the trivial case of multiple Pokémon only legal for exactly one family. FIXME?
			// This clause has only gotten more complex over time, so this is probably a won't fix.
			let requiredFamilies = Object.create(null);
			for (const evoFamilies of evoFamilyLists) {
				if (evoFamilies.length !== 1) continue;
				let [familyId] = evoFamilies;
				if (!(familyId in requiredFamilies)) requiredFamilies[familyId] = 1;
				requiredFamilies[familyId]++;
				if (requiredFamilies[familyId] > 2) return [`You are limited to up to two inheritances from each evolution family by the Donor Clause.`, `(You inherit more than twice from ${this.getTemplate(familyId).species}).`];
			}
		},
		onBegin: function () {
			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				if (pokemon.baseAbility.includes('0')) {
					let donor = pokemon.baseAbility.split('0')[1];
					pokemon.donor = toId(donor);
					pokemon.baseAbility = pokemon.baseAbility.split('0')[0];
					pokemon.ability = pokemon.baseAbility;
				}
			}
		},
		onSwitchIn: function (pokemon) {
			if (!pokemon.donor) return;
			let donorTemplate = Dex.getTemplate(pokemon.donor);
			if (!donorTemplate.exists) return;
			// Place volatiles on the Pokémon to show the donor details.
			this.add('-start', pokemon, donorTemplate.species, '[silent]');
		},
	},
	{
		name: "[Gen 7] Alphabet Cup",
		desc: [
			"Pok&eacute;mon can learn any move it shares the first letter of its name with.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3617977/\">Alphabet Cup</a>",
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		noLearn: ['Geomancy', 'Shell Smash', 'Sketch'],
		onValidateTeam: function (team) {
			let alphabetTable = {};
			for (const set of team) {
				let letter = toId(set.species).slice(0, 1);
				if (alphabetTable[letter]) {
					return ["You are limited to one Pokémon per letter.", "(You have more than one Pokémon beginning with " + letter.toUpperCase() + ")"];
				}
				alphabetTable[letter] = true;
			}
		},
	},
	{
		section: "Other Metagames",
		column: 2,
	},
    {
        name: "[Gen 7] Balanced Hackmons Plus",
        desc: [
            "Balanced Hackmons with special Arceus forms mechanics in GEN 7.",
            "&bullet; <a href=\"http://pokemon-online.eu/threads/35426/\">Balanced Hackmons</a>",
            "&bullet; <a href=\"http://pokemon-online.eu/threads/36170/\">BH Tiering Policy</a>",
            "&bullet; <a href=\"http://pokemon-online.eu/threads/36018/\">BH Viability Rankings</a>",
        ],
                   
        mod: 'bhplus',
        ruleset: ['Pokemon', 'Swagger Clause', 'Ability Clause', 'OHKO Clause', 'Evasion Moves Clause', 'CFZ Clause', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
        banlist: ['Groudon-Primal', 'Arena Trap', 'Huge Power', 'Innards Out', 'Magnet Pull', 'Moody', 'Parental Bond', 'Pure Power', 'Shadow Tag', 'Water Bubble', 'Wonder Guard', 'Gengarite', 'Chatter', 'Comatose + Sleep Talk', 'Stakeout', 'Protean'],
                   
        //onModifyMove: function (move, pokemon) {
        //    if (move.id === 'naturepower') {
        //        move.onTryHit = function (target, source) {
        //            var moveToUse = 'earthquake';
        //            if (this.isTerrain('electricterrain')) {
        //                moveToUse = 'thunderbolt';
        //            } else if (this.isTerrain('grassyterrain')) {
        //                moveToUse = 'energyball';
        //            } else if (this.isTerrain('mistyterrain')) {
        //               moveToUse = 'moonblast';
        //            }
        //            this.useMove(moveToUse, source, target);
        //        }
        //    }
        //},
    },
	{
		name: "[Gen 7] Balanced Hackmons",
		desc: [
			"Anything that can be hacked in-game and is usable in local battles is allowed.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3587475/\">Balanced Hackmons</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3588586/\">BH Suspects and Bans Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3593766/\">BH Resources</a>",
		],

		mod: 'gen7',
		ruleset: ['Pokemon', 'Ability Clause', 'OHKO Clause', 'Evasion Moves Clause', 'CFZ Clause', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Groudon-Primal', 'Arena Trap', 'Huge Power', 'Innards Out', 'Magnet Pull', 'Moody', 'Parental Bond', 'Protean', 'Pure Power', 'Shadow Tag', 'Stakeout', 'Water Bubble', 'Wonder Guard', 'Gengarite', 'Chatter', 'Comatose + Sleep Talk'],
	},
	{
		name: "[Gen 7] 1v1",
		desc: [
			"Bring three Pok&eacute;mon to Team Preview and choose one to battle.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3587523/\">1v1</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3592842/\">1v1 Resources</a>",
		],

		mod: 'gen7',
		teamLength: {
			validate: [1, 3],
			battle: 1,
		},
		ruleset: ['Pokemon', 'Species Clause', 'Nickname Clause', 'Moody Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Swagger Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
		banlist: [
			'Illegal', 'Unreleased', 'Arceus', 'Darkrai', 'Deoxys-Base', 'Deoxys-Attack', 'Deoxys-Defense', 'Dialga', 'Giratina', 'Groudon', 'Ho-Oh',
			'Kangaskhan-Mega', 'Kyogre', 'Kyurem-White', 'Lugia', 'Lunala', 'Marshadow', 'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palkia', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom',
			'Focus Sash', 'Flash', 'Kinesis', 'Leaf Tornado', 'Mirror Shot', 'Mud Bomb', 'Mud-Slap', 'Muddy Water', 'Night Daze', 'Octazooka', 'Perish Song', 'Sand Attack', 'Smokescreen',
			'Chansey + Charm + Seismic Toss', 'Chansey + Charm + Psywave',
		],
	},
	{
		name: "[Gen 7] Mix and Mega",
		desc: [
			"Mega Stones and Primal Orbs can be used on almost any fully evolved Pok&eacute;mon with no Mega Evolution limit.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3587740/\">Mix and Mega</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3591580/\">Mix and Mega Resources</a>",
		],

		mod: 'mixandmega',
		ruleset: ['Pokemon', 'Standard', 'Mega Rayquaza Clause', 'Team Preview'],
		banlist: ['Shadow Tag', 'Gengarite', 'Baton Pass', 'Electrify'],
		restrictedStones: ['Beedrillite', 'Blazikenite', 'Kangaskhanite', 'Mawilite', 'Medichamite', 'Ultranecrozium Z'],
		cannotMega: [
			'Arceus', 'Darkrai', 'Deoxys', 'Deoxys-Attack', 'Dialga', 'Dragonite', 'Giratina', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Marshadow',
			'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia', 'Pheromosa', 'Rayquaza', 'Regigigas', 'Reshiram', 'Shaymin-Sky', 'Slaking', 'Solgaleo', 'Xerneas', 'Yveltal', 'Zekrom',
		],
		onValidateTeam: function (team) {
			let itemTable = {};
			for (const set of team) {
				let item = this.getItem(set.item);
				if (!item) continue;
				if (itemTable[item] && item.megaStone) return ["You are limited to one of each Mega Stone.", "(You have more than one " + this.getItem(item).name + ")"];
				if (itemTable[item] && (item.id === 'blueorb' || item.id === 'redorb')) return ["You are limited to one of each Primal Orb.", "(You have more than one " + this.getItem(item).name + ")"];
				itemTable[item] = true;
			}
		},
		onValidateSet: function (set, format) {
			let template = this.getTemplate(set.species || set.name);
			let item = this.getItem(set.item);
			if (!item.megaEvolves && item.id !== 'blueorb' && item.id !== 'redorb' && item.id !== 'ultranecroziumz') return;
			if (template.baseSpecies === item.megaEvolves || (template.baseSpecies === 'Groudon' && item.id === 'redorb') || (template.baseSpecies === 'Kyogre' && item.id === 'blueorb') || (template.species.substr(0, 9) === 'Necrozma-' && item.id === 'ultranecroziumz')) return;
			if (template.evos.length) return ["" + template.species + " is not allowed to hold " + item.name + " because it's not fully evolved."];
			let uberStones = format.restrictedStones || [];
			let uberPokemon = format.cannotMega || [];
			if (uberPokemon.includes(template.name) || set.ability === 'Power Construct' || uberStones.includes(item.name)) return ["" + template.species + " is not allowed to hold " + item.name + "."];
		},
		onBegin: function () {
			for (const pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				pokemon.originalSpecies = pokemon.baseTemplate.species;
			}
		},
		onSwitchIn: function (pokemon) {
			let oMegaTemplate = this.getTemplate(pokemon.template.originalMega);
			if (oMegaTemplate.exists && pokemon.originalSpecies !== oMegaTemplate.baseSpecies) {
				// Place volatiles on the Pokémon to show its mega-evolved condition and details
				this.add('-start', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
				let oTemplate = this.getTemplate(pokemon.originalSpecies);
				if (oTemplate.types.length !== pokemon.template.types.length || oTemplate.types[1] !== pokemon.template.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.template.types.join('/'), '[silent]');
				}
			}
		},
		onSwitchOut: function (pokemon) {
			let oMegaTemplate = this.getTemplate(pokemon.template.originalMega);
			if (oMegaTemplate.exists && pokemon.originalSpecies !== oMegaTemplate.baseSpecies) {
				this.add('-end', pokemon, oMegaTemplate.requiredItem || oMegaTemplate.requiredMove, '[silent]');
			}
		},
	},
	{
		name: "[Gen 7] Almost Any Ability",
		desc: [
			"Pok&eacute;mon can use any ability, barring the few that are restricted to their natural users.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3587901/\">Almost Any Ability</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3595753/\">AAA Resources</a>",
		],

		mod: 'gen7',
		ruleset: ['[Gen 7] OU', 'Ability Clause', 'Ignore Illegal Abilities'],
		banlist: ['Archeops', 'Dragonite', 'Hoopa-Unbound', 'Kartana', 'Keldeo', 'Kyurem-Black', 'Regigigas', 'Shedinja', 'Slaking', 'Terrakion'],
		unbanlist: ['Genesect', 'Landorus', 'Metagross-Mega', 'Naganadel'],
		restrictedAbilities: [
			'Comatose', 'Contrary', 'Fluffy', 'Fur Coat', 'Huge Power', 'Illusion', 'Imposter', 'Innards Out',
			'Parental Bond', 'Protean', 'Pure Power', 'Simple', 'Speed Boost', 'Stakeout', 'Water Bubble', 'Wonder Guard',
		],
		onValidateSet: function (set, format) {
			let restrictedAbilities = format.restrictedAbilities || [];
			if (restrictedAbilities.includes(set.ability)) {
				let template = this.getTemplate(set.species || set.name);
				let legalAbility = false;
				for (let i in template.abilities) {
					if (set.ability === template.abilities[i]) legalAbility = true;
				}
				if (!legalAbility) return ['The ability ' + set.ability + ' is banned on Pok\u00e9mon that do not naturally have it.'];
			}
		},
	},
	{
		name: "[Gen 7] Camomons",
		desc: [
			"Pok&eacute;mon change type to match their first two moves.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3598418/\">Camomons</a>",
		],
		mod: 'gen7',
		ruleset: ['[Gen 7] OU'],
		banlist: ['Shedinja'],
		onModifyTemplate: function (template, target, source) {
			if (source) return;
			let types = [...new Set(target.baseMoveSlots.slice(0, 2).map(move => this.getMove(move.id).type))];
			return Object.assign({}, template, {types: types});
		},
		onSwitchInPriority: 2,
		onSwitchIn: function (pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[silent]');
		},
		onAfterMega: function (pokemon) {
			this.add('-start', pokemon, 'typechange', pokemon.types.join('/'), '[silent]');
		},
	},
	{
		name: "[Gen 7] STABmons",
		desc: [
			"Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3587949/\">STABmons</a>",
		],

		mod: 'gen7',
		searchShow: false,
		ruleset: ['[Gen 7] OU', 'Ignore STAB Moves'],
		banlist: ['Kartana', 'Komala', 'Kyurem-Black', 'Silvally', 'Tapu Koko', 'Tapu Lele', 'Aerodactylite', 'King\'s Rock', 'Metagrossite', 'Razor Fang'],
		noLearn: ['Acupressure', 'Belly Drum', 'Chatter', 'Geomancy', 'Lovely Kiss', 'Shell Smash', 'Shift Gear', 'Thousand Arrows'],
	},
	{
		name: "[Gen 7] 2v2 Doubles",
		desc: [
			"Double battle where you bring four Pok&eacute;mon to Team Preview and choose only two.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3606989/\">2v2 Doubles</a>",
		],

		mod: 'gen7',
		gameType: 'doubles',
		searchShow: false,
		teamLength: {
			validate: [2, 4],
			battle: 2,
		},
		ruleset: ['Gen 7] Doubles OU'],
		banlist: ['Tapu Lele', 'Focus Sash', 'Perish Song'],
	},
	{
		name: "[Gen 6] Gen-NEXT OU",

		mod: 'gennext',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard NEXT', 'Team Preview'],
		banlist: ['Uber'],
	},
    {
        name: "[Gen 7] Relic PO Balanced Hackmons",
        desc: [
            "Relic PO version of Balanced Hackmons in GEN 7 allowing Protean, Magpull and Stakeout",
            "&bullet; <a href=\"http://pokemon-online.eu/threads/35426/\">Balanced Hackmons</a>",
            "&bullet; <a href=\"http://pokemon-online.eu/threads/36170/\">BH Tiering Policy</a>",
            "&bullet; <a href=\"http://pokemon-online.eu/threads/36018/\">BH Viability Rankings</a>",
        ],
                
        mod: 'bhplus',
        ruleset: ['Pokemon', 'Swagger Clause', 'Ability Clause', 'OHKO Clause', 'Evasion Moves Clause', 'CFZ Clause', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
        banlist: ['Groudon-Primal', 'Arena Trap', 'Huge Power', 'Innards Out', 'Moody', 'Parental Bond', 'Pure Power', 'Shadow Tag', 'Water Bubble', 'Wonder Guard', 'Gengarite', 'Chatter', 'Comatose + Sleep Talk', 'Assist'],
    },
    {
        name: "[Gen 7] PO No Rule Hackmons",
        desc: [
            "PO version of Classic Hackmons in GEN 7.",
        ],
            
        mod: 'bhplus',
        ruleset: ['Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
        banlist: [],
        maxLevel: 100,
        defaultLevel: 100,
        onValidateSet: function(set) {
            let template = this.getTemplate(set.species);
            let item = this.getItem(set.item);
            let problems = [];
            if (template.isNonstandard) {
                problems.push(set.species + ' is not a real Pokemon.');
            }
            if (item.isNonstandard) {
                problems.push(item.name + ' is not a real item.');
            }
            let ability = {};
            if (set.ability) ability = this.getAbility(set.ability);
            if (ability.isNonstandard) {
                problems.push(ability.name + ' is not a real ability.');
            }
            if (set.moves) {
                for (let i = 0; i < set.moves.length; i++) {
                   let move = this.getMove(set.moves[i]);
                   if (move.isNonstandard) {
                        problems.push(move.name + ' is not a real move.');
                   }
                }
                if (set.moves.length > 4) {
                    problems.push((set.name || set.species) + ' has more than four moves.');
                }
            }
            return problems;
        }
                   
    },
    {
        name: "[Gen 6] Balanced Hackmons",
        desc: ["&bullet; <a href=\"http://www.smogon.com/dex/xy/formats/bh/\">ORAS Balanced Hackmons</a>"],
                
        mod: 'gen6',
        searchShow: false,
        ruleset: ['Pokemon', 'Ability Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
        banlist: ['Groudon-Primal', 'Kyogre-Primal', 'Aerilate + Pixilate + Refrigerate > 1', 'Arena Trap', 'Huge Power', 'Moody', 'Parental Bond', 'Protean', 'Pure Power', 'Shadow Tag', 'Wonder Guard', 'Assist', 'Chatter',
        ],
    },
    {
		name: "[Gen 5] Balanced Hackmons",
		desc: [
			"Anything that can be hacked in-game and is usable in local battles is allowed.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/gen-v-balanced-hackmons.3463764/\">Balanced Hackmons</a>",
		],

		mod: 'gen5',
		searchShow: false,
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'OHKO Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Arena Trap', 'Huge Power', 'Pure Power', 'Shadow Tag', 'Wonder Guard'],
	},
    {
		name: "[Gen 4] Balanced Hackmons",
		desc: [
			"Anything that can be hacked in-game and is usable in local battles is allowed.",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/7258505/\">Balanced Hackmons</a>",
		],

		mod: 'gen4',
		searchShow: false,
		ruleset: ['Pokemon', 'Ability Clause', 'OHKO Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Arena Trap', 'Huge Power', 'Pure Power', 'Shadow Tag', 'Wonder Guard', 'Drizzle ++ Swift Swim', 'Drought ++ Chlorophyll', 'Sand Stream ++ Sand Rush'],
	},
    {
        name: "[Gen 7] Super Staff Bros. Melee",
        desc: ["&bullet; <a href=\"http://www.smogon.com/forums/threads/3491902/\">Seasonal Ladder</a>"],
                
        mod: 'seasonal',
		  searchShow: false,
        challengeShow: false,
        team: 'randomSeasonalMelee',
        ruleset: ['Sleep Clause Mod', 'Freeze Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
        onBegin: function () {
        this.add("raw|Super Staff Bros. <b>MELEEEEEEEEEEEEEE</b>!!");
        this.add('message', "SURVIVAL! GET READY FOR THE NEXT BATTLE!");
        
        let globalRenamedMoves = {};
        let customRenamedMoves = {};
                
        let allPokemon = this.p1.pokemon.concat(this.p2.pokemon);
        for (let i = 0, len = allPokemon.length; i < len; i++) {
            let pokemon = allPokemon[i];
            let last = pokemon.moves.length - 1;
            if (pokemon.moves[last]) {
                pokemon.moves[last] = toId(pokemon.set.signatureMove);
                pokemon.moveset[last].move = pokemon.set.signatureMove;
                pokemon.baseMoveset[last].move = pokemon.set.signatureMove;
            }
            for (let j = 0; j < pokemon.moveset.length; j++) {
                let moveData = pokemon.moveset[j];
                if (globalRenamedMoves[moveData.id]) {
                   pokemon.moves[j] = toId(pokemon.set.signatureMove);
                   moveData.move = globalRenamedMoves[moveData.id];
                   pokemon.baseMoveset[j].move = globalRenamedMoves[moveData.id];
                }
                
                let customRenamedSet = customRenamedMoves[toId(pokemon.name)];
                if (customRenamedSet && customRenamedSet[moveData.id]) {
                   pokemon.moves[j] = toId(pokemon.set.signatureMove);
                   moveData.move = customRenamedSet[moveData.id];
                   pokemon.baseMoveset[j].move = customRenamedSet[moveData.id];
                }
            }
        }
        },
                   // Here we add some flavour or design immunities.
        onImmunity: function (type, pokemon) {
            if (toId(pokemon.name) === 'juanma' && type === 'Fire') {
            this.add('-message', "Did you think fire would stop __him__? You **fool**!");
                return false;
            }
        },
        onNegateImmunity: function (pokemon, type) {
            if (pokemon.volatiles['flipside']) return false;
            const foes = pokemon.side.foe.active;
            if (foes.length && foes[0].volatiles['samuraijack'] && pokemon.hasType('Dark') && type === 'Psychic') return false;
        },
        onEffectiveness: function (typeMod, target, type, move) {
        if (!target.volatiles['flipside']) return;
                   if (move && move.id === 'retreat') return;
                   if (move && move.id === 'freezedry' && type === 'Water') return;
                   if (move && !this.getImmunity(move, type)) return 1;
                   return -typeMod;
                   },
                   // Hacks for megas changed abilities. This allow for their changed abilities.
                   onUpdate: function (pokemon) {
                   let name = toId(pokemon.name);
                   if (pokemon.template.isMega) {
                   if (name === 'andy' && pokemon.getAbility().id === 'magicbounce') {
                   pokemon.setAbility('adaptability');
                   this.add('-ability', pokemon, 'Adaptability');
        }
        if (name === 'reisen' && pokemon.getAbility().id === 'hugepower') {
            pokemon.setAbility('adaptability');
            this.add('-ability', pokemon, 'Tough Claws');
        }
        if (name === 'crestfall' && pokemon.getAbility().id === 'magicbounce') {
            pokemon.setAbility('simple');
            this.add('-ability', pokemon, 'Simple');
        }
        if (name === 'dreameatergengar' && pokemon.getAbility().id === 'shadowtag') {
            pokemon.setAbility('infiltrator');
            this.add('-ability', pokemon, 'Infiltrator');
        }
        if (name === 'overneat' && pokemon.getAbility().id === 'speedboost') {
            pokemon.setAbility('noguard');
            this.add('-ability', pokemon, 'No Guard');
        }
        if (name === 'skitty' && pokemon.getAbility().id === 'healer') {
            pokemon.setAbility('shedskin');
            this.add('-ability', pokemon, 'Shed Skin');
        }
        if (name === 'theimmortal' && pokemon.getAbility().id === 'megalauncher') {
            pokemon.setAbility('cloudnine');
        }
        }
        if (!this.shownTip) {
            this.add('raw|<div class=\"broadcast-green\"><br><b>请参考<a href="http://github.com/CTCC1/Pokemon-Showdown/blob/master/mods/seasonal/README.md">当前的精灵配置列表</a>，查询精灵的配置!</b></div>');
            this.shownTip = true;
        }
        },
        // Here we treat many things, read comments inside for information.
        onSwitchInPriority: 1,
        onSwitchIn: function (pokemon) {
        let name = toId(pokemon.illusion ? pokemon.illusion.name : pokemon.name);
                   
        // Wonder Guard is available, but it curses you.
        if (pokemon.getAbility().id === 'wonderguard' && pokemon.baseTemplate.baseSpecies !== 'Shedinja' && pokemon.baseTemplate.baseSpecies !== 'Kakuna') {
            pokemon.addVolatile('curse', pokemon);
            this.add('-message', pokemon.name + "'s Wonder Guard has cursed it!");
        }
                   
        // Add here more hacky stuff for mega abilities.
        // This happens when the mega switches in, as opposed to mega-evolving on the turn.
        if (pokemon.template.isMega) {
        if (name === 'andy' && pokemon.getAbility().id === 'magicbounce') {
            pokemon.setAbility('adaptability');
            this.add('-ability', pokemon, 'Adaptability');
        }
        if (name === 'reisen' && pokemon.getAbility().id === 'hugepower') {
            pokemon.setAbility('adaptability');
            this.add('-ability', pokemon, 'Tough Claws');
        }
                   if (name === 'crestfall' && pokemon.getAbility().id === 'magicbounce') {
                   pokemon.setAbility('simple');
                   this.add('-ability', pokemon, 'Simple');
                   }
                   if (name === 'dreameatergengar' && pokemon.getAbility().id === 'shadowtag') {
                   pokemon.setAbility('infiltrator');
                   this.add('-ability', pokemon, 'Infiltrator');
                   }
                   if (name === 'overneat' && pokemon.getAbility().id === 'speedboost') {
                   pokemon.setAbility('noguard');
                   this.add('-ability', pokemon, 'No Guard');
                   }
                   if (name === 'skitty' && pokemon.getAbility().id === 'healer') {
                   pokemon.setAbility('shedskin');
                   this.add('-ability', pokemon, 'Shed Skin');
                   }
                   if (name === 'theimmortal' && pokemon.getAbility().id === 'megalauncher') {
                   pokemon.setAbility('cloudnine');
                   }
                   } else {
                   // Bypass one mega limit.
                   pokemon.canMegaEvo = this.canMegaEvo(pokemon);
                   }
                   
                   // Innate effects.
                   if (name === 'ascriptmaster') {
                   pokemon.addVolatile('ascriptinnate', pokemon);
                   }
                   if (name === 'atomicllamas') {
                   pokemon.addVolatile('baddreamsinnate', pokemon);
                   }
                   if (name === 'blastchance') {
                   pokemon.addVolatile('flipside', pokemon);
                   }
                   if (name === 'bondie') {
                   pokemon.addVolatile('crabstance', pokemon);
                   }
                   if (name === 'clefairy') {
                   pokemon.addVolatile('coldsteel', pokemon);
                   }
                   if (name === 'duck') {
                   pokemon.addVolatile('firstblood', pokemon);
                   }
                   if (name === 'eeveegeneral') {
                   this.add('detailschange', pokemon, pokemon.details); //run mega evo animation
                   this.add('-mega', pokemon, 'Eevee', null);
                   for (let i = 0; i < pokemon.stats.length; i++) {
                   pokemon.stats[i] += 50;
                   }
                   }
                   if (name === 'formerhope') {
                   pokemon.addVolatile('cursedbodyinnate', pokemon);
                   }
                   if (name === 'galbia' || name === 'aurora') {
                   this.setWeather('sandstorm');
                   }
                   if (name === 'rodan') {
                   pokemon.addVolatile('gonnamakeyousweat', pokemon);
                   }
                   if (name === 'giagantic') {
                   pokemon.addVolatile('deltastreaminnate', pokemon);
                   }
                   if (name === 'hashtag') {
                   this.boost({spe:1}, pokemon, pokemon, 'innate ability');
                   }
                   if (name === 'haund') {
                   pokemon.addVolatile('prodigy', pokemon);
                   }
                   if (name === 'innovamania' && !pokemon.illusion) {
                   this.boost({atk:6, def:6, spa:6, spd:6, spe:6, accuracy:6}, pokemon, pokemon, 'divine grace');
                   }
                   if (name === 'jackhiggins') {
                   this.setWeather('sunnyday');
                   }
                   if (name === 'lemonade') {
                   pokemon.addVolatile('adaptabilityinnate', pokemon);
                   }
                   if (name === 'manu11') {
                   pokemon.addVolatile('arachnophobia', pokemon);
                   }
                   if (name === 'marshmallon') {
                   this.boost({def: 1}, pokemon, pokemon, 'fur coat innate');
                   }
                   if (name === 'mizuhime' || name === 'kalalokki' || name === 'sweep') {
                   this.setWeather('raindance');
                   }
                   if (name === 'nv') {
                   pokemon.addVolatile('cuteness', pokemon);
                   }
                   if (name === 'pikachuun') {
                   this.boost({spe: 1}, pokemon, pokemon, 'Reisen Cosplay');
                   }
                   if (name === 'qtrx') {
                   pokemon.addVolatile('qtrxinnate', pokemon);
                   }
                   if (name === 'raseri') {
                   this.useMove('hypnosis', pokemon);
                   }
                   if (name === 'rssp1') {
                   pokemon.addVolatile('speedboostinnate', pokemon);
                   }
                   if (name === 'scythernoswiping') {
                   pokemon.addVolatile('mountaineerinnate', pokemon);
                   }
                   if (name === 'sigilyph') {
                   pokemon.addVolatile('samuraijack', pokemon);
                   }
                   if (name === 'sonired') {
                   this.boost({def: -1, spd: -1, atk: 1, spe: 1}, pokemon, pokemon, 'Weak Skin');
                   }
                   if (name === 'snobalt') {
                   pokemon.addVolatile('amityabsorb', pokemon);
                   }
                   if (name === 'spacebass') {
                   pokemon.addVolatile('badtrip', pokemon);
                   }
                   if (name === 'sparktrain') {
                   pokemon.addVolatile('refrigerateinnate', pokemon);
                   }
                   if (name === 'specsmegabeedrill') {
                   pokemon.addVolatile('weed', pokemon);
                   }
                   if (name === 'starmei') {
                   this.useMove('cosmicpower', pokemon);
                   }
                   if (name === 'talkingtree') {
                   this.useMove('synthesis', pokemon);
                   this.useMove('bulkup', pokemon);
                   }
                   if (name === 'teremiare') {
                   pokemon.addVolatile('coinflip', pokemon);
                   }
                   if (name === 'trickster' || name === 'blitzamirin') {
                   let target = pokemon.battle[pokemon.side.id === 'p1' ? 'p2' : 'p1'].active[0];
                   let targetBoosts = {};
                   let sourceBoosts = {};
                   for (let i in target.boosts) {
                   targetBoosts[i] = target.boosts[i];
                   sourceBoosts[i] = pokemon.boosts[i];
                   }
                   target.setBoost(sourceBoosts);
                   pokemon.setBoost(targetBoosts);
                   this.add('-swapboost', pokemon, target);
                   }
                   if (name === 'unfixable') {
                   pokemon.addVolatile('ironbarbsinnate', pokemon);
                   }
                   if (name === 'urkerab') {
                   pokemon.addVolatile('focusenergy', pokemon);
                   this.useMove('magnetrise', pokemon);
                   }
                   if (name === 'uselesstrainer') {
                   pokemon.addVolatile('ninja', pokemon);
                   }
                   if (name === 'winry') {
                   pokemon.addVolatile('hellacute', pokemon);
                   }
                   // Edgy switch-in sentences go here.
                   // Sentences vary in style and how they are presented, so each Pokémon has its own way of sending them.
                   let sentences = [];
                   let sentence = '';
                   
                   if (name === 'acast') {
                   this.add('c|%Acast|__A wild Castform appeared!__');
                   }
                   if (name === 'ace') {
                   this.add('c|@Ace|Lmaonade');
                   }
                   if (name === 'aelita') {
                   this.add('c|%Aelita|Transfer, Aelita. Scanner, Aelita. Virtualization!');
                   }
                   if (name === 'ajhockeystar') {
                   this.add('c|+ajhockeystar|Here comes the greatest hockey player alive!');
                   }
                   if (name === 'albacore') {
                   this.add('c|@Albacore|do I have to?');
                   }
                   if (name === 'albert') {
                   this.add('c|+Albert|Art is risk.');
                   }
                   if (name === 'always') {
                   sentence = (pokemon.side.foe.active.length && pokemon.side.foe.active[0].hp ? pokemon.side.foe.active[0].name : "... ohh nobody's there...");
                   this.add('c|+Always|Oh it\'s ' + sentence);
                   }
                   if (name === 'am') {
                   this.add('c|+AM|Lucky and Bad');
                   }
                   if (name === 'andy') {
                   this.add('c|%AndrewGoncel|:I');
                   }
                   if (name === 'antemortem') {
                   this.add('c|&antemortem|I Am Here To Oppress Users');
                   }
                   if (name === 'anttya') {
                   this.add('c|+Anttya|Those crits didn\'t even matter');
                   }
                   if (name === 'anty') {
                   this.add('c|+Anty|mhm');
                   }
                   if (name === 'articuno') {
                   this.add('c|%Articuno|Abolish the patriarchy!');
                   }
                   if (name === 'ascriptmaster') {
                   this.add("c|@Ascriptmaster|It's time for a hero to take the stage!");
                   }
                   if (name === 'astara') {
                   this.add('c|%Ast☆arA|I\'d rather take a nap, I hope you won\'t be a petilil shit, Eat some rare candies and get on my level.');
                   }
                   if (name === 'asty') {
                   this.add('c|@Asty|Top kek :^)');
                   }
                   if (name === 'atomicllamas') {
                   this.add('c|&atomicllamas|(celebrate)(dog)(celebrate)');
                   }
                   if (name === 'aurora') {
                   this.add('c|@Aurora|Best of luck to all competitors!');
                   }
                   if (name === 'reisen') {
                   this.add('c|%Reisen|Fite me irl bruh.');
                   }
                   if (name === 'beowulf') {
                   this.add('c|@Beowulf|Grovel peasant, you are in the presence of the RNGesus');
                   }
                   if (name === 'biggie') {
                   sentences = ["Now I'm in the limelight cause I rhyme tight", "HAPPY FEET! WOMBO COMBO!", "You finna mess around and get dunked on"];
                   this.add('c|@biggie|' + sentences[this.random(3)]);
                   }
                   if (name === 'blastchance') {
                   this.add("c|+Blast Chance|MAN BALAMAR");
                   }
                   if (name === 'blitzamirin') {
                   this.add('c|@Blitzamirin|How Can Mirrors Be Real If Our Eyes Aren\'t Real? ╰( ~ ◕ ᗜ ◕ ~ )੭━☆ﾟ.*･｡ﾟ');
                   }
                   if (name === 'bludz') {
                   this.add('c|+bludz|420 blaze it');
                   }
                   if (name === 'bondie') {
                   this.add('c|+Bondie|__(\\/) snip snip (\\/)__');
                   }
                   if (name === 'bottt') {
                   this.add('c|boTTT|Beep, boop');
                   }
                   if (name === 'brandon') {
                   this.add("c|+Brrandon|Life's too short to take it seriously ALL the time.");
                   }
                   if (name === 'bumbadadabum') {
                   this.add('c|@bumbadadabum|Time for card games on motorcycles!');
                   if (pokemon.side.foe.active.length && pokemon.side.foe.active[0].name === 'Scotteh') this.add('c|@bumbadadabum|Also, fuck you Scotteh');
                   }
                   if (name === 'bummer') {
                   this.add("c|&Bummer|Oh hi.");
                   }
                   if (name === 'chaos') {
                   this.add("c|~chaos|I always win");
                   }
                   if (name === 'ciran') {
                   this.add("c|+Ciran|You called?");
                   }
                   if (name === 'clefairy') {
                   this.add('c|+Clefairy|google "dj clefairyfreak" now');
                   }
                   if (name === 'coolstorybrobat') {
                   sentence = [
                               "Time to GET SLAYED", "BRUH!", "Ahem! Gentlemen...", "I spent 6 months training in the mountains for this day!",
                               "Shoutout to all the pear...",
                               ][this.random(5)];
                   this.add('c|@CoolStoryBrobat|' + sentence);
                   }
                   if (name === 'crestfall') {
                   this.add('c|%Crestfall|To say that we\'re in love is dangerous');
                   }
                   if (name === 'deathonwings') {
                   this.add('c|+Death on Wings|rof');
                   }
                   if (name === 'dirpz') {
                   this.add('c|+Dirpz|IT\'S A WATER/FAIRY TYPE!!11!');
                   }
                   if (name === 'dmt') {
                   this.add('c|+DMT|DMT');
                   }
                   if (name === 'dreameatergengar') {
                   this.add('c|+Dream Eater Gengar|Goodnight sweet prince.');
                   }
                   if (name === 'duck') {
                   this.add('c|@Duck|Don\'t duck with me!');
                   }
                   if (name === 'e4flint') {
                   this.add('c|+E4 Flint|hf lul');
                   }
                   if (name === 'eeveegeneral') {
                   sentences = ['yo', 'anyone seen goku?'];
                   this.add('c|~Eevee General|' + sentences[this.random(2)]);
                   }
                   if (name === 'eyan') {
                   this.add('c|@Eyan|░░░░░░░░▄▄▄▀▀▀▄▄███▄░░░░░░░░░░░░░░░░░');
                   this.add('c|@Eyan|░░░░░▄▀▀░░░░░░░▐░▀██▌░░░░░░░░░░░░░░░░');
                   this.add('c|@Eyan|░░░▄▀░░░░▄▄███░▌▀▀░▀█░░░░░░░░░░░░░░░░');
                   this.add('c|@Eyan|░░▄█░░▄▀▀▒▒▒▒▒▄▐░░░░█▌░░░░░░░░░░░░░░░ ');
                   this.add('c|@Eyan|░▐█▀▄▀▄▄▄▄▀▀▀▀▌░░░░░▐█▄░░░░░░░░░░░░░░');
                   this.add('c|@Eyan|░▌▄▄▀▀░░░░░░░░▌░░░░▄███████▄░░░░░░░░░');
                   this.add('c|@Eyan|░░░░░░░░░░░░░▐░░░░▐███████████▄░░░░░░');
                   this.add('c|@Eyan|░░░░░le░░░░░░░▐░░░░▐█████████████▄░░░');
                   this.add('c|@Eyan|░░░░toucan░░░░░░▀▄░░░▐██████████████▄');
                   this.add('c|@Eyan|░░░░░░has░░░░░░░░▀▄▄████████████████▄');
                   this.add('c|@Eyan|░░░░░arrived░░░░░░░░░░░░█▀██████░░░░░');
                   this.add('c|@Eyan|WELCOME TO COMPETITIVE TOUCANNING');
                   }
                   if (name === 'feliburn') {
                   this.add('c|@Feliburn|you don\'t go hand to hand with a fighter noob');
                   }
                   if (name === 'fireburn') {
                   this.add('c|+Fireburn|:V');
                   }
                   if (name === 'flyingkebab') {
                   this.add("c|+Flying Kebab|Kebab > Pizza");
                   }
                   if (name === 'formerhope') {
                   this.add('c|@Former Hope|I have Hope');
                   }
                   if (name === 'freeroamer') {
                   this.add('c|%Freeroamer|lol this is a wrap');
                   }
                   if (name === 'frysinger') {
                   this.add("c|+Frysinger|Nice boosts kid.");
                   }
                   if (name === 'fx') {
                   this.add("c|+f(x)|love is 4 wawawawawawawalls");
                   }
                   if (name === 'galbia') {
                   this.add('c|@galbia|(dog)');
                   }
                   if (name === 'galom') {
                   this.add('c|+Galom|To the end.');
                   }
                   if (name === 'rodan') { // don't delete
                   this.add("c|+RODAN|Here I Come, Rougher Than The Rest of 'Em.");
                   }
                   if (name === 'geoffbruedly') {
                   this.add("c|%GeoffBruedly|FOR WINRY");
                   }
                   if (name === 'giagantic') {
                   this.add("c|%Giagantic|e.e");
                   }
                   if (name === 'golui') {
                   this.add("c|+Golui|Golly gee");
                   }
                   if (name === 'goodmorningespeon') {
                   this.add("c|+GoodMorningEspeon|type /part to continue participating in this battle :)");
                   }
                   if (name === 'grimauxiliatrix') {
                   this.add("c|%grimAuxiliatrix|ᕕ( ᐛ )ᕗ");
                   }
                   if (name === 'halite') {
                   this.add('c|@Halite|You’re gonna get haxxed kid :^)');
                   }
                   if (name === 'hannah') {
                   this.add('c|+Hannahh|♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥');
                   }
                   if (name === 'hashtag') {
                   this.add("c|#Hashtag|hey opponent, you get 5 hashtag points if you forfeit right now ;}");
                   }
                   if (name === 'haund') {
                   this.add('c|%Haund|le balanced normal flying bird has arrived');
                   }
                   if (name === 'healndeal') {
                   this.add('c|+HeaLnDeaL|screw clerics');
                   }
                   if (name === 'himynamesl') {
                   this.add('c|@HiMyNamesL|There’s no such thing as winning or losing. There is won and there is lost, there is victory and defeat. There are absolutes. Everything in between is still left to fight for.');
                   this.add('c|@HiMyNamesL|' + pokemon.side.foe.name + ' will have won only when there is no one left to stand against them. Until then, there is only the struggle, because tides do what tides do – they turn.');
                   }
                   if (name === 'hippopotas') {
                   this.add('-message', '@Hippopotas\'s Sand Stream whipped up a sandstorm!');
                   }
                   if (name === 'hollywood') {
                   this.add('c|+hollywood|Kappa');
                   }
                   if (name === 'ih8ih8sn0w') {
                   this.add('c|+ih8ih8sn0w|*sips tea*');
                   }
                   if (name === 'imanalt') {
                   this.add('c|+imanalt|muh bulk');
                   }
                   if (name === 'imas234') {
                   this.add('c|@imas234|hlo');
                   }
                   if (name === 'innovamania') {
                   sentences = ['Don\'t take this seriously', 'These Black Glasses sure look cool', 'Ready for some fun?( ͡° ͜ʖ ͡°)', '( ͡° ͜ʖ ͡°'];
                   this.add('c|@innovamania|' + sentences[this.random(4)]);
                   }
                   if (name === 'iplaytennislol') {
                   this.add('c|%iplaytennislol|KACAW');
                   }
                   if (name === 'iyarito') {
                   this.add('c|+Iyarito|Welp');
                   }
                   if (name === 'jackhiggins') {
                   this.add("c|+Jack Higgins|Ciran was right, fun deserved to be banned");
                   }
                   if (name === 'jasmine') {
                   this.add("c|+Jasmine|I'm still relevant!");
                   }
                   if (name === 'jdarden') {
                   this.add('c|@jdarden|Did someone call for some BALK?');
                   }
                   if (name === 'jetpack') {
                   this.add('c|+Jetpack|You\'ve met with a terrible fate, haven\'t you?');
                   }
                   if (name === 'joim') {
                   let dice = this.random(8);
                   if (dice === 1) {
                   this.add('c|~Joim|░░░░░░░░░░░░▄▐');
                   this.add('c|~Joim|░░░░░░▄▄▄░░▄██▄');
                   this.add('c|~Joim|░░░░░▐▀█▀▌░░░░▀█▄');
                   this.add('c|~Joim|░░░░░▐█▄█▌░░░░░░▀█▄');
                   this.add('c|~Joim|░░░░░░▀▄▀░░░▄▄▄▄▄▀▀');
                   this.add('c|~Joim|░░░░▄▄▄██▀▀▀▀');
                   this.add('c|~Joim|░░░█▀▄▄▄█░▀▀');
                   this.add('c|~Joim|░░░▌░▄▄▄▐▌▀▀▀');
                   this.add('c|~Joim|▄░▐░░░▄▄░█░▀▀ U HAVE BEEN SPOOKED');
                   this.add('c|~Joim|▀█▌░░░▄░▀█▀░▀');
                   this.add('c|~Joim|░░░░░░░▄▄▐▌▄▄ BY THE');
                   this.add('c|~Joim|░░░░░░░▀███▀█░▄');
                   this.add('c|~Joim|░░░░░░▐▌▀▄▀▄▀▐▄ SPOOKY SKILENTON');
                   this.add('c|~Joim|░░░░░░▐▀░░░░░░▐▌');
                   this.add('c|~Joim|░░░░░░█░░░░░░░░█');
                   this.add('c|~Joim|░░░░░▐▌░░░░░░░░░█');
                   this.add('c|~Joim|░░░░░█░░░░░░░░░░▐▌ SEND THIS TO 7 PPL OR SKELINTONS WILL EAT YOU');
                   } else {
                   sentences = [
                                "Finally a good reason to punch a teenager in the face!", "WUBBA LUBBA DUB DUB",
                                "``So here we are again, it's always such a pleasure.``", "My ex-wife still misses me, BUT HER AIM IS GETTING BETTER!",
                                "A man chooses, a slave obeys.", "You're gonna have a bad time.", "Would you kindly let me win?",
                                "I'm sorry, but I only enjoy vintage memes from the early 00's.",
                                ];
                   sentence = sentences[this.random(8)];
                   this.add('c|~Joim|' + sentence);
                   }
                   }
                   if (name === 'juanma') {
                   this.add("c|+Juanma|Okay, well, sometimes, science is more art than science, " + pokemon.side.name + ". A lot of people don't get that.");
                   }
                   if (name === 'kalalokki') {
                   this.add('c|+Kalalokki|(•_•)');
                   this.add('c|+Kalalokki|( •_•)>⌐■-■');
                   this.add('c|+Kalalokki|(⌐■_■)');
                   }
                   if (name === 'kidwizard') {
                   this.add('c|+Kid Wizard|Eevee General room mod me.');
                   }
                   if (name === 'layell') {
                   this.add('c|@Layell|Enter stage left');
                   }
                   if (name === 'legitimateusername') {
                   sentence = ["This isn't my fault.", "I'm not sorry."][this.random(2)];
                   this.add('c|@LegitimateUsername|``' + sentence + '``');
                   }
                   if (name === 'lemonade') {
                   this.add('c|+Lemonade|Pasta');
                   }
                   if (name === 'level51') {
                   this.add('c|@Level 51|n_n!');
                   }
                   if (name === 'lj') {
                   this.add('c|%LJDarkrai|Powerfulll');
                   }
                   if (name === 'lyto') {
                   sentences = ["This is divine retribution!", "I will handle this myself!", "Let battle commence!"];
                   this.add('c|@Lyto|' + sentences[this.random(3)]);
                   }
                   if (name === 'macle') {
                   this.add("c|+macle|Follow the Frog Blog");
                   }
                   if (name === 'manu11') {
                   this.add("c|@manu 11|/me is pet by ihateyourpancreas");
                   }
                   if (name === 'marshmallon') {
                   this.add("c|%Marshmallon|Marshtomb be like");
                   this.add("c|%Marshmallon|- He sees you when you're sleeping -");
                   this.add("c|%Marshmallon|- He knows when you're awake -");
                   this.add("c|%Marshmallon|- He knows if you've been bad or good -");
                   this.add("c|%Marshmallon|- So be good for goodness sake -");
                   }
                   if (name === 'mattl') {
                   this.add('c|+MattL|If you strike me down, I shall become more powerful than you can possibly imagine.');
                   }
                   if (name === 'mcmeghan') {
                   this.add("c|&McMeghan|A Game of Odds");
                   }
                   if (name === 'megazard') {
                   this.add('c|+Megazard|New tricks');
                   }
                   if (name === 'mizuhime') {
                   this.add('c|+Mizuhime|Thou Shalt Double Laser From The Edge');
                   }
                   if (name === 'nv') {
                   this.add('c|+nv|Who tf is nv?');
                   }
                   if (name === 'omegaxis') {
                   this.add('c|+Omega-Xis|lol this isn’t even my final form');
                   }
                   if (name === 'orday') {
                   this.add('c|%Orda-Y|❄');
                   }
                   if (name === 'overneat') {
                   this.add('c|+Overneat|tsk, tsk, is going to be funny');
                   }
                   if (name === 'paradise') {
                   this.add('c|%Paradise~|I sexually identify as a hazard setter');
                   }
                   if (name === 'pikachuun') {
                   sentences = ['Reisen is best waifu', 'Hey look I coded myself into the game', 'sup (\'.w.\')'];
                   this.add('c|+Pikachuun|' + sentences[this.random(3)]);
                   }
                   if (name === 'pluviometer') {
                   this.add('c|+pluviometer|p^2laceholder');
                   }
                   if (name === 'qtrx') {
                   sentences = ["cutie are ex", "q-trix", "quarters", "cute T-rex", "Qatari", "random letters", "spammy letters", "asgdf"];
                   this.add("c|@qtrx|omg DONT call me '" + sentences[this.random(8)] + "' pls respect my name its very special!!1!");
                   }
                   if (name === 'quitequiet') {
                   this.add("c|@Quite Quiet|I'll give it a shot.");
                   }
                   if (name === 'raseri') {
                   this.add('c|&Raseri|gg');
                   }
                   if (name === 'raven') {
                   this.add('c|&Raven|Are you ready? Then let the challenge... Begin!');
                   }
                   if (name === 'rekeri') {
                   this.add('c|@rekeri|Get Rekeri\'d :]');
                   }
                   if (name === 'rosiethevenusaur') {
                   sentences = ['!dt party', 'Are you Wifi whitelisted?', 'Read the roomintro!'];
                   this.add('c|@RosieTheVenusaur|' + sentences[this.random(3)]);
                   }
                   if (name === 'rssp1') {
                   this.add('c|+rssp1|Witness the power of the almighty Rufflet!');
                   }
                   if (name === 'sailorcosmos') {
                   this.add("c|+SailorCosmos|Cosmos Prism Power Make Up!");
                   }
                   if (name === 'scotteh') {
                   this.add('c|&Scotteh|─────▄▄████▀█▄');
                   this.add('c|&Scotteh|───▄██████████████████▄');
                   if (pokemon.side.foe.active.length && pokemon.side.foe.active[0].name === 'bumbadadabum') this.add('c|@bumbadadabum|Fuck you Scotteh');
                   this.add('c|&Scotteh|─▄█████.▼.▼.▼.▼.▼.▼.▼');
                   }
                   if (name === 'scpinion') {
                   this.add('c|@scpinion|/me welcomes funbro');
                   }
                   if (name === 'scythernoswiping') {
                   this.add('c|%Scyther NO Swiping|/me prepares to swipe victory');
                   }
                   if (name === 'shrang') {
                   this.add('raw| [15:30] @<b>Scrappie</b>: It is I, the great and powerful shrang, who is superior to you proles in every conceivable way.');
                   }
                   if (name === 'sigilyph') {
                   this.add('c|@Sigilyph|Prepare to feel the mighty power of an exploding star!');
                   }
                   if (name === 'sirdonovan') {
                   this.add('c|&sirDonovan|Oh, a battle? Let me finish my tea and crumpets');
                   }
                   if (name === 'skitty') {
                   this.add('c|@Skitty|\\_$-_-$_/');
                   }
                   if (name === 'snobalt') {
                   this.add('c|+Snobalt|By the power vested in me from the great Lord Tomohawk...');
                   }
                   if (name === 'snowy') {
                   this.add('c|+Snowy|Why do a lot of black people call each other monica?');
                   }
                   if (name === 'solarisfox') {
                   this.add('raw|<div class="chat chatmessage-solarisfox"><small>%</small><b><font color="#2D8F1E"><span class="username" data-name="SolarisFox">SolarisFox</span>:</font></b> <em><marquee behavior="alternate" scrollamount=3 scrolldelay="60" width="108">[Intense vibrating]</marquee></em></div>');
                   }
                   if (name === 'sonired') {
                   this.add('c|+Sonired|~');
                   }
                   if (name === 'spacebass') {
                   this.add('c|@SpaceBass|He aims his good ear best he can towards conversation and sometimes leans in awkward toward your seat');
                   this.add('c|@SpaceBass|And if by chance one feels their space too invaded, then try your best to calmly be discreet');
                   this.add('c|@SpaceBass|Because this septic breathed man that stands before you is a champion from days gone by');
                   }
                   if (name === 'sparktrain') {
                   this.add('c|+sparktrain|hi');
                   }
                   if (name === 'specsmegabeedrill') {
                   this.add('c|+SpecsMegaBeedrill|(◕‿◕✿)');
                   }
                   if (name === 'spy') {
                   sentences = ['curry consumer', 'try to keep up', 'fucking try to knock me down', 'Sometimes I slather myself in vasoline and pretend I\'m a slug', 'I\'m really feeling it!'];
                   this.add('c|+Spy|' + sentences[this.random(5)]);
                   }
                   if (name === 'starmei') {
                   this.add('c|+Starmei|Starmei wins again');
                   }
                   if (name === 'starry') {
                   this.add('c|%starry|oh');
                   }
                   if (name === 'steamroll') {
                   this.add('c|@Steamroll|Banhammer ready!');
                   }
                   if (name === 'sunfished') {
                   this.add('c|+Sunfished|*raptor screeches*');
                   }
                   if (name === 'sweep') {
                   this.add('c|&Sweep|(ninjacat)(beer)');
                   }
                   if (name === 'talkingtree') {
                   this.add('c|+talkingtree|I am Groot n_n');
                   }
                   if (name === 'teg') {
                   this.add("c|+TEG|It's __The__ Eevee General");
                   }
                   if (name === 'temporaryanonymous') {
                   sentences = ['Hey, hey, can I gently scramble your insides (just for laughs)? ``hahahaha``', 'check em', 'If you strike me down, I shall become more powerful than you can possibly imagine! I have a strong deathrattle effect and I cannot be silenced!'];
                   this.add('c|@Temporaryanonymous|' + sentences[this.random(3)]);
                   }
                   if (name === 'teremiare') {
                   this.add('c|%Teremiare|I like to call it skill');
                   }
                   if (name === 'theimmortal') {
                   this.add('c|~The Immortal|Give me my robe, put on my crown!');
                   }
                   if (name === 'tone114') {
                   this.add('c|+TONE114|Haven\'t you heard the new sensation sweeping the nation?');
                   }
                   if (name === 'trickster') {
                   sentences = ["heh….watch out before you get cut on my edge", "AaAaAaAAaAaAAa"];
                   this.add('c|@Trickster|' + sentences[this.random(2)]);
                   }
                   if (name === 'unfixable') {
                   this.add('c|+unfixable|eevee general sucks lol');
                   }
                   if (name === 'urkerab') {
                   this.add('j|urkerab');
                   }
                   if (name === 'uselesstrainer') {
                   sentences = ['huehuehuehue', 'PIZA', 'SPAGUETI', 'RAVIOLI RAVIOLI GIVE ME THE FORMUOLI', 'get ready for PUN-ishment', 'PIU\' RUSPE PER TUTTI, E I MARO\'???'];
                   this.add('c|@useless trainer|' + sentences[this.random(6)]);
                   }
                   if (name === 'vapo') {
                   this.add('c|%Vapo|/me vapes');
                   }
                   if (name === 'vexeniv') {
                   this.add('c|+Vexen IV|The Arcana is the means by which all is revealed.');
                   }
                   if (name === 'winry') {
                   this.add('c|@Winry|fight me irl');
                   }
                   if (name === 'xfix') {
                   if (this.random(2)) {
                   // The classic one
                   const hazards = {stealthrock: 1, spikes: 1, toxicspikes: 1, burnspikes: 1, stickyweb: 1};
                   let hasHazards = false;
                   for (const hazard in hazards) {
                   if (pokemon.side.getSideCondition(hazard)) {
                   hasHazards = true;
                   break;
                   }
                   }
                   if (hasHazards) {
                   this.add('c|+xfix|(no haz... too late)');
                   } else {
                   this.add('c|+xfix|(no hazards, attacks only, final destination)');
                   }
                   } else {
                   this.add("c|+xfix|//starthunt 1 + 1 | 2 | 2 + 2 | 4 | Opponent's status soon (answer with three letters) | FNT :)");
                   }
                   }
                   if (name === 'xjoelituh') {
                   this.add("c|%xJoelituh|I won't be haxed again, you will be the next one. UUUUUU");
                   }
                   if (name === 'xshiba') { // dd
                   this.add("c|+xShiba|LINDA IS INDA");
                   }
                   if (name === 'zarel') {
                   this.add('c|~Zarel|Your mom');
                   }
                   if (name === 'zebraiken') {
                   pokemon.phraseIndex = this.random(3);
                   //  Zeb's faint and entry phrases correspond to each other.
                   if (pokemon.phraseIndex === 2) {
                   this.add('c|&Zebraiken|bzzt n_n');
                   } else if (pokemon.phraseIndex === 1) {
                   this.add('c|&Zebraiken|bzzt *_*');
                   } else {
                   this.add('c|&Zebraiken|bzzt o_o');
                   }
                   }
                   if (name === 'zeroluxgiven') {
                   this.add('c|%Zero Lux Given|This should be an electrifying battle!');
                   }
                   if (name === 'zodiax') {
                   this.add('c|%Zodiax|Introducing 7 time Grand Champion to the battle!');
                   }
                   if (pokemon.species === 'Arceus-Steel') {
                   this.add('c|~FSK| If winter comes, can spring be far behind?');
                   this.add('c|*FSK专属技能|Ultimate Judgment：造成100点伤害，钢属性');
                   }
                   if (pokemon.species === 'Salamence') {
                   this.add('c|~EroyalBoy|你已难逃一吸');
                   this.add('c|*EB专属技能|Jolin Boomburst：普通系140特攻，回复伤害的3/4');
                   }
                   if (pokemon.species === 'Yveltal'){
                   this.add('c|*SC专属技能|Dark Wind:使用挑拨；上场第一次使用，会同时使出顺风和蝶舞');
                   }
                   if (pokemon.species === 'Giratina') {
                   this.add('c|@暗黑员|我是光明的员');
                   this.add('c|*暗黑员专属技能|Dark Spite：32PP，每次使用消耗对面4PP');
                   }
                   if (pokemon.species === 'Ferrothorn') {
                   this.add('c|@lxz|我一点也不受');
                   this.add('c|*总受lxz专属技能|Haze Shield：同时使出黑雾和碉堡');
                   }
                   if (pokemon.species === 'Tyranitar-Mega') {
                   this.add('c|@lxz|我真的一点也不受');
                   this.add('c|*Megalxz专属技能|Sennen Goroshi(千年杀)：恶系90物攻，必定CT');
                   }
                   if (pokemon.species === 'Kirlia') {
                   this.add('c|*圣光专属技能|intial song：妖精系60特攻，先制+1');
                   }
                   if (name === 'vincent') {
                   this.add('c|Vincent|还记得被LC支配的恐惧吗');
                   this.add('c|*文森特专属技能|Vincent Shield：同时使用王盾和龙舞');
                   }
                   if (pokemon.species === 'Whimsicott') {
                   this.add('c|*风妖专属技能|Prankster Shield：同时使用保护和替身，PP为4');
                   }
                   if (pokemon.species === 'Scizor-Mega'){
                   this.add('c|*源氏专属技能|Genji Bounce：反弹当回合所有攻击技能，连续使用必将失败');
                   this.add('c|*源氏专属技能|Steelate：普通系技能变成钢系，威力*1.2');
                   }
                   if (pokemon.species === 'Beedrill-Mega'){
                   this.add('c|*MS专属技能|Innovative Turn：使用暗影偷盗和蜻蜓回转');
                   }
                   if (pokemon.species === 'Pidgeot-Mega'){
                   this.add('c|*晋文公专属技能|The Crow Sea：恶系100特攻，以物防计算伤害');
                   }
                   if (pokemon.species === 'Swampert'){
                   this.add('c|*噩梦狙击专属技能|Sniping Nightmare：飞行+火系90物攻');
                   }
                   if (pokemon.species === 'Deoxys-Speed'){
                   this.add('c|*正弦专属技能|Imprisonform：变成对手的样子之后使用封印');
                   }
                   if (pokemon.species === 'Prinplup'){
                   this.add('c|*袁绍专属技能|Triumphantly Command：水系60物攻，对地面上的精灵威力翻倍');
                   }
                   if (pokemon.species === 'Metagross'){
                   this.add('c|*暗星专属技能|Ultimate Charge：物理80威力超能技能，开超场，同时使用蓄电');
                   this.add('c|*暗星Mega前专属特性|：每回合随机提升一级防御或特防');
                   }
                   if (pokemon.species === 'Rotom-Frost'){
                   this.add('c|*电冰箱专属技能|Dance of control：威力70 电系特攻，对地面有效，先制度+1，25%害怕');
                   }
                   if (pokemon.species === 'Weavile'){
                   this.add('c|*玛狃拉专属技能|Backstab：必定命中，在对方生命值小于50%时直接秒杀，否则0威力');
                   this.add('c|*玛狃拉专属特性|Assassin：攻击对方时以对方两防中较低的一项计算防御');
                   }
                   if (pokemon.species === 'Togekiss'){
                   this.add('c|*充钱者专属特性|Fasthax：G6疾风之翼和天恩的合体');
                   }
                   if (pokemon.species === 'Raticate-Alola'){
                   this.add('c|*阿罗拉拉达专属技能|Celebration:是PP1的Z庆祝');
                   }
                   if (pokemon.species === 'Kyogre'){
                   this.add('c|+loving1096| 我好兴奋啊!');
                   this.add('c|*爱叔专属技能|Excited Surf:冲浪同时回复伤害的1/2');
                   this.add('c|*爱叔专属特性|Water Spin:使用喷水时，清除己方场上所有钉子');
                   }
                   if (pokemon.species === 'Heracross-Mega'){
                   this.add('c|*赫拉专属特性|Nerfed Triage:回复技能先制度+0.5');
                   }
                   if (pokemon.species === 'Blissey'){
                   this.add('c|*IDS专属特性|Smilence:再生力+毒疗+自然回复');
                   }
                   if (pokemon.species === 'Alakazam-Mega'){
                   this.add('c|*LY专属技能|Spewing Psychic 超能系特攻，威力90，命中后开超场');
                   }
                   if (pokemon.species === 'Gengar'){
                   this.add('c|+ahhh| 我才不是日狗吹呢!');
                   this.add('c|*ahhh专属技能|lmfao:随机使用同归/怨念/定身法，并将对方的第二属性设定为鬼系,先制+3');
                   this.add('c|*ahhh专属特性|Cursed Soul:上场随机使用电磁波/鬼火/剧毒，赋予对手诅咒状态');
                   if (pokemon.side.foe.active.length && pokemon.side.foe.active[0].name === 'loving1069') this.add('c|@ahhh|爱叔又兴奋了...');
                   }
                   if (pokemon.species === 'Tapu Bulu'){
                   this.add('c|绝望的非洲人| 脸真是黑死了...');
                   this.add('c|*非洲人专属特性|African Rampage:制造非洲场地，所有技能的命中率变为原来的74%,如果自己的技能miss,则会因为愤怒连续使用3次该技能');
                   }
                   if (pokemon.species === 'Cradily'){
                   this.add('c|钱神花| 我就是传说中的钱神花');
                   this.add('c|*钱神花专属技能|God Leech:同时使用寄身种子和漩涡');
                   }
                   if (pokemon.species === 'Zygarde'){
                   this.add('c|*Zygarde专属特性|Super Effect:上场时将自己属性变为克制对方当前精灵的属性(有多个时，会随机变一个)');
                   }
                   if (pokemon.species === 'Pikachu'){
                   this.add('c|*皮神专属特性|So Cute:上场时两防+2');
                   }
                   if (pokemon.species === 'Ampharos-Mega'){
                   this.add('c|@电龙|我有退坑过吗?');
                   this.add('c|*退坑咩咩专属特性|I Quit:每回合结束自动使用退场台词，同时回复25%的HP');
                   }
                   },
                   onFaint: function (pokemon, source, effect) {
                   let name = toId(pokemon.name);
                   
                   if (name === 'innovamania') {
                   pokemon.side.addSideCondition('healingwish', pokemon, this);
                   }
                   // Add here salty tears, that is, custom faint phrases.
                   let sentences = [];
                   // This message is different from others, as it triggers when
                   // opponent faints
                   if (source && source.name === 'galbia') {
                   this.add('c|@galbia|literally 2HKOged');
                   }
                   // Actual faint phrases
                   if (name === 'acast') {
                   this.add('c|%Acast|If only I had more screens...');
                   }
                   if (name === 'ace') {
                   this.add('c|@Ace|inhale all of this');
                   }
                   if (name === 'aelita') {
                   this.add('c|%Aelita|CODE: LYOKO. Tower deactivated...');
                   }
                   if (name === 'ajhockeystar') {
                   this.add('c|+ajhockeystar|You may have beaten me in battle, but never in hockey.');
                   }
                   if (name === 'albacore') {
                   this.add('c|@Albacore|Joke\'s on you, I was just testing!');
                   }
                   if (name === 'albert') {
                   this.add("c|+Albert|You may be good looking, but you're not a piece of art.");
                   }
                   if (name === 'always') {
                   this.add('c|+Always|i swear to fucking god how can a single person be this lucky after getting played all the fucking way. you are a mere slave you glorified heap of trash.');
                   }
                   if (name === 'am') {
                   this.add('c|+AM|RIP');
                   }
                   if (name === 'andy') {
                   this.add('c|%AndrewGoncel|wow r00d! :c');
                   }
                   if (name === 'antemortem') {
                   this.add('c|&antemortem|FUCKING CAMPAIGNERS');
                   }
                   if (name === 'anttya') {
                   this.add('c|+Anttya|Can\'t beat hax ¯\\_(ツ)_/¯');
                   }
                   if (name === 'anty') {
                   this.add('c|+Anty|k');
                   }
                   if (name === 'articuno') {
                   this.add('c|%Articuno|This is why you don\'t get any girls.');
                   }
                   if (name === 'ascriptmaster') {
                   this.add('c|@Ascriptmaster|Farewell, my friends. May we meet another day...');
                   }
                   if (name === 'astara') {
                   sentences = ['/me twerks into oblivion', 'good night ♥', 'Astara Vista Baby'];
                   this.add('c|%Ast☆arA|' + sentences[this.random(3)]);
                   }
                   if (name === 'asty') {
                   this.add('c|@Asty|Bottom kek :^(');
                   }
                   if (name === 'atomicllamas') {
                   this.add('c|&atomicllamas|(puke)');
                   }
                   if (name === 'aurora') {
                   this.add('c|@Aurora|are you serious you\'re so bad oh my god haxed ughhhhh');
                   }
                   if (name === 'reisen') {
                   this.add("c|%Reisen|No need for goodbye. I'll see you on the flip side.");
                   }
                   if (name === 'beowulf') {
                   this.add('c|@Beowulf|There is no need to be mad');
                   }
                   if (name === 'biggie') {
                   sentences = ['It was all a dream', 'It\'s gotta be the shoes', 'ヽ༼ຈل͜ຈ༽ﾉ RIOT ヽ༼ຈل͜ຈ༽ﾉ'];
                   this.add('c|@biggie|' + sentences[this.random(3)]);
                   }
                   if (name === 'blastchance') {
                   this.add("c|+Blast Chance|**oh no!**");
                   }
                   if (name === 'blitzamirin') {
                   this.add('c|@Blitzamirin|The Mirror Can Lie It Doesn\'t Show What\'s Inside ╰( ~ ◕ ᗜ ◕ ~ )੭━☆ﾟ.*･｡ﾟ');
                   }
                   if (name === 'bludz') {
                   this.add('c|+bludz|zzz');
                   }
                   if (name === 'bondie') {
                   this.add('c|+Bondie|Sigh...');
                   }
                   if (name === 'bottt') {
                   this.add("c| boTTT|No longer being maintained...");
                   }
                   if (name === 'brandon') {
                   this.add("c|+Brrandon|Always leave the crowd wanting more~");
                   }
                   if (name === 'bumbadadabum') {
                   this.add("c|@bumbadadabum|Find another planet make the same mistakes.");
                   }
                   if (name === 'bummer') {
                   this.add('c|&Bummer|Thanks for considering me!');
                   }
                   if (name === 'chaos') {
                   this.add('c|~chaos|//forcewin chaos');
                   if (this.random(1000) === 420) {
                   // Shouldn't happen much, but if this happens it's hilarious.
                   this.add('c|~chaos|actually');
                   this.add('c|~chaos|//forcewin ' + pokemon.side.name);
                   this.win(pokemon.side);
                   }
                   }
                   if (name === 'ciran') {
                   this.add("c|+Ciran|Fun is still banned in the Wi-Fi room!");
                   }
                   if (name === 'clefairy') {
                   this.add('c|+Clefairy|flex&no flex zone nightcore remix dj clefairyfreak 2015');
                   }
                   if (name === 'coolstorybrobat') {
                   let sentence = [
                                   "Lol I got slayed", "BRUH!", "I tried", "Going back to those mountains to train brb", "I forgot what fruit had... tasted like...",
                                   ][this.random(5)];
                   this.add('c|@CoolStoryBrobat|' + sentence);
                   }
                   if (name === 'crestfall') {
                   this.add("c|%Crestfall|Her pistol go (bang bang, boom boom, pop pop)");
                   }
                   if (name === 'deathonwings') {
                   this.add('c|+Death on Wings|DEG\'s a nub');
                   }
                   if (name === 'dirpz') {
                   this.add('c|+Dirpz|sylveon is an eeeveeeeeeelutioooooon....');
                   }
                   if (name === 'dmt') {
                   this.add('c|+DMT|DMT');
                   }
                   if (name === 'dreameatergengar') {
                   this.add('c|+Dream Eater Gengar|In the darkness I fade. Remember ghosts don\'t die!');
                   }
                   if (name === 'duck') {
                   this.add('c|@Duck|Duck you!');
                   }
                   if (name === 'e4flint') {
                   this.add('c|#E4 Flint|+n1');
                   this.add('c|+sparkyboTTT|nice 1');
                   }
                   if (name === 'eeveegeneral') {
                   sentences = ["bye room, Electrolyte is in charge", "/me secretly cries", "inap!"];
                   this.add("c|~Eevee General|" + sentences[this.random(3)]);
                   }
                   if (name === 'eyan') {
                   this.add("c|@Eyan|;-;7");
                   }
                   if (name === 'feliburn') {
                   this.add('c|@Feliburn|gg la verga de tu madre');
                   }
                   if (name === 'fireburn') {
                   this.add('c|+Fireburn|>:Y');
                   }
                   if (name === 'flyingkebab') {
                   this.add("c|+Flying Kebab|" + ["I\'ll see you in hell!", "/me vanishes to the depths of hell"][this.random(2)]);
                   }
                   if (name === 'formerhope') {
                   this.add('c|@Former Hope|Now I have Former Hope.');
                   }
                   if (name === 'freeroamer') {
                   this.add('c|%Freeroamer|how do people get these matchups...');
                   }
                   if (name === 'frysinger') {
                   this.add("c|+Frysinger|/me teleports away from the battle and eats a senzu bean");
                   }
                   if (name === 'fx') {
                   this.add("c|+f(x)|mirror, mirror");
                   }
                   if (name === 'galbia') {
                   this.add('c|@galbia|(dog)');
                   }
                   if (name === 'galom') {
                   this.add('c|+Galom|GAME OVER.');
                   }
                   if (name === 'rodan') {
                   this.add("c|+RODAN|The Great Emeralds power allows me to feel... ");
                   }
                   if (name === 'geoffbruedly') {
                   this.add("c|%GeoffBruedly|IM SORRY WINRY");
                   }
                   if (name === 'giagantic') {
                   this.add("c|%Giagantic|x.x");
                   }
                   if (name === 'golui') {
                   this.add("c|+Golui|Freeze in hell");
                   }
                   if (name === 'goodmorningespeon') {
                   this.add("c|+GoodMorningEspeon|gg wp good hunt would scavenge again");
                   }
                   if (name === 'grimauxiliatrix') {
                   this.add("c|%grimAuxiliatrix|∠( ᐛ 」∠)_");
                   }
                   if (name === 'halite') {
                   this.add('c|@Halite|Today was your lucky day...');
                   }
                   if (name === 'hannah') {
                   this.add('c|+Hannahh|Nooo! ;~;');
                   }
                   if (name === 'hashtag') {
                   this.add("c|#Hashtag|fukn immigrants,,, slash me spits");
                   }
                   if (name === 'haund') {
                   this.add('c|%Haund|omg noob team report');
                   }
                   if (name === 'healndeal') {
                   this.add('c|+HeaLnDeaL|sadface I should have been a Sylveon');
                   }
                   if (name === 'himynamesl') {
                   this.add('c|@HiMyNamesL|hey ' + pokemon.side.name + ', get good');
                   }
                   if (name === 'hippopotas') {
                   this.add('-message', 'The sandstorm subsided.');
                   }
                   if (name === 'hollywood') {
                   this.add('c|+hollywood|BibleThump');
                   }
                   if (name === 'ih8ih8sn0w') {
                   this.add('c|+ih8ih8sn0w|nice hax :(');
                   }
                   if (name === 'imanalt') {
                   this.add('c|+imanalt|bshax imo');
                   }
                   if (name === 'imas234') {
                   this.add('c|@imas234|bg no re');
                   }
                   if (name === 'innovamania') {
                   sentences = ['Did you rage quit?', 'How\'d you lose with this set?'];
                   this.add('c|@innovamania|' + sentences[this.random(2)]);
                   }
                   if (name === 'iplaytennislol') {
                   this.add('c|%iplaytennislol|/me des');
                   }
                   if (name === 'iyarito') {
                   this.add('c|+Iyarito|Owwnn ;_;');
                   }
                   if (name === 'jackhiggins') {
                   this.add("c|+Jack Higgins|I blame HiMyNamesL");
                   }
                   if (name === 'jasmine') {
                   this.add("raw|<div class=\"broadcast-red\"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>");
                   }
                   if (name === 'jdarden') {
                   this.add('c|@jdarden|;-;7');
                   }
                   if (name === 'jetpack') {
                   this.add('c|+Jetpack|You shouldn\'t of done that. ;_;');
                   }
                   if (name === 'joim') {
                   sentences = ['AVENGE ME, KIDS! AVEEEENGEEE MEEEEEE!!', 'OBEY!', '``This was a triumph, I\'m making a note here: HUGE SUCCESS.``', '``Remember when you tried to kill me twice? Oh how we laughed and laughed! Except I wasn\'t laughing.``', '``I\'m not even angry, I\'m being so sincere right now, even though you broke my heart and killed me. And tore me to pieces. And threw every piece into a fire.``'];
                   this.add('c|~Joim|' + sentences[this.random(4)]);
                   }
                   if (name === 'juanma') {
                   this.add("c|+Juanma|I guess you were right, now you must be the happiest person in the world, " + pokemon.side.name + "! You get to be major of 'I-told-you-so' town!");
                   }
                   if (name === 'kalalokki') {
                   this.add('c|+Kalalokki|(⌐■_■)');
                   this.add('c|+Kalalokki|( •_•)>⌐■-■');
                   this.add('c|+Kalalokki|(x_x)');
                   }
                   if (name === 'kidwizard') {
                   this.add('c|+Kid Wizard|Go to hell.');
                   }
                   if (name === 'layell') {
                   this.add('c|@Layell|' + ['Alas poor me', 'Goodnight sweet prince'][this.random(2)]);
                   }
                   if (name === 'legitimateusername') {
                   this.add('c|@LegitimateUsername|``This isn\'t brave. It\'s murder. What did I ever do to you?``');
                   }
                   if (name === 'lemonade') {
                   this.add('c|+Lemonade|Pasta');
                   }
                   if (name === 'level51') {
                   this.add('c|@Level 51|u_u!');
                   }
                   if (name === 'lj') {
                   this.add('c|%LJDarkrai|.Blast');
                   }
                   if (name === 'lyto') {
                   this.add('c|@Lyto|' + ['Unacceptable!', 'Mrgrgrgrgr...'][this.random(2)]);
                   }
                   if (name === 'macle') {
                   this.add("c|+macle|Follow the Frog Blog - http://gonefroggin.wordpress.com/");
                   }
                   if (name === 'manu11') {
                   this.add("c|@manu 11|so much hax, why do I even try");
                   }
                   if (name === 'marshmallon') {
                   this.add("c|%Marshmallon|Shoutouts to sombolo and Rory Mercury ... for this trash set -_-");
                   }
                   if (name === 'mattl') {
                   this.add('c|+MattL|Forgive me. I feel it again... the call from the light.');
                   }
                   if (name === 'mcmeghan') {
                   this.add("c|&McMeghan|Out-odded");
                   }
                   if (name === 'megazard') {
                   this.add('c|+Megazard|Old dog');
                   }
                   if (name === 'mizuhime') {
                   this.add('c|+Mizuhime|I got Gimped.');
                   }
                   if (name === 'nv') {
                   this.add('c|+nv|Too cute for this game ;~;');
                   }
                   if (name === 'omegaxis') {
                   this.add('c|+Omega-Xis|bull shit bull sHit thats ✖️ some bullshit rightth ere right✖️there ✖️✖️if i do ƽaү so my selｆ ‼️ i say so ‼️ thats what im talking about right there right there (chorus: ʳᶦᵍʰᵗ ᵗʰᵉʳᵉ) mMMMMᎷМ‼️ HO0ОଠＯOOＯOОଠଠOoooᵒᵒᵒᵒᵒᵒᵒᵒᵒ ‼️ Bull shit');
                   }
                   if (name === 'orday') {
                   this.add('c|%Orda-Y|❄_❄');
                   }
                   if (name === 'overneat') {
                   this.add('c|+Overneat|Ugh! I failed you Iya-sama');
                   }
                   if (name === 'paradise') {
                   this.add('c|%Paradise~|RIP THE DREAM');
                   }
                   if (name === 'pikachuun') {
                   sentences = ['press f to pay respects ;_;7', 'this wouldn\'t have happened in my version', 'wait we were battling?'];
                   this.add('c|+Pikachuun|' + sentences[this.random(3)]);
                   }
                   if (name === 'pluviometer') {
                   this.add('c|+pluviometer|GP 2/2');
                   }
                   if (name === 'qtrx') {
                   sentences = ['Keyboard not found; press **Ctrl + W** to continue...', 'hfowurfbiEU;DHBRFEr92he', 'At least my name ain\'t asgdf...'];
                   this.add('c|@qtrx|' + sentences[this.random(3)]);
                   }
                   if (name === 'quitequiet') {
                   this.add('c|@Quite Quiet|Well, I tried at least.');
                   }
                   if (name === 'raseri') {
                   this.add('c|&Raseri|you killed a mush :(');
                   }
                   if (name === 'raven') {
                   this.add('c|&Raven|I failed the challenge, and for that, I must lose a life. At least I had one to lose in the first place, nerd.');
                   }
                   if (name === 'rekeri') {
                   this.add('c|@rekeri|lucky af :[');
                   }
                   if (name === 'rssp1') {
                   this.add('c|+rssp1|Witness the power of the almighty Rufflet!');
                   }
                   if (name === 'rosiethevenusaur') {
                   this.add('c|@RosieTheVenusaur|' + ['SD SKARM SHALL LIVE AGAIN!!!', 'Not my WiFi!'][this.random(2)]);
                   }
                   if (name === 'sailorcosmos') {
                   this.add("c|+SailorCosmos|Cosmos Gorgeous Retreat!");
                   }
                   if (name === 'scotteh') {
                   this.add('c|&Scotteh|▄███████▄.▲.▲.▲.▲.▲.▲');
                   this.add('c|&Scotteh|█████████████████████▀▀');
                   }
                   if (name === 'scpinion') {
                   this.add("c|@scpinion|guys, I don't even know how to pronounce scpinion");
                   }
                   if (name === 'scythernoswiping') {
                   this.add('c|%Scyther NO Swiping|Aww man!');
                   }
                   if (name === 'shrang') {
                   this.add('c|@shrang|FUCKING 2 YO KID');
                   }
                   if (name === 'sigilyph') {
                   this.add('c|@Sigilyph|FROM THE BACK FROM THE BACK FROM THE BACK FROM THE BACK **ANDD**');
                   }
                   if (name === 'sirdonovan') {
                   this.add('-message', 'RIP sirDonovan');
                   }
                   if (name === 'skitty') {
                   this.add('c|@Skitty|!learn skitty, roleplay');
                   this.add('raw|<div class="infobox">In Gen 6, Skitty <span class="message-learn-cannotlearn">can\'t</span> learn Role Play</div>');
                   }
                   if (name === 'solarisfox') {
                   this.add('c|%SolarisFox|So long, and thanks for all the fish.');
                   }
                   if (name === 'sonired') {
                   this.add('c|+Sonired|sigh lucky players.');
                   }
                   if (name === 'sparktrain') {
                   this.add('c|+sparktrain|nice');
                   }
                   if (name === 'spy') {
                   sentences = ['lolhax', 'crit mattered', 'bruh cum @ meh', '>thinking Pokemon takes any skill'];
                   this.add('c|+Spy|' + sentences[this.random(4)]);
                   }
                   if (name === 'snobalt') {
                   this.add('c|+Snobalt|Blasphemy!');
                   }
                   if (name === 'snowy') {
                   this.add('c|+Snowy|i never understood this i always hear them be like "yo whats up monica" "u tryna blaze monica"');
                   }
                   if (name === 'spacebass') {
                   this.add('c|@SpaceBass|And the tales of whales and woe off his liquored toungue will flow, the light will soft white twinkle off the cataracts in his eye');
                   this.add("c|@SpaceBass|So if by chance you're cornered near the bathroom, or he blocks you sprawled in his aisle seat");
                   this.add("c|@SpaceBass|Embrace the chance to hear some tales of greatness, 'cause he's the most interesting ball of toxins you're ever apt to meet");
                   }
                   if (name === 'specsmegabeedrill') {
                   this.add('c|+SpecsMegaBeedrill|Tryhard.');
                   }
                   if (name === 'starmei') {
                   this.add('c|+Starmei|//message AM, must be nice being this lucky');
                   }
                   if (name === 'starry') {
                   this.add('c|%starry|o-oh');
                   }
                   if (name === 'steamroll') {
                   this.add('c|@Steamroll|Not my problem anymore!');
                   }
                   if (name === 'sunfished') {
                   this.add('c|+Sunfished|*raptor screeches*');
                   }
                   if (name === 'sweep') {
                   this.add('c|&Sweep|You offended :C');
                   }
                   if (name === 'talkingtree') {
                   this.add('c|+talkingtree|I am Groot u_u');
                   }
                   if (name === 'teg') {
                   sentences = ['Save me, Joim!', 'Arcticblast is the worst OM leader in history'];
                   this.add('c|+TEG|' + sentences[this.random(2)]);
                   }
                   if (name === 'temporaryanonymous') {
                   sentences = [';_;7', 'This kills the tempo', 'I\'m kill. rip.', 'S-senpai! Y-you\'re being too rough! >.<;;;;;;;;;;;;;;;;;', 'A-at least you checked my dubs right?', 'B-but that\'s impossible! This can\'t be! AAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHHHHHHHHHHHHHGH'];
                   this.add('c|@Temporaryanonymous|' + sentences[this.random(6)]);
                   }
                   if (name === 'teremiare') {
                   this.add('c|%Teremiare|sigh...');
                   }
                   if (name === 'theimmortal') {
                   this.add('c|~The Immortal|Oh how wrong we were to think immortality meant never dying.');
                   }
                   if (name === 'tone114') {
                   this.add('c|+TONE114|I don\'t have to take this. I\'m going for a walk.');
                   }
                   if (name === 'trickster') {
                   this.add('c|@Trickster|UPLOADING VIRUS.EXE \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588] 99% COMPLETE');
                   }
                   if (name === 'unfixable') {
                   this.add('c|+unfixable|i may be dead but my eyebrows are better than yours will ever be');
                   }
                   if (name === 'urkerab') {
                   this.add('l|urkerab');
                   }
                   if (name === 'uselesstrainer') {
                   sentences = ['TIME TO SET UP', 'One day I\'ll become a beautiful butterfly'];
                   this.add('c|@useless trainer|' + sentences[this.random(2)]);
                   }
                   if (name === 'vapo') {
                   this.add('c|%Vapo|( ; _> ;)');
                   }
                   if (name === 'vexeniv') {
                   this.add('c|+Vexen IV|brb burning my dread');
                   }
                   if (name === 'winry') {
                   this.add('c|@Winry|I AM NOT A WEEB');
                   }
                   if (name === 'xfix') {
                   const foe = pokemon.side.foe.active[0];
                   if (foe.name === 'xfix') {
                   this.add("c|+xfix|(I won. I lost. I... huh... ~~can somebody tell me what actually happened?~~)");
                   } else if (foe.ability === 'magicbounce') {
                   this.add('c|+xfix|(How do mirrors work... oh right, when you use a mirror, your opponent has a mirror as well... or something, ~~that\'s how you "balance" this game~~)');
                   } else {
                   this.add('c|+xfix|~~That must have been a glitch. Hackers.~~');
                   }
                   }
                   if (name === 'xjoelituh') {
                   this.add("c|%xJoelituh|THAT FOR SURE MATTERED. Blame Nayuki. I'm going to play CSGO then.");
                   }
                   if (name === 'xshiba') {
                   this.add("c|+xShiba|Lol that feeling when you just win but get haxed..");
                   }
                   if (name === 'zarel') {
                   this.add('c|~Zarel|your mom');
                   // Followed by the usual '~Zarel fainted'.
                   this.add('-message', '~Zarel used your mom!');
                   }
                   if (name === 'zebraiken') {
                   if (pokemon.phraseIndex === 2) {
                   this.add('c|&Zebraiken|bzzt u_u');
                   } else if (pokemon.phraseIndex === 1) {
                   this.add('c|&Zebraiken|bzzt ._.');
                   } else {
                   // Default faint.
                   this.add('c|&Zebraiken|bzzt x_x');
                   }
                   }
                   if (name === 'zeroluxgiven') {
                   this.add('c|%Zero Lux Given|I\'ve been beaten, what a shock!');
                   }
                   if (name === 'zodiax') {
                   this.add('c|%Zodiax|We need to go full out again soon...');
                   }
                   },
                   // Special switch-out events for some mons.
                   onSwitchOut: function (pokemon) {
                   let name = toId(pokemon.name);
                   
                   if (!pokemon.illusion) {
                   if (name === 'hippopotas') {
                   this.add('-message', 'The sandstorm subsided.');
                   }
                   }
                   
                   // Transform
                   if (pokemon.originalName) pokemon.name = pokemon.originalName;
                   },
                   onModifyPokemon: function (pokemon) {
                   let name = toId(pokemon.name);
                   // Enforce choice item locking on custom moves.
                   // qtrx only has one move anyway.
                   if (name !== 'qtrx') {
                   let moves = pokemon.moveset;
                   if (pokemon.getItem().isChoice && pokemon.lastMove === moves[3].id) {
                   for (let i = 0; i < 3; i++) {
                   if (!moves[i].disabled) {
                   pokemon.disableMove(moves[i].id, false);
                   moves[i].disabled = true;
                   }
                   }
                   }
                   }
                   },
                   // Specific residual events for custom moves.
                   // This allows the format to have kind of custom side effects and volatiles.
                   onResidual: function (battle) {
                   // Deal with swapping from qtrx's mega signature move.
                   let swapmon1, swapmon2;
                   let swapped = false;
                   for (let i = 1; i < 6 && !swapped; i++) {
                   swapmon1 = battle.sides[0].pokemon[i];
                   if (swapmon1.swapping && swapmon1.hp > 0) {
                   swapmon1.swapping = false;
                   for (let j = 1; j < 6; j++) {
                   swapmon2 = battle.sides[1].pokemon[j];
                   if (swapmon2.swapping && swapmon2.hp > 0) {
                   swapmon2.swapping = false;
                   
                   this.add('message', "Link standby... Please wait.");
                   swapmon1.side = battle.sides[1];
                   swapmon1.fullname = swapmon1.side.id + ': ' + swapmon1.name;
                   swapmon1.id = swapmon1.fullname;
                   swapmon2.side = battle.sides[0];
                   swapmon2.fullname = swapmon2.side.id + ': ' + swapmon2.name;
                   swapmon2.id = swapmon2.fullname;
                   let oldpos = swapmon1.position;
                   swapmon1.position = swapmon2.position;
                   swapmon2.position = oldpos;
                   battle.sides[0].pokemon[i] = swapmon2;
                   battle.sides[1].pokemon[j] = swapmon1;
                   
                   this.add("c|\u2605" + swapmon1.side.name + "|Bye-bye, " + swapmon2.name + "!");
                   this.add("c|\u2605" + swapmon2.side.name + "|Bye-bye, " + swapmon1.name + "!");
                   if (swapmon1.side.active[0].hp && swapmon2.side.active[0].hp) {
                   this.add('-anim', swapmon1.side.active, "Healing Wish", swapmon1.side.active);
                   this.add('-anim', swapmon2.side.active, "Aura Sphere", swapmon2.side.active);
                   this.add('message', swapmon2.side.name + " received " + swapmon2.name + "! Take good care of " + swapmon2.name + "!");
                   this.add('-anim', swapmon2.side.active, "Healing Wish", swapmon2.side.active);
                   this.add('-anim', swapmon1.side.active, "Aura Sphere", swapmon1.side.active);
                   this.add('message', swapmon1.side.name + " received " + swapmon1.name + "! Take good care of " + swapmon1.name + "!");
                   } else {
                   this.add('message', swapmon2.side.name + " received " + swapmon2.name + "! Take good care of " + swapmon2.name + "!");
                   this.add('message', swapmon1.side.name + " received " + swapmon1.name + "! Take good care of " + swapmon1.name + "!");
                   }
                   swapped = true;
                   break;
                   }
                   }
                }
            }
        },
    },
    // Randomized Metas
	///////////////////////////////////////////////////////////////////

	{
		section: "Randomized Metas",
		column: 2,
	},
	{
		name: "[Gen 6] Battle Factory",

		mod: 'gen6',
		team: 'randomFactory',
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod', 'Mega Rayquaza Clause'],
	},
	{
		name: "[Gen 7] BSS Factory",
		desc: [
			"Randomised 3v3 Singles featuring Pok&eacute;mon and movesets popular in Battle Spot Singles.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3604845/\">Information and Suggestions Thread</a>",
		],

		mod: 'gen7',
		team: 'randomBSSFactory',
		teamLength: {
			validate: [3, 6],
			battle: 3,
		},
		ruleset: ['Pokemon', 'Standard GBU'],
	},
	{
		name: "[Gen 7] Monotype Random Battle",

		mod: 'gen7',
		team: 'random',
		searchShow: false,
		ruleset: ['Pokemon', 'Same Type Clause', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Challenge Cup 1v1",

		mod: 'gen7',
		team: 'randomCC',
		teamLength: {
			battle: 1,
		},
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
	},
	{
		name: "[Gen 7] Challenge Cup 2v2",

		mod: 'gen7',
		team: 'randomCC',
		gameType: 'doubles',
		teamLength: {
			battle: 2,
		},
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod', 'Team Preview'],
	},
	{
		name: "[Gen 7] Hackmons Cup",
		desc: ["Randomized teams of level-balanced Pok&eacute;mon with absolutely any ability, moves, and item."],

		mod: 'gen7',
		team: 'randomHC',
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 7] Doubles Hackmons Cup",

		mod: 'gen7',
		gameType: 'doubles',
		team: 'randomHC',
		searchShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 6] Random Battle",

		mod: 'gen6',
		team: 'random',
		ruleset: ['PotD', 'Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 5] Random Battle",

		mod: 'gen5',
		team: 'random',
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 4] Random Battle",

		mod: 'gen4',
		team: 'random',
		ruleset: ['Pokemon', 'Sleep Clause Mod', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 3] Random Battle",

		mod: 'gen3',
		team: 'random',
		ruleset: ['Pokemon', 'Standard'],
	},
	{
		name: "[Gen 2] Random Battle",

		mod: 'gen2',
		team: 'random',
		ruleset: ['Pokemon', 'Standard'],
	},
	{
		name: "[Gen 1] Random Battle",

		mod: 'gen1',
		team: 'random',
		ruleset: ['Pokemon', 'Standard'],
	},
	{
		name: "[Gen 1] Challenge Cup",

		mod: 'gen1',
		team: 'randomCC',
		searchShow: false,
		challengeShow: false,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},

	// RoA Spotlight
	///////////////////////////////////////////////////////////////////

	{
		section: "RoA Spotlight",
		column: 3,
	},
	{
		name: "[Gen 2] UU",
		desc: ["&bullet; <a href=\"http://www.smogon.com/forums/threads/3576710/\">GSC UU Discussion</a>"],

		mod: 'gen2',
		ruleset: ['[Gen 2] OU'],
		banlist: ['OU', 'BL'],
	},
	{
		name: "[Gen 5] RU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3473124/\">BW2 RU Viability Ranking</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/6431094/\">BW2 Sample Teams</a>",
		],

		mod: 'gen5',
		// searchShow: false,
		ruleset: ['[Gen 5] UU'],
		banlist: ['UU', 'BL2', 'Shell Smash + Baton Pass', 'Snow Warning'],
	},
	{
		name: "[Gen 1] STABmons",
		desc: [
			"Pok&eacute;mon can use any move of their typing, in addition to the moves they can normally learn.",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3587949/\">STABmons</a>",
		],

		mod: 'gen1',
		ruleset: ['[Gen 1] OU', 'Ignore STAB Moves'],
		banlist: [],
	},

	// Past Gens OU
	///////////////////////////////////////////////////////////////////

	{
		section: "Past Gens OU",
		column: 3,
	},
	{
		name: "[Gen 6] OU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/dex/xy/tags/ou/\">ORAS OU Banlist</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3596900/\">ORAS OU Viability Rankings</a>",
		],

		mod: 'gen6',
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Swagger Clause', 'Baton Pass Clause'],
		banlist: ['Uber', 'Arena Trap', 'Shadow Tag', 'Soul Dew'],
	},
	{
		name: "[Gen 5] OU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3599678/\">BW2 OU Viability Ranking</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/6431094/\">BW2 Sample Teams</a>",
		],

		mod: 'gen5',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Baton Pass Clause', 'Swagger Clause', 'Team Preview'],
		banlist: ['Uber', 'Drizzle ++ Swift Swim', 'Drought ++ Chlorophyll', 'Sand Stream ++ Sand Rush', 'Soul Dew'],
	},
	{
		name: "[Gen 4] OU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3506147/\">DPP OU Metagame Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3551992/\">DPP OU Viability Ranking</a>",
		],

		mod: 'gen4',
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause'],
		banlist: ['Uber'],
	},
	{
		name: "[Gen 3] OU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3503019/\">ADV OU Viability Ranking</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/6431087/\">ADV Sample Teams</a>",
		],

		mod: 'gen3',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber', 'Smeargle + Ingrain'],
	},
	{
		name: "[Gen 2] OU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3556533/\">GSC OU Viability Ranking</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/6431086/\">GSC Sample Teams</a>",
		],

		mod: 'gen2',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber'],
	},
	{
		name: "[Gen 2] OU PO",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3556533/\">GSC OU Viability Ranking</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/6431086/\">GSC Sample Teams</a>",
		],

		mod: 'gen2',
		ruleset: ['Pokemon', 'StandardPO'],
		banlist: ['Uber'],
	},
	{
		name: "[Gen 1] OU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3572352/\">RBY OU Viability Ranking</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/6431045/\">RBY Sample Teams</a>",
		],

		mod: 'gen1',
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber'],
	},

	// OR/AS Singles
	///////////////////////////////////////////////////////////////////

	{
		section: "OR/AS Singles",
		column: 3,
	},
	{
		name: "[Gen 6] Ubers",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3522911/\">ORAS Ubers</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3535106/\">ORAS Ubers Viability Rankings</a>",
		],

		mod: 'gen6',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Team Preview', 'Mega Rayquaza Clause'],
	},
	{
		name: "[Gen 6] UU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/dex/xy/tags/uu/\">ORAS UU Banlist</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3598164/\">ORAS UU Viability Rankings</a>",
		],

		mod: 'gen6',
		searchShow: false,
		ruleset: ['[Gen 6] OU'],
		banlist: ['OU', 'BL', 'Drizzle', 'Drought', 'Baton Pass'],
	},
	{
		name: "[Gen 6] RU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/dex/xy/tags/ru/\">ORAS RU Banlist</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3574583/\">ORAS RU Viability Rankings</a>",
		],

		mod: 'gen6',
		searchShow: false,
		ruleset: ['[Gen 6] UU'],
		banlist: ['UU', 'BL2'],
	},
	{
		name: "[Gen 6] NU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/dex/xy/tags/nu/\">ORAS NU Banlist</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3555650/\">ORAS NU Viability Rankings</a>",
		],

		mod: 'gen6',
		searchShow: false,
		ruleset: ['[Gen 6] RU'],
		banlist: ['RU', 'BL3'],
	},
	{
		name: "[Gen 6] PU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/dex/xy/tags/pu/\">ORAS PU Banlist</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3528743/\">ORAS PU Viability Rankings</a>",
		],

		mod: 'gen6',
		searchShow: false,
		ruleset: ['[Gen 6] NU'],
		banlist: ['NU', 'BL4', 'Chatter'],
		unbanlist: ['Baton Pass'],
	},
	{
		name: "[Gen 6] LC",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/dex/xy/formats/lc/\">ORAS LC Banlist</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3547566/\">ORAS LC Viability Rankings</a>",
		],

		mod: 'gen6',
		searchShow: false,
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['LC Uber', 'Gligar', 'Misdreavus', 'Scyther', 'Sneasel', 'Tangela', 'Dragon Rage', 'Sonic Boom', 'Swagger'],
	},
	{
		name: "[Gen 6] Monotype",
		desc: ["&bullet; <a href=\"http://www.smogon.com/forums/posts/7421332/\">ORAS Monotype</a>"],

		mod: 'gen6',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Swagger Clause', 'Same Type Clause', 'Team Preview'],
		banlist: [
			'Aegislash', 'Altaria-Mega', 'Arceus', 'Blaziken', 'Charizard-Mega-X', 'Darkrai', 'Deoxys-Base', 'Deoxys-Attack', 'Dialga', 'Genesect', 'Gengar-Mega',
			'Giratina', 'Greninja', 'Groudon', 'Ho-Oh', 'Kangaskhan-Mega', 'Kyogre', 'Kyurem-White', 'Lucario-Mega', 'Lugia', 'Mawile-Mega', 'Metagross-Mega',
			'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Sableye-Mega', 'Salamence-Mega', 'Shaymin-Sky', 'Slowbro-Mega', 'Talonflame', 'Xerneas', 'Yveltal', 'Zekrom',
			'Smooth Rock', 'Soul Dew',
		],
	},
	{
		name: "[Gen 6] Anything Goes",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3523229/\">ORAS Anything Goes</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3548945/\">ORAS AG Resources</a>",
		],

		mod: 'gen6',
		searchShow: false,
		ruleset: ['Pokemon', 'Endless Battle Clause', 'Team Preview', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Illegal', 'Unreleased'],
	},
	{
		name: "[Gen 6] CAP",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3537407/\">ORAS CAP Metagame Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3545628/\">ORAS CAP Viability Rankings</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/5594694/\">ORAS CAP Sample Teams</a>",
		],

		mod: 'gen6',
		searchShow: false,
		ruleset: ['[Gen 6] OU', 'Allow CAP'],
	},
	{
		name: "[Gen 6] Battle Spot Singles",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3527960/\">ORAS Battle Spot Singles</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3554616/\">ORAS BSS Viability Rankings</a>",
		],

		mod: 'gen6',
		searchShow: false,
		maxForcedLevel: 50,
		teamLength: {
			validate: [3, 6],
			battle: 3,
		},
		ruleset: ['Pokemon', 'Standard GBU'],
		requirePentagon: true,
	},
	{
		name: "[Gen 6] Custom Game",

		mod: 'gen6',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

	// OR/AS Doubles/Triples
	///////////////////////////////////////////////////////////////////

	{
		section: "OR/AS Doubles/Triples",
	},
	{
		name: "[Gen 6] Doubles OU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3498688/\">ORAS Doubles OU Banlist</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3535930/\">ORAS Doubles OU Viability Rankings</a>",
		],

		mod: 'gen6',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard Doubles', 'Swagger Clause', 'Team Preview'],
		banlist: [
			'Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Lugia', 'Mewtwo',
			'Palkia', 'Rayquaza', 'Reshiram', 'Salamence-Mega', 'Shaymin-Sky', 'Xerneas', 'Yveltal', 'Zekrom',
			'Soul Dew', 'Dark Void', 'Gravity ++ Grass Whistle', 'Gravity ++ Hypnosis', 'Gravity ++ Lovely Kiss', 'Gravity ++ Sing', 'Gravity ++ Sleep Powder',
		],
	},
	{
		name: "[Gen 6] VGC 2016",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3558332/\">VGC 2016 Rules</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3580592/\">VGC 2016 Viability Rankings</a>",
		],

		mod: 'gen6',
		gameType: 'doubles',
		searchShow: false,
		maxForcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		ruleset: ['Pokemon', 'Species Clause', 'Nickname Clause', 'Item Clause', 'Team Preview', 'Cancel Mod'],
		banlist: [
			'Illegal', 'Unreleased', 'Mew', 'Celebi', 'Jirachi', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Phione', 'Manaphy', 'Darkrai',
			'Shaymin', 'Shaymin-Sky', 'Arceus', 'Victini', 'Keldeo', 'Meloetta', 'Genesect', 'Diancie', 'Hoopa', 'Hoopa-Unbound', 'Volcanion', 'Soul Dew',
		],
		requirePentagon: true,
		onValidateTeam: function (team) {
			const legends = ['Mewtwo', 'Lugia', 'Ho-Oh', 'Kyogre', 'Groudon', 'Rayquaza', 'Dialga', 'Palkia', 'Giratina', 'Reshiram', 'Zekrom', 'Kyurem', 'Xerneas', 'Yveltal', 'Zygarde'];
			let n = 0;
			for (const set of team) {
				let baseSpecies = this.getTemplate(set.species).baseSpecies;
				if (legends.includes(baseSpecies)) n++;
				if (n > 2) return ["You can only use up to two legendary Pok\u00E9mon."];
			}
		},
	},
	{
		name: "[Gen 6] Battle Spot Doubles",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3560820/\">ORAS Battle Spot Doubles Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3560824/\">ORAS BSD Viability Rankings</a>",
		],

		mod: 'gen6',
		gameType: 'doubles',
		searchShow: false,
		maxForcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		ruleset: ['Pokemon', 'Standard GBU'],
		requirePentagon: true,
	},
	{
		name: "[Gen 6] Doubles Custom Game",

		mod: 'gen6',
		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		maxLevel: 9999,
		defaultLevel: 100,
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},
	{
		name: "[Gen 6] Battle Spot Triples",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3533914/\">ORAS Battle Spot Triples Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3549201/\">ORAS BST Viability Rankings</a>",
		],

		mod: 'gen6',
		gameType: 'triples',
		searchShow: false,
		maxForcedLevel: 50,
		teamLength: {
			validate: [6, 6],
		},
		ruleset: ['Pokemon', 'Standard GBU'],
		requirePentagon: true,
	},
	{
		name: "[Gen 6] Triples Custom Game",

		mod: 'gen6',
		gameType: 'triples',
		searchShow: false,
		canUseRandomTeam: true,
		maxLevel: 9999,
		defaultLevel: 100,
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

	// B2/W2 Singles
	///////////////////////////////////////////////////////////////////

	{
		section: "B2/W2 Singles",
		column: 4,
	},
	{
		name: "[Gen 5] Ubers",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3550881/\">BW2 Ubers Viability Ranking</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/6446463/\">BW2 Ubers Sample Teams</a>",
		],

		mod: 'gen5',
		searchShow: false,
		ruleset: ['Pokemon', 'Team Preview', 'Standard Ubers'],
	},
	{
		name: "[Gen 5] UU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3474024/\">BW2 UU Viability Ranking</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/6431094/\">BW2 Sample Teams</a>",
		],

		mod: 'gen5',
		searchShow: false,
		ruleset: ['[Gen 5] OU'],
		banlist: ['OU', 'BL', 'Drought', 'Sand Stream', 'Snow Warning'],
	},
	{
		name: "[Gen 5] NU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3484121/\">BW2 NU Viability Ranking</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/6431094/\">BW2 Sample Teams</a>",
		],

		mod: 'gen5',
		searchShow: false,
		ruleset: ['[Gen 5] RU'],
		banlist: ['RU', 'BL3', 'Prankster + Assist'],
	},
	{
		name: "[Gen 5] LC",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3485860/\">BW2 LC Viability Ranking</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/6431094/\">BW2 Sample Teams</a>",
		],

		mod: 'gen5',
		searchShow: false,
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Team Preview', 'Little Cup'],
		banlist: ['Berry Juice', 'Soul Dew', 'Dragon Rage', 'Sonic Boom', 'LC Uber', 'Gligar', 'Murkrow', 'Scyther', 'Sneasel', 'Tangela'],
	},
	{
		name: "[Gen 5] GBU Singles",

		mod: 'gen5',
		searchShow: false,
		maxForcedLevel: 50,
		teamLength: {
			validate: [3, 6],
			battle: 3,
		},
		ruleset: ['Pokemon', 'Standard GBU'],
		banlist: ['Dark Void', 'Sky Drop'],
	},
	{
		name: "[Gen 5] Custom Game",

		mod: 'gen5',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

	// B2/W2 Doubles
	///////////////////////////////////////////////////////////////////

	{
		section: 'B2/W2 Doubles',
		column: 4,
	},
	{
		name: "[Gen 5] Doubles OU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3533424/\">BW2 Doubles Metagame Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3533421/\">BW2 Doubles Viability Ranking</a>",
		],

		mod: 'gen5',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Evasion Abilities Clause', 'Swagger Clause', 'Team Preview'],
		banlist: [
			'Arceus', 'Dialga', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Kyogre', 'Kyurem-White', 'Jirachi',
			'Lugia', 'Mewtwo', 'Palkia', 'Rayquaza', 'Reshiram', 'Zekrom', 'Soul Dew', 'Dark Void', 'Sky Drop',
		],
	},
	{
		name: "[Gen 5] GBU Doubles",

		mod: 'gen5',
		gameType: 'doubles',
		searchShow: false,
		maxForcedLevel: 50,
		teamLength: {
			validate: [4, 6],
			battle: 4,
		},
		ruleset: ['Pokemon', 'Standard GBU'],
		banlist: ['Dark Void', 'Sky Drop'],
	},
	{
		name: "[Gen 5] Doubles Custom Game",

		mod: 'gen5',
		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod'],
	},

	// DPP Singles
	///////////////////////////////////////////////////////////////////

	{
		section: "DPP Singles",
		column: 4,
	},
	{
		name: "[Gen 4] Ubers",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/7433831/\">DPP Ubers Information &amp; Resources</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3505128/\">DPP Ubers Viability Ranking</a>",
		],

		mod: 'gen4',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Arceus'],
	},
	{
		name: "[Gen 4] UU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3532624/\">DPP UU Metagame Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3503638/\">DPP UU Viability Ranking</a>",
		],

		mod: 'gen4',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber', 'OU', 'BL'],
	},
	{
		name: "[Gen 4] NU",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3583742/\">DPP NU Metagame Discussion</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/3512254/\">DPP NU Viability Ranking</a>",
		],

		mod: 'gen4',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Uber', 'OU', 'BL', 'UU', 'BL2'],
	},
	{
		name: "[Gen 4] LC",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/dp/articles/little_cup_guide\">DPP LC Guide</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/7336500/\">DPP LC Viability Ranking</a>",
		],

		mod: 'gen4',
		searchShow: false,
		maxLevel: 5,
		ruleset: ['Pokemon', 'Standard', 'Little Cup'],
		banlist: ['LC Uber', 'Misdreavus', 'Murkrow', 'Scyther', 'Sneasel', 'Tangela', 'Yanma', 'Berry Juice', 'Deep Sea Tooth', 'Dragon Rage', 'Sonic Boom'],
	},
	{
		name: "[Gen 4] Custom Game",

		mod: 'gen4',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions
		ruleset: ['Cancel Mod'],
	},

	// DPP Doubles
	///////////////////////////////////////////////////////////////////

	{
		section: "DPP Doubles",
		column: 4,
	},
	{
		name: "[Gen 4] Doubles OU",
		desc: ["&bullet; <a href=\"http://www.smogon.com/forums/threads/3618411/\">DPP Doubles</a>"],

		mod: 'gen4',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['[Gen 4] OU'],
		banlist: ['Explosion', 'Soul Dew'],
		unbanlist: ['Garchomp', 'Latias', 'Latios', 'Manaphy', 'Mew', 'Salamence', 'Wobbuffet', 'Wynaut'],
	},
	{
		name: "[Gen 4] Doubles Custom Game",

		mod: 'gen4',
		gameType: 'doubles',
		searchShow: false,
		canUseRandomTeam: true,
		debug: true,
		maxLevel: 9999,
		defaultLevel: 100,
		// no restrictions
		ruleset: ['Cancel Mod'],
	},

	// Past Generations
	///////////////////////////////////////////////////////////////////

	{
		section: "Past Generations",
		column: 4,
	},
	{
		name: "[Gen 3] Ubers",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/7433832/\">ADV Ubers Information &amp; Resources</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3536426/\">ADV Ubers Viability Ranking</a>",
		],

		mod: 'gen3',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
		banlist: ['Wobbuffet + Leftovers'],
	},
	{
		name: "[Gen 3] Custom Game",

		mod: 'gen3',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 3] Doubles Custom Game",

		mod: 'gen3',
		gameType: 'doubles',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 2] Ubers",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/7433879/\">GSC Ubers Information &amp; Resources</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/6431086/\">GSC Sample Teams</a>",
		],

		mod: 'gen2',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
	},
	{
		name: "[Gen 2] Custom Game",

		mod: 'gen2',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
	{
		name: "[Gen 1] Ubers",
		desc: [
			"&bullet; <a href=\"http://www.smogon.com/forums/threads/3541329/\">RBY Ubers Viability Ranking</a>",
			"&bullet; <a href=\"http://www.smogon.com/forums/posts/6431045/\">RBY Sample Teams</a>",
		],

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard'],
	},
	{
		name: "[Gen 1] OU (tradeback)",

		mod: 'gen1',
		searchShow: false,
		ruleset: ['Pokemon', 'Allow Tradeback', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Uber', 'Unreleased', 'Illegal',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember',
		],
	},
	{
		name: "[Gen 1] Stadium",

		mod: 'stadium',
		searchShow: false,
		ruleset: ['Pokemon', 'Standard', 'Team Preview'],
		banlist: ['Uber',
			'Nidoking + Fury Attack + Thrash', 'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp',
			'Exeggutor + Stun Spore + Stomp', 'Jolteon + Focus Energy + Thunder Shock', 'Flareon + Focus Energy + Ember',
		],
	},
	{
		name: "[Gen 1] Custom Game",

		mod: 'gen1',
		searchShow: false,
		debug: true,
		ruleset: ['Pokemon', 'HP Percentage Mod', 'Cancel Mod'],
	},
];
