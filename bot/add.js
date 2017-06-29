const User = require('../models/user');

const handleAdd = async (ctx) => {
    const user = await User.findOne({ id: ctx.message.from.id })
    try {
        if (user) {
            user.state.add = true;
            await user.save();
            return ctx.replyWithMarkdown('Please enter the username of the channel. \n\nFor example *@example*');
        } else {
            const firstName = ctx.message.from.first_name || '';
            const lastName = ctx.message.from.last_name || '';

            const newUser = new User({
                id: ctx.message.from.id,
                name: `${firstName} ${lastName}`,
                username: ctx.message.from.username,
                channels: [],
                state: {
                    add: true
                }
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