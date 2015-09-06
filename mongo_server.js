var app = require('express')();
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/local';
MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log(err);
    } else {
        var collection = db.collection('artists');
        // Empty the collection
        // so the next examples can be run more than once.
        collection.deleteMany();
        
        var artist = {
            name: 'Massive Attack',
            countryCode: 'GB'
        };
        collection.insertOne(artist, function (err, result) {
            console.log('\n\nInserted one artist:');
            if (err) {
                console.log(err);
            } else {
                console.log(result.ops);
            }
        });
        
        collection.findOne({ name: 'Massive Attack' }, function (err, artist) {
            console.log('\n\nFound one artist:');
            if (err) {
                console.log(err);
            } else {
                console.log(artist);
            }
        });
        
        collection.insertMany([
        {
            name: 'The Beatles',
            countryCode: 'GB',
            members: [
                'John Lennon',
                'Paul McCartney',
                'George Harrison',
                'Ringo Starr'
            ]
        },
        {
            name: 'Justin Bieber',
            countryCode: 'No one wants him'
        },
        {
            name: 'Metallica',
            countryCode: 'USA'
        },
        {
            name: 'Lady Gaga',
            countryCode: 'USA'
        }
        ], function (err, result) {
            console.log('\n\nInserted many artists:');
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
        
        var findCallback = function (err, artists) {
            if (err) {
                console.log(err);
            } else {
                console.log('\n\nFound artists:');
                artists.forEach(function (a) {
                    console.log(a);
                });
            }
        };
        
        // All documents.
        collection.find().toArray(findCallback);
        
        // Name not equal to Justin Bieber.
        collection.find({ name: { $ne: 'Justin Bieber' } }).toArray(findCallback);
        
        // Name equal to Massive Attach or name equal to The Beatles.
        collection.find({ $or: [{ name: 'Massive Attack' }, { name: 'The Beatles' }] }).toArray(findCallback);
        
        // Members contains John Lennon.
        collection.find({ members: 'John Lennon' }).toArray(findCallback);
        
        collection.findOneAndUpdate({ name: 'Massive Attack' },
            { $set: {
                cds: [
                    {
                        title: 'Collected',
                        year: 2006,
                        label: {
                            name: 'Virgin'
                        },
                        comment: 'Best Of'
                    },
                    {
                        title: 'Mezzanine',
                        year: 1998,
                        label: 'Virgin'
                    },
                    {
                        title: 'No Protection: Massive Attack v Mad Professor',
                        year: 1995,
                        label: 'Circa Records',
                        comment: 'Remixes'
                    },
                    {
                        title: 'Protection',
                        year: 1994,
                        label: {
                            name: 'Circa'
                        }
                    }
                ]
                }
            }, function (err, result) {
            console.log('\n\nUpdated artist:');
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
        
        collection.findOneAndDelete({ name: 'Justin Bieber' }, function (err, result) {
            console.log('\n\nDeleted artist:');
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
    }
});

var server = app.listen(80, '127.0.0.1');