const moment = require('moment');
const User = require('../models/user');
const Channel = require('../models/channel');

const handleAdd = require('./add');
const handleRemove = require('./remove');
const getStats = require('./stats');

const handleText = async (ctx) => {
	switch (ctx.message.text) {
		case '📊 stats':
			return getStats(ctx);
		case '➕ add':
			return handleAdd(ctx);
		case '✖️ remove':
			return handleRemove(ctx);
	}
    const user = await User.findOne({ id: ctx.message.from.id });
	try {
		if (!user || !user.state.add) {
			return ctx.reply(`What are you trying to do? \n\nUse /help if you need some.`);
		}

		if (user.channels.length >= 3) {
			user.state.add = false;
			return ctx.reply(`Sorry, you can't add more than 3 channels. You can remove channels by /remove command.`);
		}

		if (!/^@/.test(ctx.message.text) || /\s/.test(ctx.message.text)) {
			return ctx.replyWithMarkdown('The username you sent was not valid. \n\nIt should be like *@example*');
		}
		const channel = await Channel.findOne({ id: ctx.message.text });

		if (channel) {
			for (let i = 0; i < user.channels.length; i++) {
				if (user.channels[i] === ctx.message.text) {
					return ctx.replyWithMarkdown(`The channel *${ctx.message.text}* already exist in your list.`);
				}
			}
		} else {
			const count = await ctx.telegram.getChatMembersCount(ctx.message.text);
			newChannel = new Channel({
				id: ctx.message.text,
				stats: [{
					date: moment().format(),
					count
				}]
			});
			await newChannel.save();
		}
		user.channels.push(ctx.message.text);
		user.state.add = false;
		await user.save();
		return ctx.replyWithMarkdown(`✅ The channel *${ctx.message.text}* has been added to your list. \n\nNow we collect its data once in a day.\n\nUse /stats command to get the stats.`);
	}
	catch(err) {
		console.log(err);
		return ctx.reply(`The channel does not exist!`);
	}
}

module.exports = handleText;