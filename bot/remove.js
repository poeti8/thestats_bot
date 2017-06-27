const { Markup } = require('telegraf');
const User = require('../models/user');

const handleRemove = (ctx) => {
    User.findOne({ userId: ctx.message.from.id }, function (err, user) {
		if (err) throw err;
		if (!user || user.channels.length < 1) {
			return ctx.reply('Your channel list is empty!\n\nUse /add command to add channels.');
		}
		const buttons = user.channels.map(channel => {
			return [Markup.callbackButton(`❌ ${channel.id}`, `remove-${channel.id}`)];
		});
		return ctx.reply('Select a channel to be removed.', Markup.inlineKeyboard(buttons).extra());
	});
}

module.exports = handleRemove;