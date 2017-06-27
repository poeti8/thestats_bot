require('dotenv').config();
const Telegraf = require('telegraf');
const moment = require('moment');
const config = require('./config');
const User = require('./models/user');

const handleHelp = require('./bot/help');
const handleAdd = require('./bot/add');
const handleRemove = require('./bot/remove');
const handleText = require('./bot/text');
const handleCallback = require('./bot/callback');
const getStats = require('./bot/stats');

// connect mongoose to mongodb server
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURL);

// create Telegraf bot
const bot = new Telegraf(config.botToken);

setTimeout(() => {
	setInterval(() => {
		User.find({}, function (err, users) {
			if (err) throw err;
			if (users) {
				users.forEach(user => {
					user.channels.forEach(channel => {
						bot.telegram.getChatMembersCount(channel.id).then(count => {
							channel.stats.push({
								date: moment().format(),
								count
							});
							User.findOneAndUpdate({ userId: user.userId }, user, function (err, res) { });
						})
					});
				});
			}
		})
	}, 1000 * 60 * 60 * 24);
}, moment().set('hour', 24) - moment());

bot.command(['start', 'help'], handleHelp);
bot.command('add', handleAdd);
bot.command('remove', handleRemove);
bot.command('stats', getStats);
bot.on('callback_query', handleCallback);
bot.on('text', handleText);


bot.startPolling();