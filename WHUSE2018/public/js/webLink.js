function linkto(baseUrl) {
    let target;
    let curUrl = window.location.href;
    let urls = curUrl.split("?");
    if(urls[0] === curUrl){
        target = baseUrl;
    }
    else{
        target = baseUrl + "?" + urls[1];
    }
    window.location.href = target;
}