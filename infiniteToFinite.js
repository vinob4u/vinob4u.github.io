function calculate(){
    let popSize = document.getElementById('pop').value;
    let infiniteResult = document.getElementById('infiniteN').value;
    let finiteResult = infiniteResult / (1+ ((infiniteResult - 1)/popSize));
    let finiteSpan = document.getElementById('finiteResult');
    document.getElementById("finiteResultSpan").style.display = "inline-block";
    document.getElementById("finiteResultSpan").innerText = "Result for "+ popSize +" population:";
    finiteSpan.innerText = Math.ceil(finiteResult);
    finiteSpan.style.display = "inline-block";
    document.getElementById("finiteResult").style.display = "inline-block";
    document.getElementById("resultDiv").style.display= "inline-block";
}
function startAgain(){
    document.getElementById("finiteResult").innerHTML= " Result will appear here once you enter parameters. ";
    document.getElementById("resultDiv").style.display="none";
    document.querySelectorAll("input").forEach((element)=>element.value = "");
}
startAgain();