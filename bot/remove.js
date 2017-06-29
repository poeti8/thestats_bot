const { Markup } = require('telegraf');
const User = require('../models/user');

const handleRemove = async (ctx) => {
    const user = await User.findOne({ id: ctx.message.from.id });
	try {
		if (!user || user.channels.length < 1) {
			return ctx.reply('Your channel list is empty!\n\nUse /add command to add channels.');
		}
		const buttons = user.channels.map(channel => {
			return [Markup.callbackButton(`❌ ${channel}`, `remove-${channel}`)];
		});
		return ctx.reply('Select a channel to be removed.', Markup.inlineKeyboard(buttons).extra());
	}
	catch(err) {
		console.log(err);
	}
}

module.exports = handleRemove;