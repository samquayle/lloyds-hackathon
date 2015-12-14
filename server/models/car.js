var mongoose = require('mongoose');

module.exports = mongoose.model('car', {
    make: String,
    model: String,
    year: Date
});