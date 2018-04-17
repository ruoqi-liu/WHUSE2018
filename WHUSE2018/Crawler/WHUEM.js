var insertNewsData = require('./dbOp').insertNewsData;
var getMinDate = require('./dbOp').getMinDate;
var insertOrUpdateTags = require('./dbOp').insertOrUpdateTags;
var monk = require('monk');
var db = monk('localhost:27017/WHUSE');
var ALLInfo = db.get('news');
var tagsCollection = db.get('tags');

const cheerio = require('cheerio');
const request = require('superagent');
var superagent = require('superagent-charset')(request);
var defaultSegment = require('../Segment/mySegment').defaultSegment;
var Iconv = require('iconv-lite');

var EMURL = [
    'ems.whu.edu.cn/xwsd/index.html',
    'ems.whu.edu.cn/tzgg/index.html',
    'ems.whu.edu.cn/xssd/index.html'
];

var entrance = function () {
    var minDate = getMinDate();
    for (i = 0; i < EMURL.length; ++i) {
        superagent.get(EMURL[i]).charset().end(function (err, res) {
            if (err) throw err;
            processEMHTML(res, minDate);
        }
        );
    }

};

function processEMHTML(res, minDate) {
    minDate = '00-00';
    let $ = cheerio.load(res.text);
    let data = [];
    var tags = [];

    $('div.listmb ul li').each((i,elem)=>{
        let _this = $(elem);
        var _date = _this.find('span').text();
        var _title = _this.find('a').text();
        var _tags = defaultSegment(_title);
        var _href;
        if (_this.find('a').attr('href').indexOf('weixin') != -1)//weixin link
            return;
        else if (_this.find('a').attr('href').indexOf('http') == -1)
            _href = 'ems.whu.edu.cn' + _this.find('a').attr('href');
        else
            _href = _this.find('a').attr('href');
        
        if (_date > minDate) {
            tags = tags.concat(_tags);
            data.push({
                title: _title,
                href: _href,
                date: _date,
                faculty: 'EM',
                'tags': _tags
            });
        }

    });


    
    insertOrUpdateTags(tags);
    ALLInfo.insert(data).then((ops) => {
        updateAriticlesDate(ops);
    }).catch(err => { console.log(err); });
    //for (i = 0; i < data.length; ++i)
    //    ALLInfo.insert(data[i]).
}

function updateAriticlesDate(ops) {
    for (i = 0; i < ops.length; ++i) {
        var news = ops[i];
        var id = news._id;
        var href = news.href;
        getArticleDate(id,href);
    }

}

function getArticleDate(id, href) {
    console.log(href);
    superagent.get(href).charset().end(function (err, res) {
        if (err) throw err;
        let $ = cheerio.load(res.text);
        var text = $('div.showc').text();
        var date = text.substring(6, 17);
        ALLInfo.update({ _id: id }, { $set: { 'date': date } }).catch(err => { console.log(err); });
    });
}

entrance();
exports.entrance = entrance;