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

    $('.lte-chart tr').each(function(i, tr) {
        return $('.selfclear em', $(tr)).each(function(i, em) {
            var name = $(em).text().split(' ').slice(1).join('');
            var bands = $('td', $(tr)).map(function(i, td) {
                if(i == 1) return $('h4', $(td)).map(function(i, h4) {
                    return $(h4).text().split(' ')[0];
                })
            }).filter(id);

            ret[name] = bands;
        });
    }).filter(prop('length'));

    return ret;
}

function id(a) {return a;}
function prop(name) {
    return function(v) {
        return v[name];
    };
}