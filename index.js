#!/usr/bin/env node
var async = require('async');

var lte = require('./lib/lte');
var lteNetworks = require('./lib/lte_networks');

var utils = require('./lib/utils');
var prettyJSON = utils.prettyJSON;
var read = utils.read;
var findAlpha3 = utils.findAlpha3;


main();

function main() {
    async.parallel([
        read.bind(null, 'lte.html', lte),
        read.bind(null, 'lte_networks.html', lteNetworks)
    ], function(err, d) {
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

                countryCode = findAlpha3(country);

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
