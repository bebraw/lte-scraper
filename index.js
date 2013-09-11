#!/usr/bin/env node
var fs = require('fs');

var async = require('async');
var cheerio = require('cheerio');


main();

function main() {
    fs.readFile('lte.html', {
        encoding: 'utf8'
    }, function(err, data) {
        if(err) return console.error(err);

        var d = scrapeLte(data);

        console.log(d);
    });
}

function scrapeLte(data) {
    var ret = {};
    var $ = cheerio.load(data);

    $('.lte-chart tr').each(function(i, el) {
        return $('.selfclear em', $(el)).each(function(i, el) {
            var name = $(el).text().split(' ').slice(1).join('');

            ret[name] = false;
        });
    }).filter(prop('length'));

    return ret;
}

function prop(name) {
    return function(v) {
        return v[name];
    };
}