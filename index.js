#!/usr/bin/env node
var fs = require('fs');

var async = require('async');
var cheerio = require('cheerio');


main();

function main() {
    async.parallel([lte, lteNetworks], function(err, d) {
        if(err) return console.error(err);
        
        var result = {};

        for(var model in d[0]) {
            var bands = d[0][model].bands;
            result[model] = {};

            for(var country in d[1]) {
                var b = d[1][country];

                b.forEach(function(v) {
                    if(bands.indexOf(v)) {
                        if(!(country in result[model])) result[model][country] = [];

                        result[model][country].push(v);
                    }
                });
            }
        }

        prettyJSON(result);
    });
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
            if(i == 3 && text.indexOf('?') == -1 && text.indexOf('N/A') == -1) band = text;
            if(i == 5) {
                if(text == '2013 (planned)' || text == '2013 (in Trial)') band = null;
            }
        });

        if(!(name in ret)) ret[name] = [];
        if(band && ret[name].indexOf(band) == -1) ret[name].push(band);
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

            ret[name] = {
                bands: bands
            };
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