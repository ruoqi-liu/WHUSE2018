var insertNewsData = require('./dbOp').insertNewsData;
var getMinDate = require('./dbOp').getMinDate;
var insertOrUpdateTags = require('./dbOp').insertOrUpdateTags;

const cheerio = require('cheerio');
const request = require('superagent');
var superagent = require('superagent-charset')(request);
var defaultSegment = require('../Segment/mySegment').defaultSegment;

var EMURL = [
    'ems.whu.edu.cn/xwsd/index.html',
    'ems.whu.edu.cn/tzgg/index.html',
    'ems.whu.edu.cn/xssd/index.html'
];

var entrance =async function () {
    var minDate = getMinDate();
    //console.log(minDate);
    for (i = 0; i < EMURL.length; ++i) {
        superagent.get(EMURL[i]).charset().end(async function (err, res) {
            if (err) throw err;
            try {
                await processEMHTML(res, minDate);
            }
            catch (err) { console.log(err);}
        }
        );
    }

};

async function processEMHTML(res, minDate) {
    let $ = cheerio.load(res.text);
    let _data = [];
    var _tags = [];

    var elemnts = $('div.listmb ul li');
    for (i = 0; i < elemnts.length; ++i) {
        var result = await processElement($, minDate, i, elemnts[i]);
        if (!result) continue;
        _data = _data.concat(result);
        _tags = _tags.concat(result.tags);
    }
    insertOrUpdateTags(_tags);
    //console.log(_data);
    insertNewsData(_data);
}

async function processElement($, minDate, i, elem) {
    try {
        let _this = $(elem);
        var data;
        var tags = [];
        var _title = _this.find('a').text();
        var _tags = defaultSegment(_title);
        var _href;
        if (_this.find('a').attr('href').indexOf('weixin') != -1)//weixin link
            return;
        else if (_this.find('a').attr('href').indexOf('http') == -1)
            _href = 'ems.whu.edu.cn' + _this.find('a').attr('href');
        else
            _href = _this.find('a').attr('href');

        var _date = await getDate(_href);
        if (_date != 'unknown' && _date > minDate) {
            tags = tags.concat(_tags);
            data={
                title: _title,
                href: _href,
                date: _date,
                faculty: 'EM',
                'tags': _tags
            };
        }
        //console.log(data);
        return data;
    }
    catch (err) { console.log(err);}
}

async function getDate(href) {
    try {
        var res = await superagent.get(href).charset();//这个表达式返回值为res
        let $ = cheerio.load(res.text);
        var text = $('div.showc').text();
        var date = text.substring(5, 15);
        if (date.length != 10) date = 'unknown';
        return date;
    } catch (err) { console.log(err); }
}


exports.entrance = entrance;