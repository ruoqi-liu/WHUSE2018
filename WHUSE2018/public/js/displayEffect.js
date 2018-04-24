//界面按钮的切换，登录前显示 “登录”“注册”按钮，登录后显示“用户”“退出”按钮
function loginBtn(choice) {
    if(choice === "hidden"){
        document.getElementById("userBtn").style.display = "block";
        document.getElementById("quitBtn").style.display = "block";

        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("registerBtn").style.display = "none";
    }
    else if(choice === "show"){
        document.getElementById("userBtn").style.display = "none";
        document.getElementById("quitBtn").style.display = "none";

        document.getElementById("loginBtn").style.display = "block";
        document.getElementById("registerBtn").style.display = "block";
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