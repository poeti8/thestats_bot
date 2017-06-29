const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id: { type: String, required: true },
    name: String,
    username: String,
    channels: Array,
    state: {
        add: false
    }    
});

UserSchema.method('addChannel', function(channel, count) {
    this.channels.push({
        id: channel,
        stats: [{
            date: moment(),
            count
        }]
    });
    return this.channels;
});

const User = mongoose.model('User', UserSchema);

module.exports = User;