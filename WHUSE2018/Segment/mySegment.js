var Segment = require('segment');

var segment = new Segment();
segment.useDefault();
segment.loadStopwordDict('stopword.txt');

var getDefaultSegment = function (doc) {
    return segment.doSegment(doc, {
        simple: true,
        stripPunctuation: true,
        stripStopword:true
    });
};

exports.defaultSegment = getDefaultSegment;