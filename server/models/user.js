var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    cars: [carschema]
});

var carschema = new Schema({
    make: String,
    model: String,
    year: Date
});

module.exports = mongoose.model('User', UserSchema);
