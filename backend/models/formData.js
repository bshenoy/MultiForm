const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formDataSchema = new Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    alternateContactNumber: { type: String, required: true },
    dob: { type: Date, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    maritalStatus: { type: String, required: true },
    nationality: { type: String, required: true },
    bloodGroup: { type: String, required: true }
});

module.exports = mongoose.model('FormData', formDataSchema);