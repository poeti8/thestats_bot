const User = require('../models/user');

const handleAdd = async (ctx) => {
    const user = await User.findOne({ userId: ctx.message.from.id })
    try {
        if (user) {
            user.state.add = true;
            await user.save();
            return ctx.replyWithMarkdown('Please enter the username of the channel. \n\nFor example *@example*');
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
            await newUser.save();
            return ctx.replyWithMarkdown('Please enter the username of the channel. \n\nFor example *@example*');
        }
    } 
    catch(e) {
        console.log(e);
    }
    
}

module.exports = handleAdd;