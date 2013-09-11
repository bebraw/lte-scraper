#!/usr/bin/env node
var fs = require('fs');

var async = require('async');
var cheerio = require('cheerio');


main();

function main() {
    /*fs.readFile('lte.html', {
        encoding: 'utf8'
    }, function(err, data) {
        if(err) return console.error(err);

        var d = scrapeLte(data);

        prettyJSON(d);
    });*/
    fs.readFile('lte_networks.html', {
        encoding: 'utf8'
    }, function(err, data) {
        if(err) return console.error(err);

        var d = scrapeLteNetworks(data);

        prettyJSON(d);
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

            if(i == 1) name = text;
            if(i == 3 && text.indexOf('?') == -1) band = text;
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