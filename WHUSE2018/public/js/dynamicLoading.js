//该js文件中的函数用来动态加载页面元素，包括信息卡片、标签按钮等
function showNewsTag(id, tagName) {
    let html;
    html = "<button type = 'button' class = 'card-label-color-blue'>" + tagName + "</button>";
    document.getElementById(id).innerHTML += html;
    document.getElementById(id).style.display = "block";
}

function showNewsContent(id, color, image, title, time, content, newsLink){
    let html;
    html =
        "<div class = " + color + ">" +
        "<div class = 'row clearfix'>" +
        "<div class = 'col-md-3 column'>" +
        "<img src = " + image + " class = 'img-thumbnail card-image-margin'>" +
        "</div>" +
        "<div class = 'col-md-8 column'>" +
        "<h5>" + title + "</h5>" +
        "<h6>&nbsp;" + time + "</h6>" +
        "<h3>" + content + "</h3>" +
        "</div>" +
        "<div class = 'col-md-1 column'>" +
        "<a href = http://" + newsLink + ">" +
        "<span class = 'fa fa-angle-double-right card-href-color fa-2x'></span>" +
        "</a>" +
        "</div>" +
        "</div>";
    document.getElementById(id).innerHTML = html;
    document.getElementById(id).style.display = "block";
}

function showNews(res){
    let resultArray = res.data.news;
    let length = resultArray.length;
    document.getElementById("news-content-1").style.visibility = "hidden";
    document.getElementById("news-content-2").style.visibility = "hidden";
    document.getElementById("news-content-3").style.visibility = "hidden";
    let curResult;
    if (length !== 0) {
        curResult = resultArray[0];
        showNewsContent("news-content-1", "card-label-color-blue", "/images/0001.jpg", "", curResult.date, curResult.title, curResult.href);
        document.getElementById("news-content-1").style.visibility = "visible";
        length--;
    }
    if (length !== 0) {
        curResult = resultArray[1];
        showNewsContent("news-content-2", "card-label-color-blue", "/images/0001.jpg", "", curResult.date, curResult.title, curResult.href);
        document.getElementById("news-content-2").style.visibility = "visible";
        length--;
    }
    if (length !== 0) {
        curResult = resultArray[2];
        showNewsContent("news-content-3", "card-label-color-blue", "/images/0001.jpg", "", curResult.date, curResult.title, curResult.href);
        document.getElementById("news-content-3").style.visibility = "visible";
    }
}

//根据传入的参数，构造失物招领信息卡片
function showLostContent(id, color, image, title, time, content){
    let html;
    html =
        "<div class = " + color + ">" +
        "<div class = 'row clearfix'>" +
        "<div class = 'col-md-3 column'>" +
        "<img src = " + image + " class = 'img-thumbnail card-image-margin'>" +
        "</div>" +
        "<div class = 'col-md-8 column'>" +
        "<h5>" + title + "</h5>" +
        "<h6>&nbsp;" + time + "</h6>" +
        "<p class = 'card-content-font'>" + content + "</p>" +
        "</div>" +
        "</div>";
    document.getElementById(id).innerHTML = html;
    document.getElementById(id).style.display = "block";
}

function showLost(res) {
    let resultArray = res.data.result;
    let length = resultArray.length;
    document.getElementById("lost-content-1").style.visibility = "hidden";
    document.getElementById("lost-content-2").style.visibility = "hidden";
    document.getElementById("lost-content-3").style.visibility = "hidden";
    let curResult;
    if(length !== 0) {
        curResult = resultArray[0];
        showLostContent("lost-content-1", "card-label-color-blue", curResult.postinfo.image, curResult.title, curResult.postinfo.date, curResult.content);
        document.getElementById("lost-content-1").style.visibility = "visible";
        length--;
    }
    if(length !== 0) {
        curResult = resultArray[1];
        showLostContent("lost-content-2", "card-label-color-blue", curResult.postinfo.image, curResult.title, curResult.postinfo.date, curResult.content);
        document.getElementById("lost-content-2").style.visibility = "visible";
        length--;
    }
    if(length !== 0) {
        curResult = resultArray[2];
        showLostContent("lost-content-3", "card-label-color-blue", curResult.postinfo.image, curResult.title, curResult.postinfo.date, curResult.content);
        document.getElementById("lost-content-3").style.visibility = "visible";
    }
}

function showUser(res) {

}