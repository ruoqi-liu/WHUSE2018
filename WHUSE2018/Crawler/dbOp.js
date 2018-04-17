var monk = require('monk');
var db = monk('localhost:27017/WHUSE');
var ALLInfo = db.get('news');
var tagsCollection = db.get('tags');

var minDate = '1970';
var getMinDate = function () {
    if (minDate)
        return minDate;
    else
        return '1970';
};

var updateMinDate = function () {
    return ALLInfo.findOne({}, { sort: { date: -1 } }).then((docs)=> {
        console.log(docs);
        if (docs)
            minDate = docs.date;
        else
            minDate = '1970';
    });
};

var insertOrUpdateTags = function (tag) {
    tagsCollection.createIndex({ tag: 1 }, { unique: true });
    tagsCollection.update({ 'tag': tag }, { $inc: { times: 1 } }, { upsert: true }).catch((err) => { console.log(err); });
};

var insertNewsData = function (data) {
    ALLInfo.createIndex({ tags: 1 });
    ALLInfo.insert(data).catch((err) => { console.log(err); });
};


var showDBContents =  function() {

    ALLInfo.findOne({}, { sort: { date: -1 } }, function (err, doc) {// date descend
        if (err) console.log(err);
        console.log(doc);
    });
    tagsCollection.find({}, { sort: { times: -1 }, limit: 10 }).then((docs) => {
        console.log(docs);
    }).catch(err => { console.log(err); })
}

exports.getMinDate = getMinDate;
exports.insertNewsData = insertNewsData;
exports.showDBContents = showDBContents;
exports.insertOrUpdateTags = insertOrUpdateTags;
exports.updateMinDate = updateMinDate;