const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const ChannelSchema = new Schema({
    id: { type: String, required: true },
    stats: { type: Array, required: true }
});

const Channel = mongoose.model('Channel', ChannelSchema);

module.exports = Channel;