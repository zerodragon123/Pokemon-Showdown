import { FS } from "../../lib";
import { NetRequest } from "../../lib/net";

const FORUMS_URL = 'http://47.94.147.145';
const TOPIC_KEYS = ['中国队', '报名', '公开赛', '地域赛', '联赛', '大联盟', '大满贯', '锦标赛', '季赛', 'PL', 'ShinxCup', 'Suspect'];
const INTRO_FOLDER = 'config/ps-china/intro';
const INTRO_MSG_TYPES = ['PS China Guide', 'PS China BGM', 'PS China Intro'];

export const loginMsgs: {[msgType: string]: string} = {};
INTRO_MSG_TYPES.forEach(msgType => loadMsgType(msgType));
loadPSChinaNews(true);

function loadMsgType(msgType: string) {
	loginMsgs[msgType] = FS(`${INTRO_FOLDER}/${msgType.toLowerCase().replace(/\s/g, '-')}.html`).readIfExistsSync().replace(/[\n|\t]/g, '');
}

async function getRecentTopics(): Promise<{[index: string]: string}> {
	const topics: {[index: string]: string} = {};
	let recentPage = await new NetRequest(`${FORUMS_URL}/recent`).get();
	let tagIndex = recentPage.indexOf(`<a href="/topic/`);
	while (tagIndex >= 0) {
		recentPage = recentPage.slice(tagIndex);
		const tagSplitIndex = recentPage.indexOf(`">`);
		const href = recentPage.slice(16, tagSplitIndex);
		const num = href.split('/')[0];
		recentPage = recentPage.slice(tagSplitIndex + 2);
		const tagEndIndex = recentPage.indexOf(`</a>`);
		const title = recentPage.slice(0, tagEndIndex);
		if (!title.startsWith('<i')) topics[num] = title;
		recentPage = recentPage.slice(tagEndIndex + 4);
		tagIndex = recentPage.indexOf(`<a href="/topic/`);
	}
	return topics;
}

async function loadPSChinaNews(update: boolean = false): Promise<string[]> {
	const tags = Object.entries(await getRecentTopics())
	.filter(([num, title]) => TOPIC_KEYS.some(key => title.includes(key)))
	.map(([num, title]) => `<p><a href="${FORUMS_URL}/topic/${num}">${title}</a></p>`);
	if (update) updatePSChinaGuide(tags);
	return tags;
}

function updatePSChinaGuide(tags: string[]) {
	loadMsgType('PS China Guide');
	loginMsgs['PS China Guide'] = loginMsgs['PS China Guide'].replace('{}', tags.join(''));
}

export const commands: Chat.ChatCommands = {
	pschinaforums: {
		'ln': 'loadnews',
		async loadnews(target, room, user) {
			this.checkCan('lock');
			const tags = await loadPSChinaNews();
			updatePSChinaGuide(tags);
			this.sendReplyBox(`<details><summary><b>已读取${tags.length}个最新活动</b></summary>${tags.join('')}</details>`);
		}
	}
}
