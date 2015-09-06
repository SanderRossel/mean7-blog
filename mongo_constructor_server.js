var app = require('express')();
var MongoClient = require('mongodb').MongoClient;

var Artist = function (name, activeFrom, activeTo) {
    if (!(this instanceof Artist)) {
       return new Artist(name, activeFrom, activeTo);
    }
    var self = this;
    self.name = name;
    self.activeFrom = activeFrom;
    self.activeTo = activeTo;
    self.yearsActive = function () {
        if (self.activeTo) {
            return self.activeTo - self.activeFrom;
        } else {
            return new Date().getFullYear() - self.activeFrom;
        }
    };
};

var url = 'mongodb://localhost:27017/local';
MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log(err);
    } else {
        var collection = db.collection('artists');
        // Empty the collection
        // so the next examples can be run more than once.
        collection.deleteMany();
        
        var massiveAttack = new Artist('Massive Attack', 1988);
        console.log('\n\n' + massiveAttack.name + ' has been active for ' + massiveAttack.yearsActive() +  ' years.');
        
        collection.insertOne(massiveAttack);
        
        collection.findOne({ name: massiveAttack.name }, function (err, result) {
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

var server = app.listen(80, '127.0.0.1');