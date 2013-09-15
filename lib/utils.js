var fs = require('fs');

var countries = require('country-data').countries;


// http://stackoverflow.com/questions/7428235/how-to-print-json-object-content-in-node-js
function prettyJSON(obj) {
    console.log(JSON.stringify(obj, null, 4));
}
exports.prettyJSON = prettyJSON;

function read(name, filter, cb) {
    fs.readFile(name, {
        encoding: 'utf8'
    }, function(err, d) {
        if(err) return cb(err);

        cb(null, filter(d));
    });
}
exports.read = read;

function findAlpha3(name) {
    for(var code in countries) {
        var country = countries[code];

        if(country.name == name && code) return country.alpha3;
    }
}
exports.findAlpha3 = findAlpha3;

function id(a) {return a;}
exports.id = id;

function prop(name) {
    return function(v) {
        return v[name];
    };
}
exports.prop = prop;
