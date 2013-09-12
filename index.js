#!/usr/bin/env node
var fs = require('fs');

var is = require('annois');
var async = require('async');
var cheerio = require('cheerio');
var countries = require('country-data').countries;


main();

function main() {
    async.parallel([lte, lteNetworks], function(err, d) {
        if(err) return console.error(err);

        var result = {};

        for(var model in d[0]) {
            var bands = d[0][model];
            result[model] = {};

            for(var country in d[1]) {
                var b = d[1][country];
                var countryCode;

                if(country == 'Bolivia') country = 'Bolivia, Plurinational State Of';
                if(country == 'Tanzania') country = 'Tanzania, United Republic Of';
                if(country == 'Venezuela') country = 'Venezuela, Bolivarian Republic Of';
                if(country == 'U.S. Virgin Islands') country = 'Virgin Islands (US)';
                if(country == 'South Korea') country = 'Korea, Republic Of';
                if(country == 'Russia') country = 'Russian Federation';

                countryCode = findCountryCode(country);

                if(!countryCode) {
                    console.warn('Missing country code for ' + country);
                }
                else {
                    b.forEach(function(v) {
                        if(bands.indexOf(v) >= 0) {
                            if(!(countryCode in result[model])) result[model][countryCode] = [];
                            if(result[model][countryCode].indexOf(v) == -1) result[model][countryCode].push(v);
                        }
                    });
                }
            }
        }

        prettyJSON(result);
    });
}

function findCountryCode(name) {
    for(var code in countries) {
        var country = countries[code];

        if(country.name == name && code) return country.alpha3;
    }

    if(name == 'United Kingdom') return 'GBR';
}

function lte(cb) {
    fs.readFile('lte.html', {
        encoding: 'utf8'
    }, function(err, data) {
        if(err) return cb(err);

        cb(null, scrapeLte(data));
    });
}

function lteNetworks(cb) {
    fs.readFile('lte_networks.html', {
        encoding: 'utf8'
    }, function(err, data) {
        if(err) return cb(err);

        cb(null, scrapeLteNetworks(data));
    });
}

function scrapeLteNetworks(data) {
    var ret = {};
    var $ = cheerio.load(data);

    $('.wikitable tr').each(function(i, tr) {
        var name, band;

        if(i > 0) $('td', $(tr)).each(function(i, td) {
            var itext = $('i', $(td)).text();
            var text;

            if(itext) text = itext;
            else text = $(td).text();

            if(i == 1) name = text.trim();
            if(i == 3 && text.indexOf('?') == -1 && text.indexOf('N/A') == -1) {
                if(text.indexOf(' or ') >= 0) band = text.split(' or ');
                else band = text;
            }
            if(i == 5) {
                if(text.indexOf('(planned)') >= 0) band = null;
            }
        });

        if(!(name in ret)) ret[name] = [];
        if(band && ret[name].indexOf(band) == -1) {
            if(is.array(band)) ret[name] = ret[name].concat(band);
            else ret[name].push(band);
        }
        if(!ret[name].length) delete ret[name];
    });

    return ret;
}

function scrapeLte(data) {
    var ret = {};
    var $ = cheerio.load(data);

    $('.lte-chart tr').each(function(i, tr) {
        $('.selfclear em', $(tr)).each(function(i, em) {
            var name = $(em).text().split(' ').slice(1).join('');
            var bands = $('td', $(tr)).map(function(i, td) {
                if(i == 1) return $('h4', $(td)).map(function(i, h4) {
                    return $(h4).text().split(' ')[0];
                })
            }).filter(id);

            ret[name] = bands[0];
        });
    }).filter(prop('length'));

    return ret;
}

// http://stackoverflow.com/questions/7428235/how-to-print-json-object-content-in-node-js
function prettyJSON(obj) {
    console.log(JSON.stringify(obj, null, 4));
}

function id(a) {return a;}
function prop(name) {
    return function(v) {
        return v[name];
    };
}
