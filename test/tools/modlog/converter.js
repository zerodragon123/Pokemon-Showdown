"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
/**
 * Converts modlogs between text and SQLite; also modernizes old-format modlogs
 * @author Annika
 * @author jetou
 */

	describe('log modernizer', () => {
		it('should ignore logs that are already modernized', () => {
			const modernLogs = [
				'[2020-08-23T19:50:49.944Z] (development) ROOMMODERATOR: [annika] by annika',
				'[2020-08-23T19:45:24.326Z] (help-uwu) NOTE: by annika: j',
				'[2020-08-23T19:45:32.346Z] (battle-gen8randombattle-5348538495) NOTE: by annika: k',
				'[2020-08-23T19:48:14.823Z] (help-uwu) TICKETCLOSE: by annika',
				'[2020-08-23T19:48:14.823Z] (development) ROOMBAN: [sometroll] alts:[alt1], [alt2] ac:[autoconfirmed] [127.0.0.1] by annika: never uses the room for development',
				'[2018-01-18T14:30:02.564Z] (tournaments) TOUR CREATE: by ladymonita: gen7randombattle',
				`[2014-11-24T11:10:34.798Z] (lobby) NOTE: by joimnotesyakcity: lled by his friends`,
				`[2015-03-18T20:56:19.462Z] (lobby) WARN: [peterpablo] by xfix (Frost was banned for a reason - don't talk about Frost.)`,
				`[2015-10-23T19:13:58.190Z] (lobby) NOTE: by imas234: [2015-07-31 01:54pm] (lobby) Tru identity was locked from talking by Trickster. (bad Chingu)  uh....`,
				`[2015-11-27T12:26:15.741Z] (lobby) NOTE: by theraven: Arik Ex was banned under Eastglo`,
				`[2018-01-07T07:13:10.279Z] (lobby) NOTE: by gentlejellicent: Ah, you changed the staffintro to have bloodtext in it`,
				garfieldCopypasta,
			];
			for (const log of modernLogs) {
				assert.equal(converter.modernizeLog(log), log);
			}
		});

		it('should correctly parse old-format promotions and demotions', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) [annika] was promoted to Voice by [heartofetheria].'),
				'[2020-08-23T19:50:49.944Z] (development) GLOBAL VOICE: [annika] by heartofetheria'
			);

			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) ([annika] was demoted to Room regular user by [heartofetheria].)'),
				'[2020-08-23T19:50:49.944Z] (development) ROOMREGULAR USER: [annika] by heartofetheria: (demote)'
			);
			assert.equal(
				converter.modernizeLog(`[2017-05-31T22:00:33.159Z] (espanol) vodsrtrainer MAR cos was demoted to Room regular user by [blazask].`),
				`[2017-05-31T22:00:33.159Z] (espanol) ROOMREGULAR USER: [vodsrtrainermarcos] by blazask: (demote)`
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) ([annika] was demoted to Room Moderator by [heartofetheria].)'),
				'[2020-08-23T19:50:49.944Z] (development) ROOMMODERATOR: [annika] by heartofetheria: (demote)'
			);

			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) [annika] was appointed Room Owner by [heartofetheria].'),
				'[2020-08-23T19:50:49.944Z] (development) ROOMOWNER: [annika] by heartofetheria'
			);
		});

		it('should correctly parse entries about modchat and modjoin', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) ([annika] set modchat to autoconfirmed)'),
				'[2020-08-23T19:50:49.944Z] (development) MODCHAT: by annika: to autoconfirmed'
			);

			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) Annika set modjoin to +.'),
				'[2020-08-23T19:50:49.944Z] (development) MODJOIN: by annika: +'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) Annika turned off modjoin.'),
				'[2020-08-23T19:50:49.944Z] (development) MODJOIN: by annika: OFF'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) Annika set modjoin to sync.'),
				'[2020-08-23T19:50:49.944Z] (development) MODJOIN SYNC: by annika'
			);
		});

		it('should correctly parse modnotes', () => {
			assert.equal(
				converter.modernizeLog(`[2020-08-23T19:50:49.944Z] (development) ([annika] notes: I'm making a modnote)`),
				`[2020-08-23T19:50:49.944Z] (development) NOTE: by annika: I'm making a modnote`
			);
			assert.equal(
				converter.modernizeLog(`[2017-10-04T20:48:14.592Z] (bigbang) (Lionyx notes: test was banned by lionyx`),
				`[2017-10-04T20:48:14.592Z] (bigbang) NOTE: by lionyx: test was banned by lionyx`
			);
		});

		it('should correctly parse userids containing `notes`', () => {
			assert.equal(
				converter.modernizeLog(`[2014-11-24T11:10:34.798Z] (lobby) ([joimnotesyakcity] was trolled by his friends)`),
				`[2014-11-24T11:10:34.798Z] (lobby) [joimnotesyakcity] was trolled by his friends`
			);
		});

		it('should correctly parse roomintro and staffintro entries', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) (Annika changed the roomintro.)'),
				'[2020-08-23T19:50:49.944Z] (development) ROOMINTRO: by annika'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) (Annika changed the staffintro.)'),
				'[2020-08-23T19:50:49.944Z] (development) STAFFINTRO: by annika'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) (Annika deleted the roomintro.)'),
				'[2020-08-23T19:50:49.944Z] (development) DELETEROOMINTRO: by annika'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) (Annika deleted the staffintro.)'),
				'[2020-08-23T19:50:49.944Z] (development) DELETESTAFFINTRO: by annika'
			);
		});

		it('should correctly parse room description changes', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) ([annika] changed the roomdesc to: "a description".)'),
				'[2020-08-23T19:50:49.944Z] (development) ROOMDESC: by annika: to "a description"'
			);
		});

		it('should correctly parse declarations', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) Annika declared I am declaring something'),
				'[2020-08-23T19:50:49.944Z] (development) DECLARE: by annika: I am declaring something'
			);

			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) Annika declared: I am declaring something'),
				'[2020-08-23T19:50:49.944Z] (development) DECLARE: by annika: I am declaring something'
			);

			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) Annika globally declared (chat level) I am chat declaring something'),
				'[2020-08-23T19:50:49.944Z] (development) CHATDECLARE: by annika: I am chat declaring something'
			);

			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) Annika globally declared I am globally declaring something'),
				'[2020-08-23T19:50:49.944Z] (development) GLOBALDECLARE: by annika: I am globally declaring something'
			);
		});

		it('should correctly parse entries about roomevents', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) (Annika edited the roomevent titled "Writing Unit Tests".)'),
				'[2020-08-23T19:50:49.944Z] (development) ROOMEVENT: by annika: edited "Writing Unit Tests"'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) (Annika removed a roomevent titled "Writing Unit Tests".)'),
				'[2020-08-23T19:50:49.944Z] (development) ROOMEVENT: by annika: removed "Writing Unit Tests"'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) (Annika added a roomevent titled "Writing Unit Tests".)'),
				'[2020-08-23T19:50:49.944Z] (development) ROOMEVENT: by annika: added "Writing Unit Tests"'
			);
		});

		it('should correctly parse old-format tournament modlogs', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (tournaments) ([annika] created a tournament in randombattle format.)'),
				'[2020-08-23T19:50:49.944Z] (tournaments) TOUR CREATE: by annika: randombattle'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (tournaments) ([heartofetheria] was disqualified from the tournament by Annika)'),
				'[2020-08-23T19:50:49.944Z] (tournaments) TOUR DQ: [heartofetheria] by annika'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (tournaments) (The tournament auto disqualify timeout was set to 2 by Annika)'),
				'[2020-08-23T19:50:49.944Z] (tournaments) TOUR AUTODQ: by annika: 2'
			);
		});

		it('should correctly parse old-format roombans', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) [heartofetheria] was banned from room development by annika'),
				'[2020-08-23T19:50:49.944Z] (development) ROOMBAN: [heartofetheria] by annika'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) [heartofetheria] was banned from room development by annika (reason)'),
				'[2020-08-23T19:50:49.944Z] (development) ROOMBAN: [heartofetheria] by annika: reason'
			);
			assert.equal(
				converter.modernizeLog(`[2015-06-07T13:44:30.057Z] (shituusers) ROOMBAN: [eyan] (You have been kicked by +Cynd(~'e')~quil. Reason: Undefined) by shituubot`),
				`[2015-06-07T13:44:30.057Z] (shituusers) ROOMBAN: [eyan] by shituubot: You have been kicked by +Cynd(~'e')~quil. Reason: Undefined`
			);
		});

		it('should correctly parse old-format blacklists', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) [heartofetheria] was blacklisted from Development by Annika.'),
				'[2020-08-23T19:50:49.944Z] (development) BLACKLIST: [heartofetheria] by annika'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) [heartofetheria] was blacklisted from Development by Annika. (reason)'),
				'[2020-08-23T19:50:49.944Z] (development) BLACKLIST: [heartofetheria] by annika: reason'
			);

			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) [heartofetheria] was nameblacklisted from Development by Annika.'),
				'[2020-08-23T19:50:49.944Z] (development) NAMEBLACKLIST: [heartofetheria] by annika'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) [heartofetheria] was nameblacklisted from Development by Annika. (reason)'),
				'[2020-08-23T19:50:49.944Z] (development) NAMEBLACKLIST: [heartofetheria] by annika: reason'
			);
		});

		it('should correctly parse old-format mutes', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) [heartofetheria] was muted by annikafor1hour (reason)'),
				'[2020-08-23T19:50:49.944Z] (development) HOURMUTE: [heartofetheria] by annika: reason'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) heartofetheria was muted by Annika for 1 hour (reason)'),
				'[2020-08-23T19:50:49.944Z] (development) HOURMUTE: [heartofetheria] by annika: reason'
			);
			assert.equal(
				converter.modernizeLog('[2016-09-27T18:25:55.574Z] (swag) harembe⚠ was muted by rubyfor1hour (harembe was promoted to ! by ruby.)'),
				'[2016-09-27T18:25:55.574Z] (swag) HOURMUTE: [harembe] by ruby: harembe was promoted to ! by ruby.'
			);
		});

		it('should correctly parse old-format weeklocks', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) heartofetheria was locked from talking for a week by annika (reason) [IP]'),
				'[2020-08-23T19:50:49.944Z] (development) WEEKLOCK: [heartofetheria] [IP] by annika: reason'
			);
		});

		it('should correctly parse old-format global bans', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) [heartofetheria] was banned by annika (reason) [IP]'),
				'[2020-08-23T19:50:49.944Z] (development) BAN: [heartofetheria] [IP] by annika: reason'
			);
		});

		it('should correctly parse alts using nextLine', () => {
			assert.equal(
				converter.modernizeLog(
					'[2020-08-23T19:50:49.944Z] (development) heartofetheria was locked from talking for a week by annika (reason)',
					`[2020-08-23T19:50:49.944Z] (development) ([heartofetheria]'s locked alts: [annika0], [hordeprime])`
				),
				'[2020-08-23T19:50:49.944Z] (development) WEEKLOCK: [heartofetheria] alts: [annika0], [hordeprime] by annika: reason'
			);

			assert.equal(
				converter.modernizeLog(
					'[2020-08-23T19:50:49.944Z] (development) [heartofetheria] was banned from room development by annika',
					`[2020-08-23T19:50:49.944Z] (development) ([heartofetheria]'s banned alts: [annika0], [hordeprime])`
				),
				'[2020-08-23T19:50:49.944Z] (development) ROOMBAN: [heartofetheria] alts: [annika0], [hordeprime] by annika'
			);

			assert.equal(
				converter.modernizeLog(
					'[2020-08-23T19:50:49.944Z] (development) [heartofetheria] was blacklisted from Development by Annika.',
					`[2020-08-23T19:50:49.944Z] (development) ([heartofetheria]'s blacklisted alts: [annika0], [hordeprime])`
				),
				'[2020-08-23T19:50:49.944Z] (development) BLACKLIST: [heartofetheria] alts: [annika0], [hordeprime] by annika'
			);
		});

		it('should correctly parse poll modlogs', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) ([apoll] was started by [annika].)',),
				'[2020-08-23T19:50:49.944Z] (development) POLL: by annika'
			);

			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (development) ([thepoll] was ended by [annika].)',),
				'[2020-08-23T19:50:49.944Z] (development) POLL END: by annika'
			);
		});

		it('should correctly parse Trivia modlogs', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (trivia) (User annika won the game of Triumvirate mode trivia under the All category with a cap of 50 points, with 50 points and 10 correct answers! Second place: heartofetheria (10 points), third place: hordeprime (5 points))'),
				'[2020-08-23T19:50:49.944Z] (trivia) TRIVIAGAME: by unknown: User annika won the game of Triumvirate mode trivia under the All category with a cap of 50 points, with 50 points and 10 correct answers! Second place: heartofetheria (10 points), third place: hordeprime (5 points)'
			);
		});

		it('should handle claiming helptickets', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (help-heartofetheria) Annika claimed this ticket.'),
				'[2020-08-23T19:50:49.944Z] (help-heartofetheria) TICKETCLAIM: by annika'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (help-heartofetheria) This ticket is now claimed by Annika.'),
				'[2020-08-23T19:50:49.944Z] (help-heartofetheria) TICKETCLAIM: by annika'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (help-heartofetheria) This ticket is now claimed by [annika]'),
				'[2020-08-23T19:50:49.944Z] (help-heartofetheria) TICKETCLAIM: by annika'
			);
		});

		it('should handle closing helptickets', () => {
			// Abandonment
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (help-heartofetheria) This ticket is no longer claimed.'),
				'[2020-08-23T19:50:49.944Z] (help-heartofetheria) TICKETUNCLAIM'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (help-heartofetheria) Heart of Etheria is no longer interested in this ticket.'),
				'[2020-08-23T19:50:49.944Z] (help-heartofetheria) TICKETABANDON: by heartofetheria'
			);

			// Closing
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (help-heartofetheria) Annika closed this ticket.'),
				'[2020-08-23T19:50:49.944Z] (help-heartofetheria) TICKETCLOSE: by annika'
			);

			// Deletion
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (help-heartofetheria) Annika deleted this ticket.'),
				'[2020-08-23T19:50:49.944Z] (help-heartofetheria) TICKETDELETE: by annika'
			);
		});

		it('should handle opening helptickets', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (help-heartofetheria) Heart of Etheria opened a new ticket. Issue: Being trapped in a unit test factory'),
				'[2020-08-23T19:50:49.944Z] (help-heartofetheria) TICKETOPEN: by heartofetheria: Being trapped in a unit test factory'
			);
		});

		it('should handle Scavengers modlogs', () => {
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (scavengers) SCAV SETHOSTPOINTS: [room: subroom] by annika: 42'),
				'[2020-08-23T19:50:49.944Z] (scavengers) SCAV SETHOSTPOINTS: by annika: 42 [room: subroom]'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (scavengers) SCAV TWIST: [room: subroom] by annika: your mom'),
				'[2020-08-23T19:50:49.944Z] (scavengers) SCAV TWIST: by annika: your mom [room: subroom]'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (scavengers) SCAV SETPOINTS: [room: subroom] by annika: ååååååå'),
				'[2020-08-23T19:50:49.944Z] (scavengers) SCAV SETPOINTS: by annika: ååååååå [room: subroom]'
			);
			assert.equal(
				converter.modernizeLog('[2020-08-23T19:50:49.944Z] (scavengers) ([annika] has been caught attempting a hunt with 2 connections on the account. The user has also been given 1 infraction point on the player leaderboard.)'),
				'[2020-08-23T19:50:49.944Z] (scavengers) SCAV CHEATER: [annika]: caught attempting a hunt with 2 connections on the account; has also been given 1 infraction point on the player leaderboard'
			);
			// No moderator actions containing has been caught trying to do their own hunt found on room scavengers.
			// Apparently this never got written to main's modlog, so I am not going to write a special test case
			// and converter logic for it.
		});

		it('should handle Wi-Fi modlogs', () => {
			assert.equal(
				converter.modernizeLog(`[2020-08-23T19:50:49.944Z] (wifi) GIVEAWAY WIN: Annika won Heart of Etheria's giveaway for a "deluxe shitposter 1000" (OT: Entrapta TID: 1337)`),
				`[2020-08-23T19:50:49.944Z] (wifi) GIVEAWAY WIN: [annika]: Heart of Etheria's giveaway for a "deluxe shitposter 1000" (OT: Entrapta TID: 1337)`
			);
			assert.equal(
				converter.modernizeLog(`[2020-08-23T19:50:49.944Z] (wifi) GTS FINISHED: Annika has finished their GTS giveaway for "deluxe shitposter 2000"`),
				`[2020-08-23T19:50:49.944Z] (wifi) GTS FINISHED: [annika]: their GTS giveaway for "deluxe shitposter 2000"`
			);
		});

		it('should handle global declarations mentioning promotions correctly', () => {
			assert.equal(
				converter.modernizeLog(`[2015-07-21T06:04:54.369Z] (lobby) xfix declared GrumpyGungan was promoted to a global voice, feel free to congratulate him :-).`),
				`[2015-07-21T06:04:54.369Z] (lobby) DECLARE: by xfix: GrumpyGungan was promoted to a global voice, feel free to congratulate him :-).`
			);
		});
	});

	describe('text entry to ModlogEntry converter', () => {
		it('should correctly parse modernized promotions and demotions', () => {
			assert.deepEqual(
				converter.parseModlog(`[2020-08-23T19:50:49.944Z] (development) ROOMMODERATOR: [annika] by heartofetheria`),
				{
					action: 'ROOMMODERATOR', roomID: 'development', userid: 'annika',
					isGlobal: false, loggedBy: 'heartofetheria', time: 1598212249944,
					alts: [], autoconfirmedID: null, ip: null, note: '', visualRoomID: '',
				}
			);

			assert.deepEqual(
				converter.parseModlog(`[2020-08-23T19:50:49.944Z] (development) ROOMVOICE: [annika] by heartofetheria: (demote)`),
				{
					action: 'ROOMVOICE', roomID: 'development', userid: 'annika',
					isGlobal: false, loggedBy: 'heartofetheria', note: '(demote)', time: 1598212249944,
					alts: [], autoconfirmedID: null, ip: null, visualRoomID: '',
				}
			);
		});

		it('should not mess up HIDEALTSTEXT', () => {
			// HIDEALTSTEXT apparently was causing bugs
			assert.deepEqual(
				converter.parseModlog(`[2020-08-23T19:50:49.944Z] (development) HIDEALTSTEXT: [auser] alts:[alt1] by annika: hnr`),
				{
					action: 'HIDEALTSTEXT', roomID: 'development', userid: 'auser', alts: ['alt1'],
					note: 'hnr', isGlobal: false, loggedBy: 'annika', time: 1598212249944,
					autoconfirmedID: null, ip: null, visualRoomID: '',
				}
			);
		});

		it('should correctly parse modernized punishments, including alts/IP/autoconfirmed', () => {
			assert.deepEqual(
				converter.parseModlog(`[2020-08-23T19:50:49.944Z] (development) WEEKLOCK: [gejg] ac: [annika] alts: [annalytically], [heartofetheria] [127.0.0.1] by somemod: terrible user`),
				{
					action: 'WEEKLOCK', roomID: 'development', userid: 'gejg', autoconfirmedID: 'annika', alts: ['annalytically', 'heartofetheria'],
					ip: '127.0.0.1', isGlobal: false, loggedBy: 'somemod', note: 'terrible user', time: 1598212249944, visualRoomID: '',
				}
			);
			assert.deepEqual(
				converter.parseModlog(`[2020-08-23T19:50:49.944Z] (development) WEEKLOCK: [gejg] ac:[annika] alts:[annalytically], [heartofetheria] [127.0.0.1] by somemod: terrible user`),
				{
					action: 'WEEKLOCK', roomID: 'development', userid: 'gejg', autoconfirmedID: 'annika', alts: ['annalytically', 'heartofetheria'],
					ip: '127.0.0.1', isGlobal: false, loggedBy: 'somemod', note: 'terrible user', time: 1598212249944, visualRoomID: '',
				}
			);


			assert.deepEqual(
				converter.parseModlog(`[2020-08-23T19:50:49.944Z] (development) WEEKLOCK: [gejg] alts:[annalytically] [127.0.0.1] by somemod: terrible user`),
				{
					action: 'WEEKLOCK', roomID: 'development', userid: 'gejg', alts: ['annalytically'],
					ip: '127.0.0.1', isGlobal: false, loggedBy: 'somemod', note: 'terrible user', time: 1598212249944,
					autoconfirmedID: null, visualRoomID: '',
				}
			);

			assert.deepEqual(
				converter.parseModlog(`[2020-08-23T19:50:49.944Z] (development) WEEKLOCK: [gejg] [127.0.0.1] by somemod: terrible user`),
				{
					action: 'WEEKLOCK', roomID: 'development', userid: 'gejg',
					ip: '127.0.0.1', isGlobal: false, loggedBy: 'somemod', note: 'terrible user', time: 1598212249944,
					alts: [], autoconfirmedID: null, visualRoomID: '',
				}
			);
		});

		it('should correctly parse modnotes', () => {
			assert.deepEqual(
				converter.parseModlog(`[2020-08-23T19:50:49.944Z] (development) NOTE: by annika: HELP! I'm trapped in a unit test factory...`),
				{
					action: 'NOTE', roomID: 'development', isGlobal: false, loggedBy: 'annika',
					note: `HELP! I'm trapped in a unit test factory...`, time: 1598212249944,
					alts: [], autoconfirmedID: null, ip: null, userid: null, visualRoomID: '',
				}
			);
		});

		it('should correctly parse visual roomids', () => {
			const withVisualID = converter.parseModlog(`[time] (battle-gen7randombattle-1 tournament: development) SOMETHINGBORING: by annika`);
			assert.equal(withVisualID.visualRoomID, 'battle-gen7randombattle-1 tournament: development');
			assert.equal(withVisualID.roomID, 'battle-gen7randombattle-1');

			const noVisualID = converter.parseModlog(`[time] (battle-gen7randombattle-1) SOMETHINGBORING: by annika`);
			assert.equal(noVisualID.visualRoomID, '');
		});

		it('should properly handle OLD MODLOG', () => {
			assert.deepEqual(
				converter.parseModlog(`[2014-11-20T13:46:00.288Z] (lobby) OLD MODLOG: by unknown: [punchoface] would be muted by [thecaptain] but was already muted.)`),
				{
					action: 'OLD MODLOG', roomID: 'lobby', isGlobal: false, loggedBy: 'unknown',
					note: `[punchoface] would be muted by [thecaptain] but was already muted.)`, time: 1416491160288,
					alts: [], autoconfirmedID: null, ip: null, userid: null, visualRoomID: '',
				}
			);
		});

		it('should correctly handle hangman', () => {
			assert.deepEqual(
				converter.parseModlog(`[2020-09-19T23:25:24.908Z] (lobby) HANGMAN: by archastl`),
				{
					action: 'HANGMAN', roomID: 'lobby', isGlobal: false, loggedBy: 'archastl', time: 1600557924908,
					alts: [], autoconfirmedID: null, ip: null, note: '', userid: null, visualRoomID: '',
				}
			);
		});

		it('should correctly handle nonstandard alt formats', () => {
			assert.deepEqual(
				converter.parseModlog(
					`[2018-01-18T19:47:11.404Z] (battle-gen7randombattle-690788015) AUTOLOCK: [trreckko] alts:[MasterOP13, [luckyfella], Derp11223, [askul], vfffgcfvgvfghj, trreckko, MrShnugglebear] [127.0.0.1]: Pornhub__.__com/killyourself`
				).alts,
				['masterop13', 'luckyfella', 'derp11223', 'askul', 'vfffgcfvgvfghj', 'trreckko', 'mrshnugglebear']
			);

			assert.deepEqual(
				converter.parseModlog(
					`[2018-01-20T10:19:19.763Z] (battle-gen7randombattle-691544312) AUTOLOCK: [zilgo] alts:[[ghjkjguygjbjb], zilgo] [127.0.0.1]: www__.__pornhub__.__com`
				).alts,
				['ghjkjguygjbjb', 'zilgo']
			);
		});

		it('should correctly handle modlog entries with an IP but no userid', () => {
			assert.deepEqual(
				converter.parseModlog(`[2020-09-30T20:02:12.456Z] (lobby) SHAREDIP: [127.0.0.1] by annika: j`),
				{
					action: 'SHAREDIP', roomID: 'lobby', isGlobal: false, loggedBy: 'annika',
					note: `j`, time: 1601496132456, ip: "127.0.0.1", alts: [], autoconfirmedID: null,
					userid: null, visualRoomID: '',
				}
			);
			assert.deepEqual(
				converter.parseModlog(`[2020-09-30T20:02:12.456Z] (lobby) UNSHAREDIP: [127.0.0.1] by annika`),
				{
					action: 'UNSHAREDIP', roomID: 'lobby', isGlobal: false, loggedBy: 'annika', time: 1601496132456, ip: "127.0.0.1",
					alts: [], autoconfirmedID: null, note: '', userid: null, visualRoomID: '',
				}
			);
		});

		it('should correctly handle trivia', () => {
			assert.deepEqual(
				converter.parseModlog(`[2020-09-19T23:25:24.908Z] (trivia) TRIVIAGAME: by snowjy: User one for my baby won the game of Timer mode trivia under the Sub-Category 2 category with no score cap, with 69 points and 19 correct answers Second place: Mystiphox (45 points), third place: Mukund (41 points)`),
				{
					action: 'TRIVIAGAME', roomID: 'trivia', isGlobal: false, loggedBy: 'snowjy', time: 1600557924908,
					alts: [], autoconfirmedID: null, ip: null, note: 'User one for my baby won the game of Timer mode trivia under the Sub-Category 2 category with no score cap, with 69 points and 19 correct answers Second place: Mystiphox (45 points), third place: Mukund (41 points)', userid: null, visualRoomID: '',
				}
			);
		});
	});

	describe('ModlogEntry to text converter', () => {
		it('should handle all fields of the ModlogEntry object', () => {
			const entry = {
				action: 'UNITTEST',
				roomID: 'development',
				userid: 'annika',
				autoconfirmedID: 'heartofetheria',
				alts: ['googlegoddess', 'princessentrapta'],
				ip: '127.0.0.1',
				isGlobal: false,
				loggedBy: 'yourmom',
				note: 'Hey Adora~',
				time: 1598212249944,
			};
			assert.equal(
				converter.rawifyLog(entry),
				`[2020-08-23T19:50:49.944Z] (development) UNITTEST: [annika] ac: [heartofetheria] alts: [googlegoddess], [princessentrapta] [127.0.0.1] by yourmom: Hey Adora~\n`
			);
		});

		it('should handle OLD MODLOG', () => {
			assert.deepEqual(
				converter.rawifyLog({
					action: 'OLD MODLOG', roomID: 'development', isGlobal: false, loggedBy: 'unknown',
					note: `hello hi test`, time: 1598212249944, alts: [],
				}),
				`[2020-08-23T19:50:49.944Z] (development) OLD MODLOG: by unknown: hello hi test\n`,
			);
		});

		it('should handle hangman', () => {
			assert.deepEqual(
				converter.rawifyLog({action: 'HANGMAN', roomID: 'lobby', isGlobal: false, loggedBy: 'archastl', time: 1600557924908, alts: []}),
				`[2020-09-19T23:25:24.908Z] (lobby) HANGMAN: by archastl\n`
			);
		});
	});

		it('should correctly handle modlog entries with an IP but no userid', () => {
			assert.deepEqual(
				converter.parseModlog(`[2020-09-30T20:02:12.456Z] (lobby) SHAREDIP: [127.0.0.1] by annika: j`),
				{
					action: 'SHAREDIP', roomID: 'lobby', isGlobal: false, loggedBy: 'annika',
					note: `j`, time: 1601496132456, ip: "127.0.0.1",
				}
			);
			assert.deepEqual(
				converter.parseModlog(`[2020-09-30T20:02:12.456Z] (lobby) UNSHAREDIP: [127.0.0.1] by annika`),
				{
					action: 'UNSHAREDIP', roomID: 'lobby', isGlobal: false, loggedBy: 'annika',
					time: 1601496132456, ip: "127.0.0.1",
				}
			);
		});
	});

	describe('ModlogEntry to text converter', () => {
		it('should handle all fields of the ModlogEntry object', () => {
			const entry = {
				action: 'UNITTEST',
				roomID: 'development',
				userid: 'annika',
				autoconfirmedID: 'heartofetheria',
				alts: ['googlegoddess', 'princessentrapta'],
				ip: '127.0.0.1',
				isGlobal: false,
				loggedBy: 'yourmom',
				note: 'Hey Adora~',
				time: 1598212249944,
			};
			assert.equal(
				converter.rawifyLog(entry),
				`[2020-08-23T19:50:49.944Z] (development) UNITTEST: [annika] ac: [heartofetheria] alts: [googlegoddess], [princessentrapta] [127.0.0.1] by yourmom: Hey Adora~\n`
			);
		});

		it('should handle OLD MODLOG', () => {
			assert.deepEqual(
				converter.rawifyLog({
					action: 'OLD MODLOG', roomID: 'development', isGlobal: false, loggedBy: 'unknown',
					note: `hello hi test`, time: 1598212249944,
				}),
				`[2020-08-23T19:50:49.944Z] (development) OLD MODLOG: by unknown: hello hi test\n`,
			);
		});

		it('should handle hangman', () => {
			assert.deepEqual(
				converter.rawifyLog({action: 'HANGMAN', roomID: 'lobby', isGlobal: false, loggedBy: 'archastl', time: 1600557924908}),
				`[2020-09-19T23:25:24.908Z] (lobby) HANGMAN: by archastl\n`
			);
		});
	});

			const readStream = _fs.FS.call(void 0, `${this.inputDir}/${file}`).createReadStream();
			for await (const line of readStream.byLine()) {
				const entry = parseModlog(line, lastLine, roomid === 'global');
				lastLine = line;
				if (!entry) continue;
				const rawLog = rawifyLog(entry);
				if (roomid !== 'global') entries.push(rawLog);
				if (entry.isGlobal) {
					globalEntries.push(rawLog);
				}
				if (entries.length === ENTRIES_TO_BUFFER) await insertEntries();
			}
		});

		it('multiline entries should be reversible', () => {
			const originalConvert = converter.rawifyLog(converter.parseModlog(
				`[2014-11-20T16:30:17.661Z] (lobby) LOCK: [violight] (spamming) by joim`,
				`[2014-11-20T16:30:17.673Z] (lobby) (violight's ac account: violight)`
			)).replace('\n', '');
			assert.equal(originalConvert, converter.rawifyLog(converter.parseModlog(originalConvert)).replace('\n', ''));
		});
	});

	describe.skip('integration tests', () => {
		it('should convert from SQLite to text', async () => {
			const modlog = new ml.Modlog('/dev/null', ':memory:', true);
			const mlConverter = new converter.ModlogConverterSQLite('', '', modlog.database);

			modlog.initialize('development');

			const entry = {
				action: 'UNITTEST',
				roomID: 'development',
				userid: 'annika',
				autoconfirmedID: 'heartofetheria',
				alts: ['googlegoddess', 'princessentrapta'],
				ip: '127.0.0.1',
				isGlobal: false,
				loggedBy: 'yourmom',
				note: 'Write 1',
				time: 1598212249944,
			};
			modlog.write('development', entry);
			entry.time++;
			entry.note = 'Write 2';
			modlog.write('development', entry);
			entry.time++;
			entry.note = 'Write 3';
			modlog.write('development', entry);
			modlog.write('development', {
				action: 'GLOBAL UNITTEST',
				roomID: 'development',
				userid: 'annika',
				autoconfirmedID: 'heartofetheria',
				alts: ['googlegoddess', 'princessentrapta'],
				ip: '127.0.0.1',
				isGlobal: true,
				loggedBy: 'yourmom',
				note: 'Global test',
				time: 1598212249947,
			});
		}
	}
} exports.ModlogConverter = ModlogConverter;

