//该js文件中的函数用来动态加载页面元素，包括信息卡片、标签按钮等
function showNewsTag(res) {
    document.getElementById('tags-content-1').innerHTML = "";
    document.getElementById('tags-content-2').innerHTML = "";
    document.getElementById('tags-content-3').innerHTML = "";

    var name;
    var tags = res.data.tags;
    var length = tags.length;
    if(length === 0){
        return;
    }

    var index;
    for(index = 1; index < length; index++){
        name = 'tag' + index;
        if(index > 12){
            document.getElementById('tags-content-3').innerHTML += "<button id = " + name + " ng-click='deleteTag()' type = 'button' class = 'btn btn-primary' style='margin-right: 20px'>" + tags[index] + "</button>";
        }
        else if (index > 6){
            document.getElementById('tags-content-2').innerHTML += "<button id = " + name + " ng-click='deleteTag()' type = 'button' class = 'btn btn-primary' style='margin-right: 20px'>" + tags[index] + "</button>";
        }
        else if (index > 0){
            document.getElementById('tags-content-1').innerHTML += "<button id = " + name + " ng-click='deleteTag()' type = 'button' class = 'btn btn-primary' style='margin-right: 20px'>" + tags[index] + "</button>";
        }
    }
    if(length > 1){
        document.getElementById('tags-content-1').style.display = "block";
    }
    if(length > 7){
        document.getElementById('tags-content-2').style.display = "block";
    }
    if (length > 13){
        document.getElementById('tags-content-3').style.display = "block";
    }
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
    document.getElementById("newsPage").style.display = 'none';
    document.getElementById("news-content-1").style.visibility = "hidden";
    document.getElementById("news-content-2").style.visibility = "hidden";
    document.getElementById("news-content-3").style.visibility = "hidden";

    let resultArray = res.data.news;
    let length = resultArray.length;

    if(length === 0){
        alert("无搜索结果");
        return;
    }

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
    document.getElementById("newsPage").style.display = 'block';
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

function showUserPost(posts, page) {
    document.getElementById("lostPage").style.display = 'none';
    document.getElementById("lost-content-1").style.visibility = "hidden";
    document.getElementById("lost-content-2").style.visibility = "hidden";
    document.getElementById("lost-content-3").style.visibility = "hidden";

    let length = posts.length;
    if(length === 0){
        return;
    }
    var curPage = (page - 1) * 3;

    let curResult;
    if(curPage < length) {
        curResult = posts[curPage];
        showLostContent("lost-content-1", "card-label-color-blue", curResult.postinfo.image, curResult.title, curResult.postinfo.date, curResult.content);
        document.getElementById("lost-content-1").style.visibility = "visible";
        curPage++;
        document.getElementById('userlost-id-1').innerHTML = curResult._id;
    }
    if(curPage < length) {
        curResult = posts[curPage];
        document.getElementById('userlost-id-2').innerHTML = curResult._id;
        showLostContent("lost-content-2", "card-label-color-blue", curResult.postinfo.image, curResult.title, curResult.postinfo.date, curResult.content);
        document.getElementById("lost-content-2").style.visibility = "visible";
        curPage++;
        document.getElementById('userlost-id-2').innerHTML = curResult._id;
    }
    if(curPage < length) {
        curResult = posts[curPage];
        document.getElementById('userlost-id-3').innerHTML = curResult._id;
        showLostContent("lost-content-3", "card-label-color-blue", curResult.postinfo.image, curResult.title, curResult.postinfo.date, curResult.content);
        document.getElementById("lost-content-3").style.visibility = "visible";
        document.getElementById('userlost-id-3').innerHTML = curResult._id;
    }
    document.getElementById("lostPage").style.display = 'block';
}