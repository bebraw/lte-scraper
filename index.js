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
    var $ = cheerio.load(data);

    return $('.lte-chart tr .selfclear em').map(function(i, el) {
        return $(el).text().split(' ').slice(1).join('');
    });
}