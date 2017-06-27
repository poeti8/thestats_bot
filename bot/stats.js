const { Markup } = require('telegraf');
const User = require('../models/user');

const getStats = (ctx) => {
    User.findOne({ userId: ctx.message.from.id }, function (err, user) {
        if (err) throw err;
        if (!user || user.channels.length < 1) {
            return ctx.reply('Your channel list is empty!\n\nUse /add command to add channels.');
        }
        const buttons = user.channels.map(channel => {
            return [Markup.callbackButton(channel.id, `stats-${channel.id}`)];
        });
        return ctx.reply('Select a channel to view stats.', Markup.inlineKeyboard(buttons).extra());
    });
}

module.exports = getStats;