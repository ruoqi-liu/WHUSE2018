var Segment = require('segment');

var segment = new Segment();
segment.useDefault();
segment.loadStopwordDict('stopword.txt');

var getDefaultSegment = function (doc) {
    console.log(doc);
    return segment.doSegment(doc, {
        simple: true,
        stripPunctuation: true,
        stripStopword:true
    });
};

console.log(getDefaultSegment('zhe时一段中文的ceshi，sad.//././.this 是 a test of English'));