
var monk = require('monk');
var db = monk('localhost:27017/WHUSE');
var ALLInfo = db.get('news');
var tagsCollection = db.get('tags');

var minDate = '1970';
var getMinDate = function () {
    //console.log(minDate);
    if (minDate)
        return minDate;
    else
        return '1970';
};

async function updateMinDate() {
 
    try {
         await ALLInfo.findOne({}, { sort: { date: -1 } }).then((docs) => {
           //console.log(docs);
            if (docs)
                minDate = docs.date;
            else
                minDate = '1970';
        });
    }
    catch (err) { console.log(err);}
};

var insertOrUpdateTags =async function (tags) {

    tagsCollection.createIndex({ tag: 1 }, { unique: true });

    for (i = 0; i < tags.length; ++i)
      await  tagsCollection.update({ 'tag': tags[i] }, { $inc: { times: 1 } }, { upsert: true });
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