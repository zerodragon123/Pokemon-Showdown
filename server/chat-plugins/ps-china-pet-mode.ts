/*
	Pokemon Showdown China Pet Mode Version 1.0 Author: Starmind
	p2. /add 选项 nv 能不能大师球
	p2. Acid Rain, Mercy Aura 特效
	p1. 孵蛋系统
	p1. 精灵球
	p0. Mercy Aura
*/

import { FS } from "../../lib";
import { PRNG } from "../../sim";
import { addScore } from "./ps-china-admin";
import { PetModeLearnSets } from "../../config/pet-mode/learnsets";
import { PokemonIconIndexes } from "../../config/pet-mode/poke-num";
import { PokemonSprites } from "../../config/pet-mode/poke-sprites";
import { PetModeRoomConfig } from "../../config/pet-mode/room-config";
import { PetModeShopConfig } from "../../config/pet-mode/shop-config";
import { PetModeBossConfig } from "../../config/pet-mode/boss-config";
import { PetModeGymConfig } from "../../config/pet-mode/gym-config";

type userProperty = {
	'bag': string[],
	'box': string[],
	'items': { [itemName: string]: number },
	'badges': string[],
	'boss': string[],
	'time': { 'ball': number, 'draw': number, 'search': number, 'gym': number, 'boss': number },
};
type petPosition = {'type': 'bag' | 'box', 'index': number};
type statPosition = {'type': 'ivs' | 'evs', 'index': 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe'};

const prng = new PRNG();

const BOTID = 'pschinabot';
const USERPATH = 'config/pet-mode/user-properties';
const GIFTPATH = 'config/pet-mode/user-gifts';
const DEPOSITPATH = 'config/pet-mode/deposit';
const TRADELOGPATH = 'config/pet-mode/trade-log';
const POKESHEET = 'https://play.pokemonshowdown.com/sprites/pokemonicons-sheet.png';
const POKESPRITES = 'https://play.pokemonshowdown.com/sprites/ani';
const POKESPRITESSHINY = 'https://play.pokemonshowdown.com/sprites/ani-shiny';
const ITEMSHEET = 'https://play.pokemonshowdown.com/sprites/itemicons-sheet.png';
const TYPEICONS = 'https://play.pokemonshowdown.com/sprites/types';
const CATICONS = 'https://play.pokemonshowdown.com/sprites/categories';
const ITEMFOLDER = 'http://47.94.147.145:8000/avatars/items';

const LAWNCD = 2000;
const GYMCD = 300000;
const BALLCD = 600000;

if (!FS(USERPATH).existsSync()) FS(USERPATH).mkdir();
if (!FS(GIFTPATH).existsSync()) FS(GIFTPATH).mkdir();
if (!FS(DEPOSITPATH).existsSync()) FS(DEPOSITPATH).mkdir();
if (!FS(TRADELOGPATH).existsSync()) FS(TRADELOGPATH).mkdir();

class Utils {

	static restrict(x: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, x));
	}

	static argmax(s: StatsTable): 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe' {
		let maxValue = 0;
		let maxIndex: 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe' = 'hp';
		let i: 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';
		for (i in s) {
			if (s[i] > maxValue) {
				maxValue = s[i];
				maxIndex = i;
			}
		}
		return maxIndex;
	}

	static sample(s: { [name: string]: number }): string {
		let r = Math.random();
		let key = Object.keys(s)[0];
		for (key in s) {
			r -= s[key];
			if (r <= 0) break;
		}
		return key;
	}

	static hash(s: string): number {
		let hash = 0, i, chr;
		if (s.length === 0) return hash;
		for (i = 0; i < s.length; i++) {
			chr = s.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0;
		}
		return hash;
	}

	static getDate(): string {
		let date = new Date();
		let zfill = (x: number) => { return ("0" + x).slice(-2); };
		return `${date.getFullYear()}-${zfill(date.getMonth() + 1)}-${zfill((date.getDate()))}`;
	}

	static getDay(): number {
		return Math.floor(Date.now() / 24 / 60 / 60 / 1000);
	}

	static image(style: string) {
		return `<img style="${style}"/>`;
	}

	static itemStyle(name: string) {
		switch (toID(name)) {
			case 'box':
			case 'naturemint':
			case 'abilitycapsule':
			case 'abilitypatch':
			case 'rocketbottlecap':
			case 'rustybottlecap':
				return `background:transparent url(${ITEMFOLDER}/${toID(name)}.png) no-repeat; height: 24px; width: 24px;`;
		}
		const num = Dex.items.get(name).spritenum || 0;
		let top = Math.floor(num / 16) * 24;
		let left = (num % 16) * 24;
		return `background:transparent url(${ITEMSHEET}?g8) no-repeat scroll -${left}px -${top}px; height: 24px; width: 24px;`;
	}

	static iconStyle(name: string, gender: string = 'N') {
		const pokemon = Dex.species.get(name);
		const iconid = gender === 'F' && Pet.iconIndex[`${pokemon.id}f`] ? `${pokemon.id}f` : pokemon.id;
		const num = Pet.iconIndex[iconid] || pokemon.num;
		if (num <= 0) {
			// return `background:transparent url(${POKESHEET}) no-repeat scroll -0px 4px;height: 32px;width: 40px;`
			return `height: 32px; width: 40px;`
		}
		const top = Math.floor(num / 12) * 30;
		const left = (num % 12) * 40;
		return `background: transparent url(${POKESHEET}?v5) no-repeat scroll -${left}px -${top}px; height: 32px; width: 40px;`;
	}

	static button(message: string, desc: string, style: string = '', highlight: boolean = false) {
		const HLStyle = highlight ? 'border: double;' : '';
		return `<button style="${style} ${HLStyle}" class="button" name="send" value="${message}">${desc}</button>`
	}

	static boolButtons(yesMessage: string, noMessage: string) {
		return this.button(yesMessage, '确认') + this.button(noMessage, '取消');
	}

	static parseStatPosition(target: string): statPosition | undefined {
		if (!target) return;
		const targets = target.split(',').map(x => x.trim());
		if (targets.length !== 2 || (targets[0] !== 'ivs' && targets[0] !== 'evs')) return;
		const index = targets[1];
		if (index !== 'hp' && index !== 'atk' && index !== 'def' && index !== 'spa' && index !== 'spd' && index !== 'spe') return;
		return {'type': targets[0], 'index': index};
	}

}

class Pet {

	static sprites = new Set(PokemonSprites);

	static iconIndex: { [speciesid: string]: number } = PokemonIconIndexes;

	static learnSets: { [speciesid: string]: { [moveid: string]: number } } = PetModeLearnSets;

	static defaultWildMons = [
		'Caterpie', 'Weedle', 'Ledyba', 'Spinarak', 'Wurmple', 'Kricketot', 'Sewaddle', 'Venipede',
		'Scatterbug', 'Grubbin', 'Blipbug', 'Poochyena', 'Shinx', 'Lillipup', 'Purrloin', 'Nickit',
		'Pidgey', 'Hoothoot', 'Taillow', 'Starly', 'Pidove', 'Fletchling', 'Pikipek', 'Rookidee',
		'Rattata', 'Sentret', 'Zigzagoon', 'Bidoof', 'Patrat', 'Bunnelby', 'Yungoos', 'Skwovet',
	];

	static initMons = [
		'Bulbasaur', 'Chikorita', 'Treecko', 'Turtwig', 'Snivy', 'Chespin', 'Rowlet', 'Grookey',
		'Charmander', 'Cyndaquil', 'Torchic', 'Chimchar', 'Tepig', 'Fennekin', 'Litten', 'Scorbunny',
		'Squirtle', 'Totodile', 'Mudkip', 'Piplup', 'Oshawott', 'Froakie', 'Popplio', 'Sobble',
	];

	static legendMons = [
		'Articuno', 'Zapdos', 'Moltres', 'Raikou', 'Entei', 'Suicune', 'Regirock', 'Regice', 'Registeel', 'Latias', 'Latios',
		'Uxie', 'Mesprit', 'Azelf', 'Heatran', 'Regigigas', 'Cresselia', 'Cobalion', 'Terrakion', 'Virizion',
		'Tornadus', 'Thundurus', 'Landorus', 'Kubfu', 'Urshifu', 'Regieleki', 'Regidrago', 'Glastrier', 'Spectrier',
		'Type: Null', 'Silvally', 'Tapu Koko', 'Tapu Lele', 'Tapu Bulu', 'Tapu Fini', 'Nihilego', 'Buzzwole', 'Pheromosa',
		'Xurkitree', 'Celesteela', 'Kartana', 'Guzzlord', 'Poipole', 'Naganadel', 'Stakataka', 'Blacephalon',
		'Mewtwo', 'Lugia', 'Ho-Oh', 'Kyogre', 'Groudon', 'Rayquaza', 'Dialga', 'Palkia', 'Giratina', 'Reshiram', 'Zekrom', 'Kyurem',
		'Xerneas', 'Yveltal', 'Zygarde', 'Cosmog', 'Cosmoem', 'Solgaleo', 'Lunala', 'Necrozma', 'Zacian', 'Zamazenta', 'Eternatus',
		'Calyrex', 'Mew', 'Celebi', 'Jirachi', 'Deoxys', 'Phione', 'Manaphy', 'Darkrai', 'Shaymin', 'Arceus', 'Victini',
		'Keldeo', 'Meloetta', 'Genesect', 'Diancie', 'Hoopa', 'Volcanion', 'Magearna', 'Marshadow', 'Poipole', 'Zeraora',
		'Meltan', 'Melmetal', 'Zarude'
	];

	static subLegendMons = [
		'Dratini', 'Dragonair', 'Dragonite', 'Larvitar', 'Pupitar', 'Tyranitar', 'Bagon', 'Shelgon', 'Salamence',
		'Beldum', 'Metang', 'Metagross', 'Gible', 'Gabite', 'Garchomp', 'Deino', 'Zweilous', 'Hydreigon',
		'Goomy', 'Sliggoo', 'Goodra', 'Jangmo-o', 'Hakamo-o', 'Kommo-o', 'Dreepy', 'Drakloak', 'Dragapult'
	];

	static typeIcons: { [speciesname: string]: string } = {};

	static moveIcons: { [movename: string]: string } = {};

	static initButtons = [0, 1, 2].map(x => Pet.initMons.slice(x * 8, x * 8 + 8).map(
		x => Utils.button(`/pet init set ${x}`, '', Utils.iconStyle(x))
	).join('')).join('<br/>');

	static spriteId(speciesid: string, gender: string = 'N'): string {
		speciesid = toID(speciesid);
		let species = Dex.species.get(speciesid);
		const baseid = toID(species.baseSpecies);
		speciesid = speciesid.substring(baseid.length);
		const sprite = baseid + (speciesid ? '-' + speciesid : '');
		if (gender === 'F' && Pet.sprites.has(`${sprite}-f`)) return `${sprite}-f`;
		return sprite;
	}

	static validMoves(speciesname: string, level: number): string[] {
		let speciesid = toID(speciesname);
		if (!this.learnSets[speciesid]) speciesid = toID(speciesname.split('-')[0]);
		if (!this.learnSets[speciesid]) return [];
		return Object.keys(this.learnSets[speciesid]).filter(moveid => {
			return this.learnSets[speciesid][moveid] <= level;
		});
	}

	static sampleMoves(species: string, level: number): string[] {
		let validMoves = this.validMoves(species, level);
		prng.shuffle(validMoves);
		return validMoves.slice(0, 4); 
	}

	static randomIvs(): StatsTable {
		let intArray = [...new Array(32).keys()];
		return {hp: prng.sample(intArray), atk: prng.sample(intArray), def: prng.sample(intArray),
			spa: prng.sample(intArray), spd: prng.sample(intArray), spe: prng.sample(intArray)};
	}

	static randomAbility(species: Species, hidden: number): string {
		if (species.abilities['H'] && prng.randomChance(hidden * 1000, 1000)) return species.abilities['H'];
		return species.abilities["1"] ? prng.sample([species.abilities["0"], species.abilities["1"]]) : species.abilities["0"];
	}

	static gen(
		speciesid: string, level: number, fullivs: boolean = false,
		happy: number = 0, shiny: number = 1 / 2048, hidden: number = 1 / 100
	): string {
		level = Utils.restrict(level, 1, 100);
		const species = Dex.species.get(speciesid);
		if (species.num <= 0) return '';
		const set: PokemonSet = {
			name: species.name,
			species: prng.sample([species.name].concat(species.cosmeticFormes || [])),
			item: "",
			ability: this.randomAbility(species, hidden),
			moves: this.sampleMoves(species.name, level),
			nature: prng.sample(Dex.natures.all()).name,
			gender: species.gender ? species.gender : (prng.randomChance(Math.floor(species.genderRatio.M * 1000), 1000) ? 'M' : 'F'),
			evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
			ivs: fullivs ? {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31} : this.randomIvs(),
			level: level,
			happiness: happy,
			shiny: prng.randomChance(shiny * 1000, 1000),
		};
		return Teams.pack([set]);
	}

	static wild(roomid: string, lawnid: string, maxLevel: number, restrictLevel: number, legend: boolean = false): string {
		if (legend && PetBattle.legends[roomid]) return PetBattle.legends[roomid];
		if (!PetBattle.roomConfig[roomid] || !PetBattle.roomConfig[roomid]['lawn'][lawnid]) return '';
		if (restrictLevel <= PetBattle.roomConfig[roomid]['minlevel']) return '';
		return this.gen(
			Utils.sample(PetBattle.roomConfig[roomid]['lawn'][lawnid]),
			Math.min(restrictLevel, prng.sample([...new Array(11).keys()].map(x => {
				return x + Math.min(maxLevel, PetBattle.roomConfig[roomid]['maxlevel']) - 5;
			})))
		);
		// return this.gen(
		// 	prng.sample(this.defaultWildMons),
		// 	Math.min(restrictLevel, prng.sample([...new Array(11).keys()].map(x => x + Utils.restrict(maxLevel, 5, 20) - 5)))
		// );
	}

	static parseSet(packedSet: string): PokemonSet | undefined {
		const floatLevel = parseFloat(packedSet.split('|')[10]) || 100;
		const sets = Teams.unpack(packedSet);
		if (!sets) return;
		const set = sets[0];
		set.level = floatLevel;
		const species = Dex.species.get(set.species || set.name);
		set.species = species.name;
		if (species.gender) set.gender = species.gender;
		if (!set.ability) set.ability = species.abilities["0"];
		if (!set.evs) set.evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
		if (!set.ivs) set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
		if (!set.item) set.item = '';
		if (!set.shiny) set.shiny = false;
		if (set.happiness === undefined) set.happiness = 255;
		return set;
	}

	static validEvos(set: PokemonSet, traded: boolean = false): (string)[][] {
		const rawSpecies = Dex.species.get(set.species);
		return rawSpecies.evos.map(x => {
			const species = Dex.species.get(x);
			if (species.cosmeticFormes && species.formeOrder) {
				if (rawSpecies.formeOrder) {
					x = species.formeOrder[rawSpecies.formeOrder.indexOf(set.species)] || x;
				} else {
					x = species.formeOrder[Math.abs(Utils.hash(Utils.getDate())) % species.formeOrder.length];
				}
			}
			if (species.gender && species.gender !== set.gender) return [];
			if (traded) {
				if (species.evoType === 'trade') {
					if (!species.evoItem) return [x, ''];
					if (species.evoItem && set.item === species.evoItem) return [x, set.item];
				}
				return [];
			}
			if (species.id === 'alcremie') return set.item.indexOf('Sweet') >= 0 ? [x, set.item] : [];
			if (species.evoCondition) {
				const hours = new Date().getHours();
				switch (species.evoCondition) {
					case "at night":
						if (hours > 5 && hours < 18) return [];
						break;
					case "during the day":
						if (hours < 6 || hours > 17) return [];
						break;
					case "from a special Rockruff":
						if (hours % 12 !== 5) return [];
						break;
				}
			}
			if (species.evoType) {
				switch (species.evoType) {
					case 'useItem':
						return set.item === species.evoItem ? [x, set.item] : [];
					case 'levelMove':
						return set.moves.indexOf(species.evoMove || '') >= 0 ? [x, ''] : [];
					case 'levelFriendship':
						return (set.happiness !== undefined ? set.happiness : 255) >= 220 ? [x, ''] : [];
					case 'levelHold':
						return set.item === species.evoItem ? [x, set.item] : [];
					case 'trade':
						return [];
					default:
						return set.level >= 36 ? [x, ''] : [];
				}
			}
			return set.level >= (species.evoLevel || 100) ? [x, ''] : [];
		}).filter(x => x.length === 2);
	}

	static evo(set: PokemonSet, targetSpecies: string, item: boolean): PokemonSet {		
		if (item) set.item = '';
		if (toID(set.species) === toID(set.name)) set.name = targetSpecies;
		const preAbilities = Dex.species.get(set.species).abilities;
		const postAbilities = Dex.species.get(targetSpecies).abilities;
		if (set.ability === preAbilities['1'] && postAbilities['1']) set.ability = postAbilities['1'];
		else if (set.ability === preAbilities['H'] && postAbilities['H']) set.ability = postAbilities['H'];
		else if (set.ability === preAbilities['S'] && postAbilities['S']) set.ability = postAbilities['S'];
		else if (!preAbilities['1'] && postAbilities['1']) set.ability = prng.sample([postAbilities['0'], postAbilities['1']]);
		else set.ability = postAbilities['0'];
		set.species = targetSpecies;
		return set;
	}

	static validSets(sets: string[]): string[] {
		return sets.map((x: string) => {
			const team = Teams.unpack(x);
			if (!team) return '';
			if (!Dex.species.get(team[0].species).exists) return '';
			if (!Dex.natures.get(team[0].nature).exists) return '';
			if (!Dex.abilities.get(team[0].ability).exists) return '';
			if (team[0].item && !Dex.items.get(team[0].item).exists) return '';
			if (team[0].moves.length < 1) return '';
			for (let move of team[0].moves) {
				if (!Dex.moves.get(move)) return '';
			}
			return Teams.pack(team);
		}).filter((x: string) => x);
	}
}
Dex.moves.all().forEach(move => {
	Pet.moveIcons[move.name] = `background: url(${TYPEICONS}/${move.type}.png) no-repeat 5%, ` +
		`url(${CATICONS}/${move.category}.png) no-repeat 95%;`;
})
const typeIconImage = (t: string) => Utils.image(`background: url(${TYPEICONS}/${t}.png); width: 32px; height: 14px`);
Dex.species.all().forEach(species => {
	const img = typeIconImage(species.types[0]) + (species.types[1] ? typeIconImage(species.types[1]) : '');
	Pet.typeIcons[species.name] = img;
	species.cosmeticFormes?.forEach(forme => Pet.typeIcons[forme] = img);
})

class PetBattle {

	static legends: { [roomid: string]: string } = {};

	static nextRoom: { [roomid: string]: string } = {};

	static previousRoom: { [roomid: string]: string } = {};

	static roomConfig: { [roomid: string]: {
		'lawn': { [lawnid: string]: { [species: string]: number } },
		'minlevel': number,
		'maxlevel': number
	} } = PetModeRoomConfig;

	static gymConfig: { [gymname: string]: {
		'maxlevel': number, 'botteam': string, 'userteam': string, 'ace': string,
		'bonus'?: string, 'terrain'?: string, 'weather'?: string,
		'msg': { 'start': string, 'ace': string, 'win': string, 'lose': string }
	} } = PetModeGymConfig;

	static bossConfig: { [bossname: string]: {
		'set': string, 'bonus': string
	} } = PetModeBossConfig;

	static balls: { [ballname: string]: number } = {'Poke Ball': 1, 'Great Ball': 2, 'Ultra Ball': 4, 'Master Ball': Infinity};

	static inBattle(userid: string): string | undefined {
		const battleWithBot = (roomid: string) => {
			const battle = Rooms.get(roomid)?.battle;
			return battle && (battle.p1.id === BOTID || battle.p2.id === BOTID) &&
				(battle.p1.id === userid || battle.p2.id === userid) && !battle.ended;
		}
		const user = Users.get(userid);
		if (!user) return undefined;
		return [...user.inRooms].filter(x => toID(x).indexOf('petmode') >= 0 && battleWithBot(x))[0];
	}

	static validate(rule: string, userSets: string[]): string {
		rule = toID(rule);
		const userTeam = Teams.unpack(userSets.join(']'));
		if (!userTeam) return '您不能使用非法格式的队伍';
		if (rule.indexOf('norepeat') >= 0) {
			const setLength = [...new Set(userTeam.map(set => set.species))].length;
			if (setLength < userSets.length) return '您不能携带重复的宝可梦';
		}
		if (rule.indexOf('noevasion') >= 0) {
			for (let set of userTeam) {
				for (let moveid of set.moves) {
					if ([
						'doubleteam', 'minimize', 'flash', 'smokescreen', 'sandattack', 'kinesis', 'mudslap',
						'nightdaze', 'mudbomb', 'muddywater', 'octazooka', 'mirrorshot', 'leaftornado'
					].indexOf(toID(moveid)) >= 0) {
						return `您的 ${set.name} 不能携带提升回避率或降低对手命中率的招式 ${moveid} `;
					}
				}
			}
		}
		if (rule.indexOf('nobatonpass') >= 0) {
			for (let set of userTeam) {
				for (let moveid of set.moves) {
					if (toID(moveid) == 'batonpass') {
						return `您的 ${set.name} 不能使用接力棒`;
					}
				}
			}
		}
		return '';
	}

	static createBattle(
		user: User, bot: User, userTeam: string, botTeam: string, format: string, hidden: boolean,
		delayedStart: boolean | 'multi' | undefined = false
	): GameRoom | undefined {
		return Rooms.createBattle({
			format: format,
			p1: {
				user: bot,
				team: botTeam,
				rating: 0,
				hidden: hidden,
				inviteOnly: false,
			},
			p2: {
				user: user,
				team: userTeam,
				rating: 0,
				hidden: hidden,
				inviteOnly: false,
			},
			p3: undefined,
			p4: undefined,
			rated: 0,
			challengeType: 'unrated',
			delayedStart: delayedStart,
		});
	}

}
let previousRoomId = '';
for (let roomid in PetBattle.roomConfig) {
	for (let lawnid in PetBattle.roomConfig[roomid]['lawn']) {
		const sumRate = eval(Object.values(PetBattle.roomConfig[roomid]['lawn'][lawnid]).join('+'));
		for (let speciesid in PetBattle.roomConfig[roomid]['lawn'][lawnid]) {
			PetBattle.roomConfig[roomid]['lawn'][lawnid][speciesid] /= sumRate;
		}
	}
	if (previousRoomId) {
		PetBattle.nextRoom[previousRoomId] = roomid;
		PetBattle.previousRoom[roomid] = previousRoomId;
	}
	previousRoomId = roomid;
}

class Shop {

	static shopConfig: { [goodtype: string]: { [goodname: string]: number} } = PetModeShopConfig;

	static types: { [goodtype: string]: string } = {
		'ball': '精灵球', 'draw': '进化道具', 'berry': '树果',
		'battle': '对战道具', 'special': '专用对战道具', 'util': '其他道具'
	};

	static goodDesc: { [goodtype: string]: string } = {
		'Box': '添加一个盒子',
		'Nature Mint': '宝可梦携带并使用后可以改变性格',
		'Ability Capsule': '宝可梦携带并使用后可以改变特性 (不可改变为隐藏特性)',
		'Ability Patch': '宝可梦携带并使用后可以改变为隐藏特性',
		'Rocket Bottle Cap': '宝可梦携带并使用后可以使一项个体值随机提升',
		'Rusty Bottle Cap': '宝可梦携带并使用后可以使一项个体值重置为随机值',
		'Bottle Cap': '宝可梦携带并使用后可以使一项个体值提升至31',
		'Gold Bottle Cap': '宝可梦携带并使用后可以使全部个体值提升至31',
	};

	static func: { [goodid: string]: (set: PokemonSet, arg: string) => boolean } = {
		'rustybottlecap': (set: PokemonSet, arg: string) => {
			if (Object.keys(set.ivs).indexOf(arg) < 0) return false;
			// @ts-ignore
			set.ivs[arg] = prng.sample([...new Array(32).keys()]);
			return true;
		},
		'rocketbottlecap': (set: PokemonSet, arg: string) => {
			if (Object.keys(set.ivs).indexOf(arg) < 0) return false;
			// @ts-ignore
			if (set.ivs[arg] >= 31) return false;
			// @ts-ignore
			set.ivs[arg] = set.ivs[arg] + 1 + prng.sample([...new Array(31 - set.ivs[arg]).keys()]);
			return true;
		},
		'bottlecap': (set: PokemonSet, arg: string) => {
			if (Object.keys(set.ivs).indexOf(arg) < 0) return false;
			// @ts-ignore
			set.ivs[arg] = 31;
			return true;
		},
		'goldbottlecap': (set: PokemonSet, arg: string) => {
			set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
			return true;
		},
		'abilitycapsule': (set: PokemonSet, arg: string) => {
			const abilities = Dex.species.get(set.species).abilities;
			if (!abilities['1']) return false;
			if (toID(set.ability) === toID(abilities['0'])) {
				set.ability = abilities['1'];
				return true;
			} else if (toID(set.ability) === toID(abilities['1'])) {
				set.ability = abilities['0'];
				return true;
			}
			return false;
		},
		'abilitypatch': (set: PokemonSet, arg: string) => {
			const abilities = Dex.species.get(set.species).abilities;
			if (!abilities['H']) return false;
			if (toID(set.ability) === toID(abilities['H'])) return false;
			set.ability = abilities['H'];
			return true;
		},
		'naturemint': (set: PokemonSet, arg: string) => {
			for (let nature of Dex.natures.all()) {
				if (toID(arg) === nature.id && toID(set.nature) !== nature.id) {
					set.nature = nature.name;
					return true;
				}
			}
			return false;
		},
	}

	static goodButtons: { [goodtype: string]: string } = {
		'ball': Object.keys(PetModeShopConfig['ball']).map(goodname => {
			return Utils.button(`/pet shop show ball=>${goodname}`, '', Utils.itemStyle(goodname));
		}).join(''),
		'draw': Object.keys(PetModeShopConfig['draw']).map(goodname => {
			return Utils.button(`/pet shop show draw=>${goodname}`, '', Utils.itemStyle(goodname));
		}).join(''),
		'berry': Object.keys(PetModeShopConfig['berry']).map(goodname => {
			return Utils.button(`/pet shop show berry=>${goodname}`, '', Utils.itemStyle(goodname));
		}).join(''),
		'battle': Object.keys(PetModeShopConfig['battle']).map(goodname => {
			return Utils.button(`/pet shop show battle=>${goodname}`, '', Utils.itemStyle(goodname));
		}).join(''),
		'special': Object.keys(PetModeShopConfig['special']).map(goodname => {
			return Utils.button(`/pet shop show special=>${goodname}`, '', Utils.itemStyle(goodname));
		}).join(''),
		'util': Object.keys(PetModeShopConfig['util']).map(goodname => {
			return Utils.button(`/pet shop show util=>${goodname}`, '', Utils.itemStyle(goodname));
		}).join(''),
	};

	static getPrice(goodname: string): number {
		for (let goodtype in this.shopConfig) {
			if (this.shopConfig[goodtype][goodname]) {
				return this.shopConfig[goodtype][goodname];
			}
		}
		return 40;
	};

}

class PetUser {

	id: string;
	private path: string;

	chatRoomId: string | undefined;
	battleRoomId: string | undefined;
	battleInfo: string | undefined;

	operation: string | undefined;
	property: userProperty | undefined;
	cachedProperty: userProperty | undefined;
	onPage: number;
	onPosition: petPosition | undefined;
	onChangeMoves: {'position': petPosition, 'selected': string[], 'valid': string[]} | undefined;

	constructor(userid: string, dir: string = USERPATH) {
		this.id = userid;
		this.path = `${dir}/${this.id}.json`;
		this.load();
		this.onPage = 0;
	}

	load() {
		const userSaveData = FS(this.path).readIfExistsSync();
		if (userSaveData) {
			this.property = JSON.parse(userSaveData);
			this.init();
		}
	}

	save() {
		if (this.property) FS(this.path).safeWriteSync(JSON.stringify(this.property));
	}

	init() {
		this.property = {
			'bag': this.property?.bag || new Array(6).fill(''),
			'box': this.property?.box || new Array(30).fill(''),
			'items': this.property?.items || {},
			'badges': this.property?.badges || [],
			'boss': this.property?.boss || [],
			'time': {
				'ball': this.property?.time?.ball || 0,
				'draw': this.property?.time?.draw || 0,
				'search': this.property?.time?.search || 0,
				'gym': this.property?.time?.gym || 0,
				'boss': this.property?.time?.boss || 0,
			}
		}
	}

	destroy() {
		FS(this.path).unlinkIfExistsSync();
	}

	editProperty(propertyString: string): boolean {
		const pet = Teams.pack(Teams.unpack(propertyString));
		if (pet) return this.addPet(pet);
		const cachedProperty = JSON.parse(JSON.stringify(this.property));
		try {
			const parsed = JSON.parse(propertyString);
			let items: { [itemName: string]: number } = {};
			for (let item in parsed['items']) {
				const parsedNum = parseInt(parsed['items'][item]);
				if (parsedNum !== NaN) items[item] = parsedNum;
			}
			if (!this.property) throw Error();
			Object.assign(this.property['items'], items);
			if (parsed['bag']) Object.assign(this.property['bag'], Pet.validSets(parsed['bag']).slice(0, this.property['bag'].length));
			if (parsed['box']) Object.assign(this.property['box'], Pet.validSets(parsed['box']).slice(0, this.property['box'].length));
			if (parsed['badges']) this.property['badges'] = parsed['badges'].filter((x: string) => !!PetBattle.gymConfig[x]);
			if (parsed['boss']) this.property['boss'] = parsed['boss'].filter((x: string) => !!PetBattle.bossConfig[x]);
			if (this.property['bag'].filter(x => x).length === 0) throw Error();
		} catch (err) {
			this.property = cachedProperty;
			return false;
		}
		this.cachedProperty = cachedProperty;
		return true;
	}

	restoreProperty(): boolean {
		if (!this.cachedProperty) return false;
		this.property = this.cachedProperty;
		this.cachedProperty = undefined;
		return true;
	}

	getBoxPriceBase(): number {
		if (!this.property) return 1;
		let a = 1, b = 1, c;
		for (
			let bought = this.boxNum() - this.property['badges'].filter(
				gymid => PetBattle.gymConfig[gymid]?.bonus === 'box'
			).length - 1;
			bought > 0;
			c = a, a = b, b += c, bought--
		);
		return b;
	}

	addBox(): boolean {
		if (!this.property) return false;
		this.property['box'] = this.property['box'].concat(new Array(30).fill(''));
		return true;
	}

	boxNum(): number {
		if (!this.property) return 1;
		return Math.ceil(this.property['box'].length / 30);
	}

	badgeNum(): number {
		return this.property ? this.property['badges'].length : 0;
	}

	levelRistriction(): number {
		return this.badgeNum() * 10 + 10;
	}

	parsePosition(target: string): petPosition | undefined {
		if (!this.property) return;
		if (!target) return;
		const targets = target.split(',').map(x => x.trim());
		if (targets.length !== 2) return;
		const posType: 'bag' | 'box' = targets[0] === 'bag' ? 'bag' : 'box';
		const index = parseInt(targets[1]);
		if (index === NaN || index < 0 || index >= this.property[posType].length) return;
		return {'type': posType, 'index': index};
	}

	getPet(): string {
		if (!this.property || !this.onPosition) return '';
		return this.property[this.onPosition['type']][this.onPosition['index']];
	}

	setPet(pet: string) {
		if (!this.property || !this.onPosition) return;
		this.property[this.onPosition['type']][this.onPosition['index']] = pet;
	}

	addPet(pet: string): boolean {
		if (!this.property || !pet) return false;
		const bagIndex = this.property.bag.indexOf('');
		if (bagIndex >= 0) {
			this.property.bag[bagIndex] = pet;
			return true;
		}
		const boxIndex = this.property.box.indexOf('');
		if (boxIndex >= 0) {
			this.property.box[boxIndex] = pet;
			return true;
		}
		return false;
	}

	removePet(position: petPosition, item: string = ''): boolean {
		if (!this.property) return false;
		if (position['type'] === 'bag' && this.property['bag'].filter(x => x).length <= 1) return false;
		if (item) this.addItem(item, 1);
		this.property[position['type']][position['index']] = '';
		return true;
	}

	checkPet(position: petPosition | undefined): PokemonSet | undefined {
		if ((this.onPosition = position) && this.property) {
			const set = Pet.parseSet(this.getPet());
			if (set) {
				const species = Dex.species.get(set.species);
				if (species.formeOrder) {
					let modified = true;
					const formerSpecies = set.species;
					switch (species.baseSpecies) {
						case 'Deerling':
						case 'Sawsbuck':
							set.species = species.formeOrder[Math.floor((new Date().getMonth() + 10) % 12 / 3)];
							break;
						case 'Burmy':
						case 'Alcremie':
						case 'Furfrou':
							set.species = species.formeOrder[position['index'] % species.formeOrder.length];
							break;
						default:
							modified = false;
					}
					if (modified) {
						if (toID(set.name) === toID(formerSpecies)) set.name = set.species;
						this.setPet(Teams.pack([set]));
						this.save();
					}
				}
			}
			return set;
		}
	}

	movePet(pos1: petPosition, pos2: petPosition): boolean{
		if (!this.property) return false;
		const set1 = this.property[pos1['type']][pos1['index']];
		const set2 = this.property[pos2['type']][pos2['index']];
		const bagSize = this.property['bag'].filter(x => x).length;
		if (bagSize <= 1 && (
			(pos1['type'] === 'bag' && pos2['type'] === 'box' && !set2) ||
			(pos2['type'] === 'bag' && pos1['type'] === 'box' && !set1)
		)) return false;
		this.property[pos1['type']][pos1['index']] = set2;
		this.property[pos2['type']][pos2['index']] = set1;
		return true;
	}

	namePet(name: string): boolean {
		if (!this.property || !this.onPosition) return false;
		let pet = this.getPet();
		if (!pet) return false;
		const features = pet.split('|');
		if (!features[1]) features[1] = features[0];
		features[0] = name || features[1];
		pet = features.join('|');
		this.setPet(pet);
		return true;
	}

	checkEvo(position: petPosition): string[][] {
		if (!this.property) return [];
		const set = Pet.parseSet(this.property[position['type']][position['index']]);
		if (!set) return [];
		return Pet.validEvos(set);
	}

	evo(position: petPosition, targetSpecies: string, item: boolean): boolean {
		if (!this.property) return false;
		let set = Pet.parseSet(this.property[position['type']][position['index']]);
		if (!set) return false;
		set = Pet.evo(set, targetSpecies, item);
		this.property[position['type']][position['index']] = Teams.pack([set]);
		if (set.species === 'Ninjask') {
			set.species = 'Shedinja';
			set.ability = 'Wonder Guard';
			set.gender = 'N';
			set.item = '';
			this.addPet(Teams.pack([set]));
		}
		return true;
	}

	addItem(itemName: string, num: number): boolean {
		if (!this.property) return false;
		if (!(itemName in this.property['items'])) this.property['items'][itemName] = 0;
		this.property['items'][itemName] += num;
		return true;
	}

	removeItem(itemName: string, num: number): boolean {
		if (!this.property) return false;
		if (itemName && itemName in this.property['items']) {
			this.property['items'][itemName] -= 1;
			if (this.property['items'][itemName] === 0) {
				delete this.property['items'][itemName];
			}
			return true;
		}
		return false;
	}

	setItem(position: petPosition, itemName: string): boolean {
		if (!this.property) return false;
		const set = Pet.parseSet(this.property[position['type']][position['index']]);
		if (!set) return false;

		if (set.item) {
			if (this.addItem(set.item, 1)) set.item = '';
		} else {
			if (this.removeItem(itemName, 1)) set.item = itemName;
		}
		this.property[position['type']][position['index']] = Teams.pack([set]);
		return true;
	}

	useItem(arg: string): boolean {
		if (!this.property) return false;
		const pet = this.getPet();
		if (!pet) return false;
		const set = Pet.parseSet(pet);
		if (!set) return false;
		const itemid = toID(set.item);
		if (Shop.func[itemid] && Shop.func[itemid](set, arg)) {
			set.item = '';
			this.setPet(Teams.pack([set]));
			return true;
		}
		return false;
	}

	checkMoves(): string {
		if (!this.property) return '您的队伍格式不合法';
		for (let pet of this.property['bag']) {
			const team = Teams.unpack(pet);
			if (team) {
				const set: PokemonSet = team[0];
				for (let move of set.moves) {
					const moveid = Dex.toID(move);
					if (moveid === 'vcreate') continue;
					const minLevel = Pet.learnSets[Dex.toID(set.species)][moveid];
					if (minLevel !== undefined && set.level >= minLevel) continue;
					return `您的 ${set.name} 携带了非法招式 ${move}`
				}
			}
		}
		return '';
	}

	changeMoves(position: petPosition): boolean {
		if (!this.property) return false;
		const set = Pet.parseSet(this.property[position['type']][position['index']]);
		if (!set) return false;
		if (!this.onChangeMoves) return false;
		set.moves = this.onChangeMoves['selected'];
		this.property[position['type']][position['index']] = Teams.pack([set]);
		return true;
	}

	resetStat(position: statPosition): boolean {
		if (!this.property || !this.onPosition) return false;
		const set = Pet.parseSet(this.getPet());
		if (!set) return false;
		set[position['type']][position['index']] = 0;
		this.setPet(Teams.pack([set]));
		return true;
	}

	maxLevel(): number {
		if (!this.property) return 0;
		return Math.max(...this.property['bag'].filter(x => x).map(x => parseInt(x.split('|')[10]) || 100));
	}

	balls(): string[] {
		if (!this.property) return [];
		return Object.keys(this.property['items']).filter(itemname => !!PetBattle.balls[itemname]);
	}

	catch(ball: string, legend: boolean): boolean {
		const statusCoef = parseInt(FS(`${DEPOSITPATH}/${this.id}.txt`).readIfExistsSync());
		if (!statusCoef) return false;
		const catchRate = statusCoef * (PetBattle.balls[ball] || 1);
		return prng.randomChance(catchRate / (legend ? 20 : 1), 255);
	}

	addExperience(foespecies: string, foelevel: number): boolean {
		if (!this.property) return false;
		let levelUp = false;
		const len = this.property['bag'].length;
		for (let index in this.property['bag']) {
			const ownPoke = this.property['bag'][index];
			if (ownPoke) {
				let features = ownPoke.split('|');
				let level = parseFloat(features[10]) || 100;
				// 经验 = sqrt(100 * foeLevel) * foeBst / log3(team.length + 2)
				// level + 1 所需经验 = level * bst * 1.5
				const foespec = Dex.species.get(foespecies);
				const foebst = foespec.bst;
				if (level < this.levelRistriction()) {
					let experience = Math.sqrt(100 * foelevel) * foebst / (Math.log(len + 2) / Math.log(3));
					const bst = Dex.species.get(features[1] || features[0]).bst;
					const needExp = (l: number) => Math.floor(l) * bst * 1.5;
					let need = needExp(level);
					let newLevel = level + experience / need;
					while (Math.floor(newLevel) > Math.floor(level)) {
						experience = experience - need;
						level += 1;
						levelUp = true;
						need = needExp(level);
						newLevel = level + experience / need;
					}
					features[10] = newLevel >= 100 ? '' : newLevel.toString();
				}
				const evs = (features[6] || ',,,,,').split(',').map((x: string) => parseInt(x) || 0);
				const maxEvsIndex = Utils.argmax(foespec.baseStats);
				const f = Object.keys(foespec.baseStats).indexOf(maxEvsIndex);
				const s = Math.floor(foespec.baseStats[maxEvsIndex] / 40) * 4;
				evs[f] = evs[f] + Math.max(Math.min(s, 252 - evs[f], 510 - eval(evs.join('+'))), 0);
				features[6] = evs.join(',');
				features[11] = Math.min((features[11] ? parseInt(features[11]) : 255) + 10, 255).toString();
				this.property['bag'][index] = features.join('|');
			}
		}
		return levelUp;
	}

	checkExchange(friend: PetUser): string {
		const team = Teams.unpack(this.getPet());
		if (!team) return '{1}的宝可梦数据格式错误!';
		const set = team[0];
		if (set.item && Shop.getPrice(set.item) >= 50) return '{1}的宝可梦携带了贵重物品, 不能交换!';
		if (Pet.legendMons.concat(Pet.subLegendMons).indexOf(Dex.species.get(set.species).baseSpecies) >= 0) {
			return '{1}的宝可梦是重要的宝可梦, 不能交换!';
		}
		if (set.moves.filter(x => toID(x) === 'vcreate').length > 0) return '{1}的宝可梦有纪念意义, 不能交换!';
		if (friend.levelRistriction() < Math.floor(set.level)) return '{2}的徽章数不足以驾驭{1}的宝可梦!';
		return '';
	}

	linkExchange(friend: PetUser): {'sent': string, 'received': string} | string {
		if (!this.property) return '您还没有领取最初的伙伴!';
		if (!this.onPosition) return '您想要交换的位置是空的!';
		if (!friend.property) return '朋友还没有领取最初的伙伴!';
		if (!friend.onPosition) return '朋友想要交换的位置是空的!';
		let userCheckRes = this.checkExchange(friend);
		if (userCheckRes) return userCheckRes.replace('{1}', '您').replace('{2}', '朋友');
		let friendCheckRes = friend.checkExchange(this);
		if (friendCheckRes) return friendCheckRes.replace('{1}', '朋友').replace('{2}', '您');
		let myPet = this.getPet();
		let mySet = Pet.parseSet(myPet);
		if (!mySet) return '您想要交换的宝可梦格式错误!';
		let friendPet = friend.getPet();
		let friendSet = Pet.parseSet(friendPet);
		if (!friendSet) return '朋友想要交换的宝可梦格式错误!';
		const myValidEvos = Pet.validEvos(mySet, true);
		if (myValidEvos.length > 0) mySet = Pet.evo(mySet, myValidEvos[0][0], !!myValidEvos[0][1]);
		const friendValidEvos = Pet.validEvos(friendSet, true);
		if (friendValidEvos.length > 0) friendSet = Pet.evo(friendSet, friendValidEvos[0][0], !!friendValidEvos[0][1]);
		myPet = Teams.pack([mySet]);
		friendPet = Teams.pack([friendSet]);
		friend.setPet(myPet);
		this.setPet(friendPet);
		return {'sent': myPet.split('|')[0], 'received': friendPet.split('|')[0]};
	}

	merge(targetUser: PetUser): { 'bag': string[], 'items': { [itemname: string]: number } } {
		let added: { 'bag': string[], 'items': { [itemname: string]: number } } = {'bag': [], 'items': {}};
		if (!targetUser.property) return added;
		let pokes = (targetUser.property['bag'] || []).filter(x => x);
		targetUser.property['bag'] = [];
		for (let i = 0; i < pokes.length; i++) {
			let poke = pokes[i];
			if (this.addPet(poke)) {
				added['bag'].push(poke.split('|')[0]);
			} else {
				targetUser.property['bag'] = pokes.splice(i);
				break;
			}
		}
		let items = targetUser.property['items'];
		for (let itemname in items) {
			this.addItem(itemname, items[itemname]);
			added['items'][itemname] = items[itemname];
		}
		targetUser.property['items'] = {};
		return added;
	}
}

const petUsers: { [userid: string]: PetUser } = {};

function getUser(userid: string): PetUser {
	return petUsers[userid] || (petUsers[userid] = new PetUser(userid));
}

function checkUser(userid: string): boolean {
	return FS(`${USERPATH}/${toID(userid)}.json`).existsSync();
}

export function dropUser(userid: string) {
	delete petUsers[userid];
}

function petBox(petUser: PetUser, target: string, admin: boolean = false): string {
	if (!petUser.property) return '';
	const st = (x: string) => `<b>${x}</b>`;

	let pokeDiv = ``;
	const set = petUser.checkPet(petUser.parsePosition(target));
	if (set) {
		let showDesc = true;
		let setTitle = set.level >= petUser.levelRistriction() ? `达到${petUser.badgeNum()}个徽章的等级上限` : '<br/>';
		if (petUser.operation === 'move') {
			setTitle = '请选择位置';
		} else if (petUser.operation === 'drop' + target) {
			setTitle = `确认放生 ${set.name} ? ` + Utils.boolButtons(
				`/pet box drop ${target}!`,
				`/pet box drop ${target}`
			);
		} else if (petUser.operation?.indexOf('resetstat') === 0) {
			const statOperation = petUser.operation.slice(9);
			const statPosition = statOperation.split(',')
			if (statPosition.length === 2) {
				const statType = statPosition[0] === 'ivs' ? '个体值' : 'evs' ? '努力值' : undefined;
				const statIndex = ['HP', '攻击', '防御', '特攻', '特防', '速度'][
					['hp', 'atk', 'def', 'spa', 'spd', 'spe'].indexOf(statPosition[1])
				]
				if (statType && statIndex) {
					setTitle = `确认清空 ${set.name} 的${statIndex}${statType}? ` + Utils.boolButtons(
						`/pet box resetstat ${statOperation}!`,
						`/pet box reset ${target}`
					);
				}
			}
		} else if (petUser.operation === 'evo') {
			setTitle = '请选择进化型: ' + Pet.validEvos(set).map(x => {
				return Utils.button(`/pet box evo ${target}=>${x[0]}`, '&emsp;', Utils.iconStyle(x[0], set.gender));
			}).join('') + ' ' + Utils.button(`/pet box evo ${target}`, '取消');
		} else if (petUser.operation?.indexOf('evo') === 0) {
			setTitle = `确认将 ${set.name} 进化为 ${petUser.operation?.slice(3)}? ` + Utils.boolButtons(
				`/pet box evo ${target}=>${petUser.operation?.slice(3)}`,
				`/pet box evo ${target}`
			);
		} else if (petUser.operation?.indexOf('readyex') === 0) {
			setTitle = `请等待${petUser.operation?.slice(7)}回复您的交换请求 ` +
				Utils.button(`/pet box ex ${petUser.operation?.slice(7)}`, '重新发送') +
				Utils.button(`/pet box reset ${target}`, '取消')
		} else if (petUser.operation?.indexOf('preex') === 0) {
			setTitle = `用 ${set.name} 与${petUser.operation?.slice(5)}交换? ` +
				Utils.boolButtons(`/pet box ex ${petUser.operation?.slice(5)}`, `/pet box reset ${target}`)
		} else if (petUser.operation?.indexOf('gift') === 0) {
			setTitle = `将 ${set.name} 赠送给${petUser.operation?.slice(4)}? ` +
				Utils.boolButtons(`/gift ${petUser.operation?.slice(4)}!`, `/pet box reset ${target}`)
		} else if (petUser.operation === 'useitem') {
			setTitle = `使用 ${set.item} ? `
			switch (toID(set.item)) {
				case 'rustybottlecap':
				case 'rocketbottlecap':
				case 'bottlecap':
					setTitle += `${Utils.button(`/pet box reset ${target}`, '取消')}<br/><div style="padding: 5px; border: ridge;">`;
					setTitle += Object.keys(set.ivs).map(key => Utils.button(`/pet box useitem ${key}`, key)).join(' ');
					setTitle += `</div>`;
					showDesc = false;
					break;
				case 'naturemint':
					setTitle += `${Utils.button(`/pet box reset ${target}`, '取消')}<br/><div style="padding: 5px; border: ridge;">`;
					setTitle += Dex.natures.all().map(nature => Utils.button(`/pet box useitem ${nature.id}`, nature.name)).join(' ');
					setTitle += `</div>`;
					showDesc = false;
					break;
				default:
					setTitle += Utils.boolButtons(`/pet box useitem default`, `/pet box reset ${target}`);
			}
		}
		setTitle = st(setTitle);
		const setButtons = [
			Utils.button(`/pet box nameguide ${target}`, '昵称'),
			Utils.button(`/pet box onmove ${target}`, '移动'),
			Utils.button(`/pet box ex`, '交换'),
			Utils.button(`/pet box evo ${target}`, '进化'),
			Utils.button(`/pet box moves ${target}`, '招式'),
			Utils.button(`/pet box drop ${target}`, '放生'),
			Utils.button(`/pet box reset`, '返回')
		]
		if (admin) setButtons.splice(2, 0, Utils.button(`/gift`, '赠送'))

		const bst = Dex.species.get(set.species).baseStats;
		const th = (x: string | number) => `<th style="text-align: center; padding: 0">${x}</th>`;
		const td = (x: string | number) => `<td style="text-align: center; padding: 0">${x}</td>`;
		const statsTable = `<table style="border-spacing: 0px;"><tr>${[
			th('') + ['HP', '攻击', '防御', '特攻', '特防', '速度'].map(x => th(x)).join(''),
			th('种族&ensp;') + Object.values(bst).map(x => td(x)).join(''),
			th('个体&ensp;') + Object.values(set.ivs).map(x => td(x)).join(''),
			// th('个体&ensp;') + Object.keys(set.ivs).map((x, i) => {
			// 	return td(Utils.button(`/pet box resetstat ivs,${x}`, Object.values(set.ivs)[i].toString()));
			// }).join(''),
			th('努力&ensp;') + Object.keys(set.evs).map((x, i) => {
				return td(Utils.button(`/pet box resetstat evs,${x}`, Object.values(set.evs)[i].toString()));
			}).join('')
		].join('</tr><tr>')}</tr></table>`;
		const setName = toID(set.name) === toID(set.species) ? '' : `${set.name}&emsp;`;
		const lines = [
			`${setName}${st('种类')} ${set.species}&emsp;${Pet.typeIcons[set.species]}${set.shiny ? '☆' : ''}`,
			`${st('性别')} ${{'M': '♂', 'F': '♀'}[set.gender] || '∅'}&emsp;${st('亲密度')} ${set.happiness}`,
			`${st('等级')} ${Math.floor(set.level)} (${Math.floor((set.level - Math.floor(set.level)) * 100)}%)&emsp;` + 
			`${st('道具')} ${set.item ? Utils.button(`/pet box item ${target}`, '&emsp;', Utils.itemStyle(set.item)) : '无'}` +
			`${Shop.func[toID(set.item)] ? Utils.button(`/pet box useitem`, '使用') : ''}`,
			`${st('性格')} ${set.nature}&emsp;${st('特性')} ${set.ability}`
		]
		const spriteURL = `${set.shiny ? POKESPRITESSHINY : POKESPRITES}/${Pet.spriteId(set.species, set.gender)}.gif`;
		const sprite = `background: transparent url(${spriteURL}) no-repeat 90% 10% relative;`
		pokeDiv = `<div style="line-height: 35px">${setTitle}</div>`;
		if (showDesc) {
			pokeDiv += `<div style=" display: inline-block; width: 50px; ` +
				`line-height: ${224 / setButtons.length}px; vertical-align: top;` +
				`">${setButtons.join('<br/>')}</div>` +
				`<div style="${sprite} display: inline-block; line-height: 28px; width: 300px;` +
				`">${lines.map(x => `${x}`).join('<br/>')}<br/>${statsTable}`;
		}
		pokeDiv = `<div style="width: 350px; position: relative; display: inline-block;">${pokeDiv}</div>`;
	}

	const boxTitle = `${st('用户ID')} ${petUser.id}&emsp;${st('徽章数')} ${petUser.badgeNum()}`;
	const petButton = (species: string, pos: string, gender: string) => {
		const style = Utils.iconStyle(species, gender);
		if (petUser.operation === 'move') return Utils.button(`/pet box move ${target}<=>${pos}`, '', style);
		return Utils.button(`/pet box show ${pos}`, '', style, target === pos.split(' ').join(''));
	};
	const bagMons = petUser.property['bag'].map((x, i) => {
		return petButton(x.split('|')[1] || x.split('|')[0], `bag,${i}`, x.split('|')[7]);
	}).join('') + '<br/>';
	const boxMons = petUser.property['box'].slice(petUser.onPage * 30, (petUser.onPage + 1) * 30).map((x, i) => {
		return petButton(x.split('|')[1] || x.split('|')[0], `box,${i + petUser.onPage * 30}`, x.split('|')[7]) +
			(i % 6 === 5 ? '<br/>' : '');
	}).join('');
	let items = ``;
	const itemButton = (item: string) => Utils.button(
		petUser.onPosition ? `/pet box item ${target}=>${item}` : '', '', Utils.itemStyle(item)
	);
	const itemNum = (x: number) => x > 0 ? x : '∞';
	for (let itemName in petUser.property['items']) {
		items += `${itemButton(itemName)}x${itemNum(petUser.property['items'][itemName])}<br/>`;
	}
	const shopButton = Utils.button('/pet shop', '商店');
	const checkButton = Utils.button('/pet box check', '检查队伍');
	const exportButton = Utils.button('/pet box export', '导出队伍');
	const pageNum = petUser.boxNum();
	let lastPageButton = '';
	let nextPageButton = '';
	if (pageNum > 1) {
		lastPageButton = Utils.button(`/pet box goto ${(petUser.onPage + pageNum - 1) % pageNum}`, '上个盒子');
		nextPageButton = Utils.button(`/pet box goto ${(petUser.onPage + 1) % pageNum}`, '下个盒子');
	}
	let boxDiv = `<div style="width: 310px; vertical-align: top; display: inline-block;">` +
		`<div style="width: 250px; vertical-align: top; display: inline-block">` +
		`<div style="line-height: 25px">${boxTitle}</div>` +
		`<div>${st(`背包`)} ${checkButton} ${exportButton}<br/>${bagMons}` +
		`${st(`盒子 ${petUser.onPage + 1}`)} ${lastPageButton} ${nextPageButton}<br/>${boxMons}</div></div>` +
		`<div style="width: 60px; vertical-align: top; display: inline-block;">` +
		`<div style="line-height: 35px">${shopButton}</div><div>${st(`道具`)}</div>` +
		`<div style="height: 210px; overflow: auto;">${items}</div></div></div>`;
	return `<div style="height: 300">${boxDiv}${pokeDiv}</div>`;
}

export const commands: Chat.ChatCommands = {

	name(target) {
		this.parse(`/pet box name ${target}`);
	},

	'link': 'ex',
	ex(target) {
		this.parse(`/pet box ex ${target}`);
	},

	ball() {
		this.parse(`/pet lawn ball Poke Ball`);
	},

	ball1() {
		this.parse(`/pet lawn ball Great Ball`);
	},

	ball2() {
		this.parse(`/pet lawn ball Ultra Ball`);
	},

	gym() {
		this.parse(`/j gym`);
	},

	'gen': 'add',
	add(target) {
		this.parse(`/pet lawn add ${target}`);
	},

	'rm': 'remove',
	remove(target) {
		this.parse(`/pet lawn remove ${target}`);
	},

	edit(target) {
		this.parse(`/pet admin edit ${target}`);
	},

	restore(target) {
		this.parse(`/pet admin restore ${target}`);
	},

	editgym(target) {
		this.parse(`/pet admin editgym ${target}`);
	},

	genpoke(target) {
		this.parse(`/pet admin genpoke ${target}`);
	},

	gift(target) {
		this.parse(`/pet admin gift ${target}`);
	},

	'petmode': 'pet',
	pet: {

		init: {

			'': 'show',
			show(target, room, user) {
				if (!user.registered) return this.popupReply("请先注册账号!");
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (petUser.property) return this.parse('/pet init guide');
				this.parse('/pet init clear');
				user.sendTo(room.roomid, `|uhtml|pet-init-show|欢迎使用宠物系统! 请选择您最初的伙伴:<br/>${Pet.initButtons}`);
			},

			set(target, room, user) {
				if (!user.registered) return this.popupReply("请先注册账号!");
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (petUser.property) return this.parse('/pet init guide');
				this.parse('/pet init clear');
				user.sendTo(room.roomid, `|uhtml|pet-init-show|确认选择<img style="${Utils.iconStyle(target)}"/>作为您最初的伙伴?${
					Utils.boolButtons(`/pet init confirm ${target}`, '/pet init show')
				}`);
			},

			confirm(target, room, user) {
				if (!user.registered) return this.popupReply("请先注册账号!");
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (petUser.property) return this.parse('/pet init guide');
				if (Pet.initMons.indexOf(target) < 0) return this.popupReply(`${target}不是合法初始的宝可梦`)

				petUser.init();
				petUser.addPet(Pet.gen(target, 5, true, 70, 0, 0));
				petUser.addItem('Poke Ball', 5);
				petUser.save();

				this.parse('/pet init guide');
			},

			guide(target, room, user) {
				if (!user.registered) return this.popupReply("请先注册账号!");
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				this.parse('/pet init clear');
				user.sendTo(room.roomid, `|uhtml|pet-init-show|您已领取最初的伙伴! 快进入 ${
					Utils.button('/pet box show new', '盒子')
				} 查看吧!`);
			},

			clear(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				user.sendTo(room.roomid, `|uhtmlchange|pet-init-show|`);
			}

		},

		box: {

			'': 'shownew',
			shownew(target, room, user) {
				this.parse('/pet box show new')
			},

			show(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				this.parse('/pet init clear');
				this.parse('/pet shop clear new');
				petUser.chatRoomId = room.roomid;
				petUser.load();
				const div = petBox(petUser, target, user.can("bypassall"));
				this.parse(`/pet box clear ${target}`);
				user.sendTo(room.roomid, `|uhtml${target === 'new' ? '' : 'change'}|pet-box-show|${div}`);
			},

			goto(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				petUser.onPage = (parseInt(target) || 0) % petUser.boxNum();
				this.parse(`/pet box show ${petUser.onPosition ? Object.values(petUser.onPosition).join(',') : ''}`);
			},

			check(target, room, user) {
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				this.popupReply(petUser.checkMoves() || "您的队伍是合法的!");
			},

			export(target, room, user) {
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				const userTeam = Teams.unpack(petUser.property['bag'].filter(x => x).join(']'));
				if (!userTeam) return this.popupReply("您的背包有格式错误!");
				this.popupReply(Teams.export(userTeam));
			},

			onmove(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				petUser.operation = 'move';
				this.parse(`/pet box show ${target}`);
			},

			move(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				petUser.operation = undefined;
				const targets = target.split('<=>').map(x => x.trim());
				if (targets.length !== 2) return this.popupReply(`Usage: /pet box move [bag|box],position1<=>[bag|box],position2`);
				const pos1 = petUser.parsePosition(targets[0]);
				const pos2 = petUser.parsePosition(targets[1]);
				if (!pos1 || !pos2) return this.popupReply(`位置不存在!`);
				petUser.load();
				if (petUser.movePet(pos1, pos2)) {
					petUser.save();
					this.parse(`/pet box show ${targets[1]}`);
				} else {
					this.popupReply(`背包不能为空!`);
				}
			},

			evo(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				// [进化]: petUser.operation = evo, /pet box show = 希望的进化型(/pet box evo {target}=>{goal})
				// [选择进化型]: petUser.operation = evo{goal},
				//              /pet box show = 确认(/pet box evo {target}=>{goal}) | 取消(/pet box evo {target})
				// [确认]: petUser.operation = undefined, /pet box show = 进化(/pet box evo {target})
				const targets = target.split('=>').map(x => x.trim());
				target = targets[0];
				const goal = targets[1];
				const position = petUser.parsePosition(target);
				if (!position) return this.popupReply('位置不存在!');
				const availableEvos = petUser.checkEvo(position);
				if (availableEvos.length === 0) {
					return this.popupReply('不满足进化条件!');
				}
				if (petUser.operation?.indexOf('evo') === 0) {
					if (targets.length !== 2) {
						petUser.operation = undefined;
					} else {
						const index = availableEvos.map(x => x[0]).indexOf(goal);
						if (index < 0) return this.popupReply('进化型不合法!');
						if (petUser.operation.slice(3) === goal) {
							petUser.load();
							if (petUser.evo(position, goal, !!availableEvos[index][1])) {
								this.popupReply('进化成功!');
								petUser.operation = undefined;
								petUser.save();
							} else {
								this.popupReply('进化失败!');
							}
						} else {
							petUser.operation = 'evo' + goal;
						}
					}
				} else {
					petUser.operation = 'evo';
				}
				this.parse(`/pet box show ${target}`);
			},

			item(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				const targets = target.split('=>').map(x => x.trim());
				target = targets[0];
				const position = petUser.parsePosition(target);
				if (!position) return this.popupReply('位置不存在!');
				if (petUser.operation) return this.popupReply('不能在进行其他操作的过程中更换道具!');

				petUser.load();
				if (petUser.setItem(position, targets[1])) petUser.save();

				this.parse(`/pet box show ${target}`);
			},

			useitem(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				if (!petUser.onPosition) return this.popupReply("请先选中要使用道具的宝可梦!")

				petUser.load();
				target = toID(target);
				if (!target) {
					petUser.operation = 'useitem';
				} else if (petUser.useItem(target)) {
					petUser.save();
					delete petUser.operation;
				} else {
					this.popupReply('道具使用失败!');
				}

				this.parse(`/pet box show ${petUser.onPosition ? Object.values(petUser.onPosition).join(',') : ''}`);
			},

			moves(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				user.sendTo(room.roomid, `|uhtmlchange|pet-box-show|`);
				const targets = target.split('=>').map(x => x.trim());
				target = targets[0];
				const position = petUser.parsePosition(target);
				if (!position) return this.popupReply('位置不存在!');
				petUser.load();
				const set = petUser.checkPet(position);
				if (!set) return this.popupReply('位置是空的!');
				if (!(petUser.onChangeMoves)) {
					petUser.onChangeMoves = {
						'position': position,
						'selected': set.moves,
						'valid': Pet.validMoves(set.species, set.level).map(x => Dex.moves.get(x).name)
					};
				}
				const div = (x: string) =>
					`<div style="display: inline-block; position: relative; width: 200px; padding: 5px; border: ridge;` +
					` height: 150px; overflow: auto; vertical-align: top;">${x}</div>`;
				const valid = petUser.onChangeMoves['valid'].map(move =>
					Utils.button(`/pet box addmove ${target}=>${move}`, move, `${Pet.moveIcons[move]} width: 180px;`)
				).join('<br/>');
				const selected = petUser.onChangeMoves['selected'].map(move =>
					Utils.button(`/pet box addmove ${target}=>${move}`, move, `${Pet.moveIcons[move]} width: 180px;`)
				).join('<br/>');
				const buttons = Utils.boolButtons(`/pet box setmoves ${target}!`, `/pet box setmoves ${target}`);
				if (targets.length === 1) {
					user.sendTo(room.roomid, `|uhtml|pet-moves-show|<b>请选择招式:</b><br/>${div(valid)}`);
					user.sendTo(room.roomid, `|uhtml|pet-moves-select|${div(`${selected}<br/>${buttons}`)}`);
				} else {
					user.sendTo(room.roomid, `|uhtmlchange|pet-moves-select|${div(`${selected}<br/>${buttons}`)}`);
				}
			},

			addmove(target, room, user) {
				const targets = target.split('=>');
				if (targets.length !== 2) return this.popupReply('请先指定需要更改招式的宝可梦');
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				if (!petUser.onChangeMoves) return this.popupReply('请先指定需要更改招式的宝可梦');
				const selectedIndex = petUser.onChangeMoves['selected'].indexOf(targets[1]);
				if (selectedIndex >= 0) {
					petUser.onChangeMoves['selected'].splice(selectedIndex, 1);
					return this.parse(`/pet box moves ${target}`);
				}
				const validIndex = petUser.onChangeMoves['valid'].indexOf(targets[1]);
				if (validIndex >= 0 && petUser.onChangeMoves['selected'].length < 4) {
					petUser.onChangeMoves['selected'].push(targets[1]);
					return this.parse(`/pet box moves ${target}`);
				}
			},

			setmoves(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				const targets = target.split('!').map(x => x.trim());
				petUser.load();
				target = targets[0];
				if (targets.length === 2 && petUser.onChangeMoves && petUser.onChangeMoves['selected'].length > 0) {
					const position = petUser.parsePosition(target);
					if (!position) return this.popupReply('位置不存在!');
					if (petUser.changeMoves(position)) petUser.save();
				}
				this.parse(`/pet box show new`);
				this.parse(`/pet box show ${target}`);
			},

			drop(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				const targets = target.split('!').map(x => x.trim());
				target = targets[0];
				petUser.load();
				const position = petUser.parsePosition(target);
				if (!position) return this.popupReply('位置不存在!');
				const set = petUser.checkPet(position);
				if (!set) return this.popupReply('位置是空的!');
				if (petUser.operation === 'drop' + target) {
					petUser.operation = undefined;
					if (targets.length === 2) {
						if (petUser.removePet(position, set.item)) {
							petUser.save();
						} else {
							this.popupReply('背包不能为空!');
						}
					}
				} else {
					petUser.operation = 'drop' + target;
				}
				this.parse(`/pet box show ${target}`);
			},

			async ex(target, room, user) {
				if (!(await addScore(user.name, 0))[0]) return this.popupReply("您没有国服积分, 不能与其他玩家交换宝可梦哦");
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				if (!petUser.onPosition) return this.popupReply("请先选中想要交换的宝可梦!");
				// 1. A按下[交换]: (A)/pet box ex  弹出交换提示
				// 2. A根据提示: (A)/pet box ex B  A.operation='readyexB'  A.title=请等待B回应,重新发送,取消
				//               B弹窗  B.operation='preexA'  B.title=接受与A交换,取消
				// 3. B按下[确认]: (B)/pet box ex A  if (A.operation='readyexB') => 执行交换操作 => A,B.operation=undefined
				if (!target) return this.popupReply("请输入: /ex 朋友的PSID");
				const friend = Users.get(target);
				if (!friend) return this.popupReply(`没有找到用户 ${target} !`)
				if (!(await addScore(friend.name, 0))[0]) return this.popupReply(`${friend.name}没有国服积分, 不能与您交换宝可梦哦`);
				const petFriend = getUser(friend.id);
				if (!petFriend.property) return this.popupReply(`${friend.name}还未领取最初的伙伴!`);
				if (petFriend.operation === `readyex${user.id}`) {
					if (!petFriend.onPosition) return this.popupReply(`${friend.name}还未选中想要交换的宝可梦!`);
					petUser.load();
					petFriend.load();
					const toSend = petUser.getPet();
					const toReceive = petFriend.getPet();
					const exResult = petUser.linkExchange(petFriend);
					if (typeof exResult === 'string') {
						this.popupReply(exResult);
					} else {
						this.popupReply(`您用 ${exResult['sent']} 与${friend.name}交换了 ${exResult['received']} !`)
						friend.popup(`您用 ${exResult['received']} 与${user.name}交换了 ${exResult['sent']} !`)
						FS(`${TRADELOGPATH}/${Utils.getDate()}.txt`).append(
							`${petUser.id}, ${petFriend.id}: ${toSend} <=> ${toReceive}\n`
						);
						petUser.save();
						petFriend.save();
					}
					petUser.operation = undefined;
					petFriend.operation = undefined;
					const friendRoom = Rooms.get(petFriend.chatRoomId);
					if (friendRoom) {
						friend.sendTo(friendRoom.roomid, `|uhtmlchange|pet-box-show|${petBox(
							petFriend,
							petFriend.onPosition ? Object.values(petFriend.onPosition).join(',') : ''
						)}`);
					}
				} else if (petFriend.operation) {
					return this.popupReply(`${friend.name}正在操作箱子, 请稍候`);
				} else {
					petUser.operation = `readyex${friend.id}`;
					friend.popup(`${user.name}想与您交换宝可梦! 快去盒子里看看吧!`);
					petFriend.operation = `preex${user.id}`;
				}
				this.parse(`/pet box show ${petUser.onPosition ? Object.values(petUser.onPosition).join(',') : ''}`);
			},

			nameguide(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				if (petUser.onPosition) this.popupReply("请输入: /name 昵称")
			},

			name(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				petUser.load();
				if (petUser.namePet(target)) {
					petUser.save();
					this.popupReply('修改成功!');
					this.parse(`/pet box show ${petUser.onPosition ? Object.values(petUser.onPosition).join(',') : ''}`);
				}
			},

			resetstat(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				let confirm = false;
				if (target.indexOf('!') >= 0) {
					confirm = true;
					target = target.split('!')[0];
				}
				const statPosition = Utils.parseStatPosition(target);
				if (!statPosition) return this.popupReply("Usage: /pet box resetstat [ivs|evs],[hp|atk|def|spa|spd|spe]!");
				if (confirm) {
					petUser.load();
					if (petUser.resetStat(statPosition)) {
						this.popupReply("修改成功!");
						petUser.operation = undefined;
						petUser.save();
					}
				} else {
					petUser.operation = `resetstat${statPosition['type']},${statPosition['index']}`
				}
				this.parse(`/pet box show ${petUser.onPosition ? Object.values(petUser.onPosition).join(',') : ''}`);
			},

			reset(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				petUser.operation = undefined;
				this.parse(`/pet box show ${target}`);
			},

			receive(target, room, user) {
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				const gift = new PetUser(user.id, GIFTPATH);
				if (!gift.property) return this.popupReply('没有可以领取的礼物!');

				petUser.load();
				const received = petUser.merge(gift);
				let replies = [];
				for (let itemname in received['items']) replies.push(`您获得了${received['items'][itemname]}个 ${itemname} !`);
				for (let petspecies of received['bag']) replies.push(`您获得了 ${petspecies} !`);
				if (gift.property['bag'].length > 0) {
					replies.push(`您的盒子没有空位了!`);
					gift.save();
				} else {
					gift.destroy();
				}
				petUser.save();
				this.popupReply(replies.join('\n'));
				this.parse(`/pet box show new`);
			},

			clear(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				petUser.onChangeMoves = undefined;
				if (target === 'new') {
					user.sendTo(room.roomid, `|uhtmlchange|pet-moves-show|`);
					user.sendTo(room.roomid, `|uhtmlchange|pet-moves-select|`);
					user.sendTo(room.roomid, `|uhtmlchange|pet-box-show|`);
				}
			},

		},

		lawn: {

			'': 'guide',
			guide(target, room, user) {
				this.parse('/pet help lawn');
			},

			search(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				petUser.chatRoomId = room.roomid;
				const bot = Users.get(BOTID);
				if (!bot || PetBattle.inBattle(user.id)) return this.popupReply(
					room.roomid === 'gym' ? "馆主离开了哦" : "没有发现野生的宝可梦哦"
				);
				const wantLegend = target.indexOf('!') >= 0 && !!PetBattle.legends[room.roomid];

				petUser.load();
				if (Date.now() - petUser.property['time']['search'] < LAWNCD) {
					return this.popupReply(`您的宝可梦累了, 请稍后再来!`);
				}
				let battleRoom: GameRoom | undefined;
				if (room.roomid === 'gym') {
					if (Date.now() - petUser.property['time']['gym'] < GYMCD) {
						return this.popupReply(`您在${Math.floor(GYMCD / 60000)}分钟内已挑战过道馆, 请稍后再来!`);
					}
					if (!PetBattle.gymConfig[target]) return this.parse('/pet help lawn');
					const userSets = petUser.property['bag'].filter((x: string) => x);
					const validateRes = PetBattle.validate(PetBattle.gymConfig[target]['userteam'], userSets);
					if (validateRes) return this.popupReply(`根据${target}道馆的要求, ${validateRes}!`);
					const rule = `gen8petmode @@@pschinapetmodegym`;
					const maxLevel = PetBattle.gymConfig[target]['maxlevel'];
					const userTeam = userSets.map(set => {
						const features = set.split('|');
						features[10] = (features[10] ? Math.min(maxLevel, parseInt(features[10])) : maxLevel).toString();
						return features.join('|');
					}).join(']');
					const botTeam = PetBattle.gymConfig[target]['botteam'];
					petUser.battleInfo = 'gym';
					FS(`${DEPOSITPATH}/${user.id}.txt`).safeWriteSync(target);
					battleRoom = PetBattle.createBattle(user, bot, userTeam, botTeam, rule, false);
					petUser.property['time']['gym'] = Date.now();
				} else if (PetBattle.bossConfig[target]) {
					const day = Utils.getDay();
					if (day <= petUser.property['time']['boss']) {
						return this.popupReply(`您今日已挑战过霸主宝可梦!`);
					}
					const rule = 'gen8petmodebossbattle';
					petUser.battleInfo = `boss${target}`;
					FS(`${DEPOSITPATH}/${user.id}.txt`).safeWriteSync(target);
					battleRoom = PetBattle.createBattle(user, bot, 'random', 'random', rule, false, 'multi');
					petUser.property['time']['boss'] = day;
				} else {
					const wildPokemon = Pet.wild(room.roomid, target, petUser.maxLevel(), petUser.levelRistriction(), wantLegend);
					if (!wildPokemon) return this.popupReply('这片草丛太危险了!');
					const rule = 'gen8petmode @@@pschinapetmodewild';
					petUser.battleInfo = wildPokemon + (wantLegend ? `<=${room.roomid}` : '');
					battleRoom = PetBattle.createBattle(user, bot, 'random', wildPokemon, rule, !wantLegend);
				}
				petUser.property['time']['search'] = Date.now();
				petUser.save();

				// if (wantLegend && battleRoom) {
				// 	room.add(`|html|<div style="text-align: center;"><a href='${battleRoom.roomid}'>` +
				// 		`${user.name} 开始了与 ${PetBattle.legends[room.roomid].split('|')[0]} 的战斗!</a></div>`).update();
				// }
			},

			ball(target, room, user) {
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				if (!room || !room.battle || !petUser.battleInfo) return this.popupReply("请在对战房间里捕捉宝可梦!");
				if (petUser.battleInfo === 'gym') return this.popupReply("不能捕捉道馆的宝可梦!");
				if (PetBattle.inBattle(user.id) !== room.roomid) return this.popupReply("没有可以捕捉的宝可梦!");
				petUser.load();
				const balls = petUser.balls();
				if (balls.length === 0) return this.popupReply(`您还没有可以使用的精灵球哦`);
				user.sendTo(room.roomid, `|uhtmlchange|pet-ball|`);
				if (target) {
					if (!petUser.removeItem(target, 1)) return this.popupReply(`您的背包里没有${target}!`);
					const parsed = petUser.battleInfo.split('<=');
					const features = parsed[0].split('|');
					const roomOfLegend = parsed[1];
					const foeLevel = parseInt(features[10]) || 100;
					const foeSpecies = features[1] || features[0];
					if (roomOfLegend && !PetBattle.legends[roomOfLegend]) {
						this.popupReply(`很遗憾, ${roomOfLegend} 房间里的 ${foeSpecies} 已经离开了。`);
						petUser.addItem(target, 1);
					} else if (!petUser.catch(target, !!roomOfLegend)) {
						this.popupReply(`捕获失败!`);
					} else if (!petUser.addPet(parsed[0])) {
						this.popupReply(`您的盒子里没有空位了!`);
						petUser.addItem(target, 1);
					} else {
						this.popupReply(`捕获成功! 快进入盒子查看吧!`);
						petUser.battleInfo = undefined;
						this.parse('/forfeit');
						petUser.addExperience(foeSpecies, foeLevel);
						if (roomOfLegend) {
							Rooms.get(roomOfLegend)?.add(`|uhtmlchange|pet-legend|`);
							Rooms.get(roomOfLegend)?.add(
								`|uhtml|pet-legend|<div class='broadcast-green' style="text-align: center;"><b>${
									user.name
								} 成功捕获了野生的 ${foeSpecies}!</b></div>`
							).update();
							delete PetBattle.legends[roomOfLegend];
						}
					}
					petUser.save();
				} else {
					user.sendTo(room.roomid, `|uhtml|pet-ball|${balls.map(item => Utils.button(
						`/pet lawn ball ${item}`, '', Utils.itemStyle(item)
					)).join(' ')}`);
				}
			},

			'gen': 'add',
			add(target, room, user) {
				this.checkCan('bypassall');
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				if (PetBattle.legends[room.roomid]) return this.popupReply(`${room.title} 房间里的宝可梦还未被捕获`);
				const targets = target.split(',');
				target = targets[0];
				const species = Dex.species.get(target);
				if (!species.exists) return this.popupReply(`Usage: /add 宝可梦, 等级, 闪光率, 梦特率`);
				const level = parseInt(targets[1]) || 70;
				const shiny = parseInt(targets[2]) || 0;
				const hidden = parseInt(targets[3]) || 0;
				const set = Pet.gen(species.id, level, true, 70, shiny, hidden);
				if (!set) return this.popupReply(`种类不合法`);
				const gender = set.split('|')[7];
				PetBattle.legends[room.roomid] = set;
				const legendStyle = 'font-size: 12pt; text-align: center; height: 170px';
				room.add(`|uhtmlchange|pet-legend|`);
				room.add(
					`|uhtml|pet-legend|<div class='broadcast-green' style="${legendStyle}">` +
					`<b>野生的 ${species.name} 出现了!</b><br/>` +
					`${Utils.image(
						`background: url(${set.split('|')[9] ? POKESPRITESSHINY : POKESPRITES}/${Pet.spriteId(target, gender)}.gif) ` +
						`no-repeat center; width: 100%; height: 120px`
					)}<br/>` +
					`${Utils.button('/pet lawn search !', '挑战!')}</div>`
				)
			},

			'rm': 'remove',
			remove(target, room, user) {
				this.checkCan('bypassall');
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				if (PetBattle.legends[room.roomid]) {
					room.add(`|uhtmlchange|pet-legend|`);
					room.add(`|uhtml|pet-legend|<div class='broadcast-green' style="text-align: center;">` +
						`<b>野生的 ${PetBattle.legends[room.roomid].split('|')[0]} 离开了。</b></div>`);
					delete PetBattle.legends[room.roomid];
					this.popupReply(`已删除 ${room.title} 房间里的宝可梦`);
				}
			},

		},

		shop: {

			'': 'shownew',
			shownew(target, room, user) {
				this.parse('/pet shop show new');
			},

			async show(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				petUser.chatRoomId = room.roomid;
				this.parse('/pet box clear new');
				this.parse(`/pet shop clear ${target}`);
				const targets = target.split('=>');
				const goodtype = Shop.types[targets[0]] ? targets[0] : 'ball';
				const goods = Shop.shopConfig[goodtype];
				const goodname = targets[1];
				let title = Object.keys(Shop.types).map(x => Utils.button(`/pet shop show ${x}`, Shop.types[x])).join('');
				if (goods[goodname]) {
					let price = goods[goodname];
					if (toID(goodname) === 'box') price *= petUser.getBoxPriceBase();
					if (price > 0) {
						title = `购买 ${goodname} ? ` +
							`(${price}积分/1个${Shop.goodDesc[goodname] ? `, 效果: ${Shop.goodDesc[goodname]}` : ''})<br/>` +
							Utils.button(`/pet shop buy ${goodtype}=>${goodname}!`, '购买5个!') +
							Utils.button(`/pet shop buy ${goodtype}=>${goodname}`, '购买1个') +
							Utils.button(`/pet shop show ${goodtype}`, '取消') +
							`<br/><br/>${title}`;
					} else {
						title = `领取5个 ${goodname} ?<br/>` +
							`${Utils.boolButtons(`/pet shop buy ${goodtype}=>${goodname}!`, `/pet shop show ${goodtype}`)}` +
							`<br/><br/>${title}`;
					}
				} else {
					title = `请选择商品:<br/>${title}`
				}
				title = `<div><b>${title}</b><br/><br/></div>`;
				user.sendTo(room.roomid, `|uhtml${target === 'new' ? '' : 'change'}|pet-shop-show|` +
					`${title}<div style="border: ridge;">${Shop.goodButtons[goodtype]}</div>` +
					`${Utils.button('/pet shop buy ball=>Poke Ball!', '领取5个精灵球!')}` +
					`${Utils.button('/pet shop draw', '领取随机道具!')}` +
					`${Utils.button(`/score pop`, '查看积分')}${Utils.button(`/pet box show new`, '返回')}`);
			},

			async buy(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				const targets = target.split('=>');
				const goodtype = targets[0];
				if (!Shop.types[goodtype]) return this.popupReply(`没有名为 ${goodtype} 的商品种类`);
				const goods = Shop.shopConfig[goodtype];
				let goodname = targets[1];
				const goodnames = goodname.split('!');
				goodname = goodnames[0];
				let num = goodnames.length > 1 ? 5 : 1;
				if (!goods[goodname]) return this.popupReply(`没有名为 ${goodname} 的${Shop.types[goodtype]}!`);
				if (toID(goodname) === 'box' && num > 1) return this.popupReply(`不可以一次性购买多个盒子!`);
				let price = goods[goodname];
				if (toID(goodname) === 'box') price *= petUser.getBoxPriceBase();
				petUser.load();
				if (price > 0) {
					const changeScores = await addScore(user.name, -price * num);
					if (changeScores.length !== 2) return this.popupReply(`积分不足!`);
					this.popupReply(`您获得了${num}个 ${goodname} ! 您现在的积分是: ${changeScores[1]}`);
				} else {
					if (Date.now() - petUser.property['time']['ball'] < BALLCD) {
						return this.popupReply(`您在${Math.floor(BALLCD / 60000)}分钟内已领取过 ${goodname} !`);
					}
					if (petUser.property['items'][goodname]) {
						let validNum = Math.min(num, 10 - petUser.property['items'][goodname]);
						if (num > validNum) {
							num = validNum;
							this.popupReply(`由于免费道具最多只能持有10个, 您领取了${num}个 ${goodname}`);
						}
					}
					if (num > 0) petUser.property['time']['ball'] = Date.now();
				}
				if (toID(goodname) === 'box') {
					petUser.addBox();
				} else {
					petUser.addItem(goodname, num);
				}
				petUser.save();
				this.parse('/pet box');
			},

			draw(target, room, user) {
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				petUser.load();
				const day = Utils.getDay();
				if (day <= petUser.property['time']['draw']) return this.popupReply("您今日已领取随机道具!");
				const randomItem = prng.sample(Object.keys(Shop.shopConfig['draw']));
				petUser.property['time']['draw'] = day;
				petUser.addItem(randomItem, 1);
				petUser.save();
				this.popupReply(`您获得了1个 ${randomItem}!`);
				this.parse(`/pet box`);
			},

			clear(target, room, user) {
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				if (target === 'new') {
					user.sendTo(room.roomid, `|uhtmlchange|pet-shop-show|`);
				}
			}

		},

		admin: {

			edit(target, room, user) {
				this.checkCan('bypassall');
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const targets = target.split('=>');
				target = targets.slice(1).join('=>');
				const petUser = getUser(Users.get(targets[0])?.id || user.id);
				if (!petUser.property) return this.popupReply(`${petUser.id}还未领取最初的伙伴!`);
				petUser.load();
				user.sendTo(room.roomid, `|uhtmlchange|pet-edit|`);
				if (target) {
					switch (target.split('!').length) {
						case 2:
							return user.sendTo(
								room.roomid,
								`|uhtml|pet-edit|确认删除?&emsp;` +
								`${Utils.boolButtons(`/pet admin edit ${petUser.id}=>!!`, `/pet admin edit ${petUser.id}`)}`
							);
						case 3:
							dropUser(petUser.id);
							petUser.destroy();
							return this.popupReply(`用户数据已删除`);
						default:
							if (petUser.editProperty(target)) {
								petUser.save();
								const userChatRoom = Rooms.get(petUser.chatRoomId);
								if (userChatRoom) {
									Users.get(petUser.id)?.sendTo(userChatRoom, `|uhtmlchange|pet-box-show|${petBox(
										petUser,
										petUser.onPosition ? Object.values(petUser.onPosition).join(',') : ''
									)}`);
								}
								return this.popupReply(`修改成功!`);
							} else {
								this.popupReply(`格式错误!`);
							}
					}
				}
				user.sendTo(room.roomid, `|uhtml|pet-edit|${petUser.id}的盒子:<br/>` + 
					`<input type="text" style="width: 100%" value='${JSON.stringify(petUser.property)}'/>` +
					`修改盒子: /edit ${petUser.id}=>{"bag":["宝可梦1",...],"box":["宝可梦2",...],"items":{"道具1":数量1,...}}<br/>` +
					`添加宠物: /edit ${petUser.id}=>宝可梦` +
					`生成宠物: /genpoke 种类, 等级(, fullivs, shiny, hidden)<br/>` +
					Utils.button(`/pet admin edit ${petUser.id}=>!`, '删除用户数据')
				);
			},

			restore(target, room, user) {
				this.checkCan('bypassall');
				if (!room) return this.popupReply("请在房间里使用宠物系统");
				const targetUser = Users.get(target);
				if (!targetUser) return this.popupReply(`没有找到用户${target}!`);
				const petUser = getUser(targetUser.id);
				if (!petUser.property) return this.popupReply(`${petUser.id}还未领取最初的伙伴!`);
				if (!petUser.restoreProperty()) return this.popupReply(`没有找到用户${target}的备份数据!`);
				petUser.save();
				this.popupReply("用户数据恢复成功!");
			},

			editgym(target, room, user) {
				this.checkCan('bypassall');
				const targets = target.split('=>');
				if (targets.length !== 2) return this.sendReply('/editgym 道馆名=>队伍');
				if (!PetBattle.gymConfig[targets[0]]) return this.popupReply(`没有名为 ${targets[0]} 的道馆!`)
				PetBattle.gymConfig[targets[0]]['botteam'] = targets[1];
				FS('config/pet-mode/gym-config.js').writeSync(
					'exports.PetModeGymConfig = ' + JSON.stringify(PetBattle.gymConfig, null, '\t')
				);
				this.popupReply('修改成功!');
			},

			genpoke(target, room, user) {
				const targets = target.split(',').map(x => x.trim());
				if (targets.length < 2) return this.errorReply("Usage: /genpoke 种类, 等级(, fullivs, shiny, hidden)");
				const speciesid = targets[0];
				const level = parseInt(targets[1]);
				if (!Dex.species.get(speciesid).exists) return this.errorReply(`没有找到名为 ${targets[0]} 的宝可梦!`);
				if (!level) return this.errorReply("请输入正整数等级!");
				const fullivs = target.indexOf("fullivs") >= 0;
				const shiny = target.indexOf("shiny") >= 0;
				const hidden = target.indexOf("hidden") >= 0;
				const set = Pet.gen(speciesid, level, fullivs, 70, shiny ? 1 : 0, hidden ? 1 : 0);
				this.sendReply(set);
			},

			gift(target, room, user) {
				this.checkCan('bypassall');
				if (!target) return this.popupReply("请输入: /gift 用户id");
				const petUser = getUser(user.id);
				if (!petUser.property) return this.popupReply("您还未领取最初的伙伴!");
				if (!petUser.onPosition) return this.popupReply("请先选中想要赠送的宝可梦!");
				if (!checkUser(target)) return this.popupReply(`未找到用户 ${target} !`);
				if (target.indexOf('!') < 0) {
					petUser.operation = `gift${target}`;
				} else {
					const rcverId = toID(target);
					const pet = petUser.getPet();
					const gift = new PetUser(rcverId, GIFTPATH);
					if (!gift.property) gift.init();
					gift.addPet(pet);
					gift.save();
					petUser.removePet(petUser.onPosition);
					petUser.save();
					delete petUser.operation;
					Users.get(rcverId)?.popup(`${user.name}赠送给您一只宝可梦! 请输入/pet点击领取礼物`);
				}
				this.parse(`/pet box show ${petUser.onPosition ? Object.values(petUser.onPosition).join(',') : ''}`);
			},

		},

		'': 'help',
		'guide': 'help',
		help(target, room, user) {
			if (!room) return this.popupReply("请在房间里使用宠物系统");
			user.sendTo(room.roomid, `|uhtmlchange|pet-welcome|`);
			let buttons = [];
			if (target !== 'lawn') {
				buttons.push(['<b>欢迎来到Pokemon Showdown China宠物系统!</b>']);
				if (!getUser(user.id).property) {
					buttons[0].push(Utils.button('/pet init', '领取最初的伙伴!'));
				}
				buttons.push([
					Utils.button('/pet box', '盒子'),
					Utils.button('/pet shop', '商店'),
					`<a href="/gym"><button class="button">道馆</button></a>`,
				]);
				if (PetBattle.legends[room.roomid]) {
					buttons[0].push(Utils.button('/pet lawn search !', `挑战房间里的 ${
						PetBattle.legends[room.roomid].split('|')[0]
					} !`));
				}
				if (FS( `${GIFTPATH}/${user.id}.json`).existsSync()) {
					buttons[0].push(Utils.button('/pet box receive', '领取礼物!'));
				}
			}
			if (PetBattle.roomConfig[room.roomid]) {
				buttons.push([
					'<b>去邂逅野生的宝可梦吧!</b>',
					`<a href="/${PetBattle.previousRoom[room.roomid] || 'skypillar'}">上一个房间</a>`,
					`<a href="/${PetBattle.nextRoom[room.roomid] || 'skypillar'}">下一个房间</a>`,
				]);
				buttons.push(Object.keys(PetBattle.roomConfig[room.roomid]['lawn']).map(
					lawnid => Utils.button(`/pet lawn search ${lawnid}`, lawnid)
				));
			} else if (room.roomid === 'gym') {
				buttons.push(['<b>去道馆证明自己的实力吧!</b>']);
				buttons.push(Object.keys(PetBattle.gymConfig).map(
					gymid => Utils.button(`/pet lawn search ${gymid}`, `${gymid}道馆`)
				));
			} else {
				buttons.push(['<b>这个房间没有野生的宝可梦哦</b>']);
			}
			user.sendTo(room.roomid, `|uhtml|pet-welcome|${buttons.map(line => line.join(' ')).join('<br/>')}`);
		}

	}

}