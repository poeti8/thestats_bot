const moment = require('moment');

const sleep = (ms = 1000) =>
	new Promise(resolve =>
		setTimeout(resolve, ms));

async function getUpdate(bot, channel) {
	const count = await bot.telegram.getChatMembersCount(channel.id);
	channel.stats.push({
		date: moment().format(),
		count
	});
	await channel.save();
}
	
async function getAllUpdates(bot, channels) {
	while (channels.length > 0) {
		await getUpdate(bot, channels.shift());
		await sleep(1000);
	}
}

module.exports = getAllUpdates;