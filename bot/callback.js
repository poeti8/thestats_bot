const { Markup, Extra } = require('telegraf');
const User = require('../models/user');

const { getDataDaily, getDataMonthly } = require('../date/getData');
const createChart = require('../chart/createChart');

const handleCallback = (ctx) => {
	const [type, data] = ctx.update.callback_query.data.split('-');
	const id = ctx.update.callback_query.from.id;

	User.findOne({ userId: id }, function (err, user) {
		if (err) throw err;
		if (!user || user.channels.length < 1) {
			return ctx.reply('The channel does not exist in your list.');
		}

		let index;
		user.channels.forEach((item, i) => {
			if (item.id === data) {
				index = i;
			}
		});
		if (index === undefined) {
			return ctx.reply('The channel does not exist in your list.');
		}

		switch (type) {
			case 'remove':
				user.channels.splice(index, 1);
				user.save().then(item => {
					ctx.answerCallbackQuery('Removed successfully!')
					return ctx.editMessageText(`❌ The channel *${data}* has been removed from your list.`, Extra.markdown());
				});

				break;

			case 'stats':
				return ctx.editMessageText(`How do you want to get stats?`, Markup.inlineKeyboard([
					[Markup.callbackButton('Daily', 'daily-' + data), Markup.callbackButton('Monthly', 'monthly-' + data)],
				]).extra());

			case 'daily':
				const dailyStats = getDataDaily(user.channels[index]);
				createChart(user.channels[index].id, dailyStats).then(item => {
					return ctx.replyWithPhoto({ source: item }, { caption: `via @thestats_bot` });
				});
				break;
			case 'monthly':
				const monthlyStats = getDataMonthly(user.channels[index]);
				createChart(user.channels[index], monthlyStats).then(item => {
					return ctx.replyWithPhoto({ source: item }, { caption: `via @thestats_bot` });
				});
				break;
			default:
				return ctx.replyWithMarkdown(`An error occurred. Please report the report and try again.`);
		}
	});
}

module.exports = handleCallback;