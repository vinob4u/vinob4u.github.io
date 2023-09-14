function increaseFontSize (){
    if(parseFloat(document.getElementsByTagName("article")[0].style.fontSize)<155){
        document.getElementsByTagName("article")[0].style.fontSize = (parseFloat(document.getElementsByTagName("article")[0].style.fontSize) + 7.5) + '%';
    }
}
function decreaseFontSize (){
    if (parseFloat(document.getElementsByTagName("article")[0].style.fontSize)>80){
        document.getElementsByTagName("article")[0].style.fontSize = (parseFloat(document.getElementsByTagName("article")[0].style.fontSize) - 7.5) + '%';
    }
}
function initialFontSize (){
    document.getElementsByTagName("article")[0].style.fontSize = `110%`;
}
if(!window.JSInterface){
    let increaseFontSizeButton = document.createElement("button");
    increaseFontSizeButton.innerHTML = "A+";
    increaseFontSizeButton.id = "increaseFontSize";
    let decreaseFontSizeButton = document.createElement("button");
    decreaseFontSizeButton.innerHTML = "A-";
    decreaseFontSizeButton.id = "decreaseFontSize";
    let initialFontSizeButton = document.createElement("button");
    initialFontSizeButton.innerHTML = "A";
    initialFontSizeButton.id = "initialFontSize";
    increaseFontSizeButton.addEventListener("click", increaseFontSize);
    decreaseFontSizeButton.addEventListener("click", decreaseFontSize);
    initialFontSizeButton.addEventListener("click", initialFontSize);
    document.getElementById("header").appendChild(decreaseFontSizeButton);
    document.getElementById("header").appendChild(initialFontSizeButton);
    document.getElementById("header").appendChild(increaseFontSizeButton);
    let appName = document.createElement("div");
    appName.style.float = "left";
    appName.innerText = "nCalculator";
    document.getElementById("header").appendChild(appName);
}
initialFontSize();