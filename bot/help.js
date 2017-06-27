const { Markup } = require('telegraf');

const handleHelp = (ctx) => {
    return ctx.replyWithMarkdown(`*The Stats* collects daily data for your channel. Available commands:

/add
Add channels. (up to 3)

/remove
Remove channels and their data.

/stats
Get stats. 

The data will be updated once in a day (24:00, GMT+1:00)
    
Source code on [GitHub](https://github.com/poeti8/thestats_bot).`, {disable_web_page_preview: true}, Markup.keyboard([
        ['📊 stats', '➕ add', '✖️ remove']
    ]).resize().extra()
    );
}

module.exports = handleHelp;