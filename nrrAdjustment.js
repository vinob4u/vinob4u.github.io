function calculate(){
    if(document.getElementById('nonResponseRate').value === "" || document.getElementById('oldN').value === ""){
        document.getElementById('result').innerText = "Please enter all the parameters to calculate the result.";
        let resultSpan = document.getElementById('result');
        document.getElementById("resultSpan").style.display = "inline-block";
        resultSpan.style.display = "inline-block";
        document.getElementById("result").style.display = "inline-block";
        document.getElementById("resultDiv").style.display= "inline-block";
        return;
    }
    let oldN = document.getElementById('oldN').value;
    let nonResponseRate = document.getElementById('nonResponseRate').value;
    let neededResult = (oldN * 100) / (100 - nonResponseRate);
    let resultSpan = document.getElementById('result');
    document.getElementById("resultSpan").style.display = "inline-block";
    document.getElementById("resultSpan").innerText = "Sample size required with "+ nonResponseRate +" % non-response rate:";
    resultSpan.innerText = Math.ceil(neededResult);
    resultSpan.style.display = "inline-block";
    document.getElementById("result").style.display = "inline-block";
    document.getElementById("resultDiv").style.display= "inline-block";
}
function startAgain(){
    document.getElementById("result").innerHTML= " Result will appear here once you enter parameters. ";
    document.getElementById("resultDiv").style.display="none";
    document.querySelectorAll("input").forEach((element)=>element.value = "");
}
startAgain();