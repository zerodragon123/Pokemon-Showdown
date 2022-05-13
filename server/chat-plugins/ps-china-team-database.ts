import { FS } from "../../lib";
import { NetRequest } from "../../lib/net";
import { PetUtils } from "./ps-china-pet-mode";

const TEAM_DATABASE_DIR = 'config/ps-china/team-db/gen8ou';
const SIGNIFICANT_POKES_FILE = `${TEAM_DATABASE_DIR}/pokes.json`;
const REPLAY_URLS_FILE = `${TEAM_DATABASE_DIR}/replay-urls.txt`;
const TEAM_DATABASE_FILE = `${TEAM_DATABASE_DIR}/teams.json`;

if (!FS(TEAM_DATABASE_DIR).existsSync()) FS(TEAM_DATABASE_DIR).mkdirpSync();
if (!FS(TEAM_DATABASE_FILE).existsSync()) FS(TEAM_DATABASE_FILE).writeSync('[]');

let teamDB: {
	"teamCode": number[],
	"players": [{"playerId": string, "replays": string[]}]
}[] = JSON.parse(FS(TEAM_DATABASE_FILE).readIfExistsSync());

let pokeNum = 0;
let pokeIndex: {[speciesId: string]: number} = {};
if (FS(SIGNIFICANT_POKES_FILE).existsSync()) {
	JSON.parse(FS(SIGNIFICANT_POKES_FILE).readIfExistsSync()).forEach((speciesId: string) => {
		pokeIndex[speciesId] = pokeNum;
		pokeNum += 1;
	})
} else {
	Dex.species.all().forEach((species) => {
		if (['OU', 'UUBL', 'UU', 'RUBL', 'RU'].includes(species.tier) || ['urshifu', 'kyurem'].includes(species.id)) {
			pokeIndex[species.id] = pokeNum;
			pokeNum += 1;
		}
	});
	FS(SIGNIFICANT_POKES_FILE).writeSync(JSON.stringify(Object.keys(pokeIndex)));
}
const teamCodeLength = Math.ceil(pokeNum / 31);

function getTeamCode(team: string[]): number[] {
	let teamCode: number[] = new Array(teamCodeLength).fill(0);
	for (let speciesId of team) {
		if (pokeIndex[speciesId] !== undefined) {
			teamCode[Math.floor(pokeIndex[speciesId] / 31)] += 1 << (pokeIndex[speciesId] % 31);
		}
	}
	return teamCode;
}

function findTeamIndex(targetTeamCode: number[]): number {
	for (let i = 0; i < teamDB.length; i++) {
		const teamCode = teamDB[i]['teamCode'];
		for (let j = 0; j < teamCodeLength; j++) {
			if (teamCode[j] ^ targetTeamCode[j]) {
				continue;
			}
		}
		return i;
	}
	return -1;
}

async function updateTeamDB(replayUrl: string): Promise<boolean> {
	try {
		const replayStr = await new NetRequest(replayUrl).get();
		for (let side of ['p1', 'p2']) {
			let s = replayStr.split(`|player|${side}|`).slice(1);
			const playerId = toID(s.slice(0, s.indexOf('|')));
			const team = []
			for (let s of replayStr.split(`|poke|${side}|`).slice(1)) {
				let speciesId = toID(s.slice(0, s.indexOf('|')).split(',')[0]);
				team.push(speciesId);
			}
			const teamCode = getTeamCode(team);
			const teamIndex = findTeamIndex(teamCode);
			if (teamIndex < 0) {
				teamDB.push({
					'teamCode': teamCode,
					'players': [{
						'playerId': playerId,
						'replays': [replayUrl]
					}]
				});
			} else {
				let newPlayer = true;
				for (let playerIndex = 0; playerIndex < teamDB[teamIndex]['players'].length; playerIndex++) {
					teamDB[teamIndex]['players'][playerIndex]['replays'].push(replayUrl);
					newPlayer = false;
				}
				if (newPlayer) {
					teamDB[teamIndex]['players'].push({
						'playerId': playerId,
						'replays': [replayUrl]
					});
				}
			}
		}
	} catch (err) {
		return false;
	}
	return true;
}

async function saveTeamDB(): Promise<boolean> {
	try {
		FS(TEAM_DATABASE_FILE).writeSync(PetUtils.formatJSON(teamDB));
	} catch (err) {
		return false;
	}
	return true;
}

export const commands: Chat.ChatCommands = {
	teamdb: {
		async update(target, room, user) {
			this.requireRoom();
			this.checkCan('lockdown');
			if (!FS(REPLAY_URLS_FILE).existsSync()) {
				this.errorReply('Replay URL file not found.');
			} else {
				const replayUrls = FS(REPLAY_URLS_FILE).readIfExistsSync().split('\n');
				for (let i = 0; i < replayUrls.length; i++) {
					user.sendTo(room!.roomid, `|uhtml|teamdb-load|Loading ${i} / ${replayUrls.length}`);
					const success = await updateTeamDB(replayUrls[i]);
					if (!success) this.errorReply(`Failed to load replay: ${replayUrls[i]}`);
				}
				const success = await saveTeamDB();
				if (success) {
					FS(REPLAY_URLS_FILE).unlinkIfExistsSync();
					user.sendTo(room!.roomid, `|uhtmlchange|teamdb-load|`);
					this.sendReply(`Finished. Replay URL file deleted.`);
				} else {
					this.errorReply(`Failed to save team database.`);
				}
			}
		}
	}
}