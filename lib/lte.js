var cheerio = require('cheerio');

var utils = require('./utils');
var id = utils.id;
var prop = utils.prop;


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
module.exports = scrapeLte;