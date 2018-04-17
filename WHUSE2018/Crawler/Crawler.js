var CSEntrance = require('./WHUCS').entrance;
var EMEntrance = require('./WHUEM').entrance;
var updateMinDate = require('./dbOp').updateMinDate;

async function getNews() {
    await updateMinDate();

    await CSEntrance();
 
    await EMEntrance();
    
}
//getNews();
setInterval(getNews,60*60*1000);
