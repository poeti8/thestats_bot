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

const User = mongoose.model('User', UserSchema);

module.exports = User;