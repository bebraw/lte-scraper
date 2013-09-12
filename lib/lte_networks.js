var cheerio = require('cheerio');
var is = require('annois');


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
            if(is.array(band)) {
                band.forEach(function(v) {
                    if(ret[name].indexOf(v) == -1) ret[name].push(v);
                });
            }
            else ret[name].push(band);
        }
        if(!ret[name].length) delete ret[name];
    });

    return ret;
}
module.exports = scrapeLteNetworks;
