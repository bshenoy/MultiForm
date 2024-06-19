const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formDataSchema = new Schema({
    userId: { type: String, required: true },
    data: { type: Object, required: true }
});

module.exports = mongoose.model('FormData', formDataSchema);
