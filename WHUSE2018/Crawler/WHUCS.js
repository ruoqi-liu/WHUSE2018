const cheerio = require('cheerio');
const superagent = require('superagent');
var defaultSegment = require('../Segment/mySegment').defaultSegment;
//var monk = require('monk');
//var db = monk('localhost:27017/WHUSE');
//var ALLInfo = db.get('news');
//var tagsCollection = db.get('tags');
var insertNewsData = require('./dbOp').insertNewsData;
var getMinDate = require('./dbOp').getMinDate;
var insertOrUpdateTags = require('./dbOp').insertOrUpdateTags;
var updateMinDate = require('./dbOp').updateMinDate;

var CSURL = [
    'cs.whu.edu.cn/a/xueshujiangzuofabu/list_39_1.html',
    'cs.whu.edu.cn/a/xinwendongtaifabu/list_37_1.html',
    'cs.whu.edu.cn/plus/list.php?tid=44',
    'cs.whu.edu.cn/a/xinxigongkaifabu/list_38_1.html'
];


async function entrance() {
    //	superagent.get(url2).end(function (err, res) {
    //		console.log(res);
    //		if (err) throw err;
    //		processFirPart(res);
    //	}
    //);
    //var minDate;
    //ALLInfo.findOne({}, { sort: { date: -1 } }, function (err, docs) {
    //    if (docs)
    //        minDate = docs.date;
    //    else
    //        minDate = '1970';
    //});

    var minDate = getMinDate();
    //console.log(minDate);
        for (i = 0; i < CSURL.length; ++i) {
            superagent.get(CSURL[i]).end(async function (err, res) {
                if (err) throw err;              
                await processCSHTML(res, minDate);
            }
            );
        }
    }


//function insertOrUpdateTags(tag) {
//    tagsCollection.createIndex({ tag: 1 }, { unique: true });
//    tagsCollection.update({ 'tag': tag }, { $inc: { times: 1 } }, { upsert: true }).catch((err) => { console.log(err); });
//}


function processCSHTML(res, minDate) {

    let $ = cheerio.load(res.text);
    let data = [];
    var tags = [];
    $('#container dl dd').each(function (i, element) {
        let _this = $(element);
        var _date = _this.find('i').text();
        var _title = _this.find('a').text();
        var _tags = defaultSegment(_title);
        if (_date > minDate) {
            tags = tags.concat(_tags);
            data.push({
                title: _title,
                href: 'cs.whu.edu.cn' + _this.find('a').attr('href'),
                date: _date,
                faculty: 'CS',
                'tags': _tags
            });
        }
    });


    
    insertOrUpdateTags(tags);

    insertNewsData(data);
}



//setInterval(entrance,60*60*1000);//per hour
exports.entrance = entrance;