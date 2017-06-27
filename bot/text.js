const moment = require('moment');
const User = require('../models/user');

const handleAdd = require('./add');
const handleRemove = require('./remove');
const getStats = require('./stats');

const handleText = (ctx) => {
	switch (ctx.message.text) {
		case '📊 stats':
			return getStats(ctx);
		case '➕ add':
			return handleAdd(ctx);
		case '✖️ remove':
			return handleRemove(ctx);
	}
    User.findOne({ userId: ctx.message.from.id }, function (err, user) {
		if (!user || !user.state.add) {
			return ctx.reply(`What are you trying to do? \n\nUse /help if you need some.`);
		}

		if (user.channels.length >= 3) {
			state.add = false;
			return ctx.reply(`Sorry, you can't add more than 3 channels. You can remove channels by /remove command.`);
		}

		if (!/^@/.test(ctx.message.text) || /\s/.test(ctx.message.text)) {
			return ctx.replyWithMarkdown('The username you sent was not valid. \n\nIt should be like *@example*');
		}

		ctx.telegram.getChatMembersCount(ctx.message.text)
			.then(count => {
				for (let i = 0; i < user.channels.length; i++) {
					if (user.channels[i].id === ctx.message.text) {
						return ctx.replyWithMarkdown(`The channel *${ctx.message.text}* already exist in your list.`);
					}
				}

				user.channels.push({
					id: ctx.message.text,
					stats: [{
						date: moment().format(),
						count
					}]
				});

				user.state.add = false;

				user.save().then(item => {
					return ctx.replyWithMarkdown(`✅ The channel *${ctx.message.text}* has been added to your list. \n\nNow we collect its data once in a day.\n\nUse /stats command to get the stats.`);
				});
			})
			.catch(err => {
				return ctx.reply('The channel you entered does not exist!');
			});
	});
}

module.exports = handleText;