//该js文件中的函数用来动态加载页面元素，包括信息卡片、标签按钮等
function showNewsTag(id, tagName, tagType) {
    let html;
    html = "<button type = 'button' class = " + tagType + ">" + tagName + "</button>";
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
        "<p class = 'card-content-font'>" + content + "</p>" +
        "</div>" +
        "<div class = 'col-md-1 column'>" +
        "<a href = " + newsLink + ">" +
        "<span class = 'fa fa-angle-double-right card-href-color fa-2x'></span>" +
        "</a>" +
        "</div>" +
        "</div>";
    document.getElementById(id).innerHTML = html;
    document.getElementById(id).style.display = "block";
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