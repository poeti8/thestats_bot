const User = require('../models/user');

const handleAdd = (ctx) => {
    User.findOne({ userId: ctx.message.from.id }, function (err, user) {
        if (user) {
            user.state.add = true;
            user.save().then(item => {
                return ctx.replyWithMarkdown('Please enter the username of the channel. \n\nFor example *@example*');
            });;
        } else {
            const newUser = new User({
                userId: ctx.message.from.id,
                name: `${ctx.message.from.first_name} ${ctx.message.from.last_name}`,
                username: ctx.message.from.username,
                state: {
                    add: true
                },
                channels: [],
            });
            newUser.save().then(item => {
                return ctx.replyWithMarkdown('Please enter the username of the channel. \n\nFor example *@example*');
            });
        }
    });
}

module.exports = handleAdd;