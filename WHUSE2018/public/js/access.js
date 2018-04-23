//界面按钮的切换，登录前显示 “登录”“注册”按钮，登录后显示“用户”“退出”按钮
function loginBtn(choice) {
    if(choice === "hidden"){
        document.getElementById("user").style.display = "block";
        document.getElementById("quit").style.display = "block";

        document.getElementById("login").style.display = "none";
        document.getElementById("register").style.display = "none";
    }
    else if(choice === "show"){
        document.getElementById("user").style.display = "none";
        document.getElementById("quit").style.display = "none";

        document.getElementById("login").style.display = "block";
        document.getElementById("register").style.display = "block";
    }
}

//显示点击效果，show对应id的按钮会有点击的凹陷效果，而hidden则复原
function clicked(show, hidden) {
    let attributeList;

    attributeList = document.getElementById(hidden).getAttribute("class");
    attributeList = attributeList.replace("active", "");
    document.getElementById(hidden).setAttribute("class", attributeList);

    attributeList = document.getElementById(show).getAttribute("class");
    attributeList = attributeList.concat(" active");
    document.getElementById(show).setAttribute("class", attributeList);
}