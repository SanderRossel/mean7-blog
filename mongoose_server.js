var app = require('express')();
var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/local';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', function (err) {
    console.log(err);
});
db.once('open', function (callback) {
    var artistSchema = mongoose.Schema({
        name: String,
        activeFrom: Number,
        activeTo: Number
    });
    artistSchema.methods.yearsActive = function () {
        var self = this;
        if (self.activeTo) {
            return self.activeTo - self.activeFrom;
        } else {
            return new Date().getFullYear() - self.activeFrom;
        }
    };
    
    var Artist = mongoose.model('Artist', artistSchema);
    
    // Empty the collection
    // so the next examples can be run more than once.
    Artist.collection.remove();
    var massiveAttack = new Artist({ name: 'Massive Attack', activeFrom: 1988 });
    console.log('\n\n' + massiveAttack.name + ' has been active for ' + massiveAttack.yearsActive() +  ' years.');
    
    massiveAttack.save(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            Artist.findOne({ name: massiveAttack.name }, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    try {
                        console.log('\n\n' + result.name + ' has been active for ' + result.yearsActive() +  ' years.');
                    } catch (ex) {
                        console.log(ex);
                    }
                }
            });
        }
    });
});

var server = app.listen(80, '127.0.0.1');