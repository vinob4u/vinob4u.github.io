function calculate(){
  z1= document.getElementById("z1aby2");
  var z01 = z1.options[z1.selectedIndex].text;
  let Za= 1.96;
  switch(z01){
    case '80%':
      Za= 1.282
      break;
    case '85%':
      Za= 1.440
      break;
    case '90%':
      Za= 1.645
      break;
    case '95%':
      Za= 1.96;
      break;
    case '99%':
      Za= 2.576
      break;
    case '99.5%':
      Za=  2.807
      break;
    case '99.9%':
      Za=3.291
      break;
    default:
      document.getElementById('result').innerHTML= "Please report this error to developer"
      return null;
  }
  z2= document.getElementById("z1-b");
  var z02 = z2.options[z2.selectedIndex].text;
  let Zb= 0.82;
  switch(z02){
    case '80%':
      Zb= 0.82
      break;
    case '90%':
      Zb= 1.28
      break;
    case '95%':
      Zb= 1.645
      break;
    case '99%':
      Zb= 2.326
      break;
    default:
      document.getElementById('result').innerHTML= "Please report this error to developer"
      return null;
  }
    let S1 = parseFloat(document.getElementById("S1").value);
    let S2 = parseFloat(document.getElementById("S2").value);
    let SP2 = ((S1*S1)+(S2*S2))/2;
    let e1 = (Za+Zb)*(Za+Zb);
    let e2 = 2*SP2;
    let e3 = e1*e2;
    let Md = parseFloat(document.getElementById("Md").value);
    let e4 = Md*Md;
    let  n = e3/e4;
    if(isNaN(n)){document.getElementById("result").innerHTML= "Please enter valid parameters";}
    else{document.getElementById("result").innerHTML= Math.ceil(n);}
    document.getElementById('finiteResultSpan').style.display= "none";
    document.getElementById('finiteResult').innerHTML= "";
  document.getElementById("resultDiv").style.display="inline-block";
  }
function finiteCalculate(){
  if(document.getElementById('nonResponseRate').value == "" && document.getElementById("nonResponseRateCheckbox").checked){
    document.getElementById('nonResponseRate').value = 0;
  }
  let popSize = document.getElementById('popSize').value;
  let infiniteResult = document.getElementById('result').innerText;
  let finiteResult = infiniteResult;
  if(document.getElementById("finiteCheckbox").checked){
    finiteResult = infiniteResult / (1+ ((infiniteResult - 1)/popSize));
  } else finiteResult = infiniteResult;
  if(document.getElementById("nonResponseRateCheckbox").checked){
    finiteResult = (finiteResult * 100)/ (100- (document.getElementById('nonResponseRate').value));
  }
  let finiteSpan = document.getElementById('finiteResult');
  document.getElementById("finiteResultSpan").style.display = "inline-block";
  let finiteText = document.getElementById("finiteCheckbox").checked ? "for "+ popSize +" population" : "";
  let nonResponseText = "";
  if(document.getElementById("nonResponseRateCheckbox").checked){
    nonResponseText = " after adjusting for non-response rate of "+ document.getElementById('nonResponseRate').value + "%";
  }
  if(document.getElementById("finiteCheckbox").checked && (Math.ceil(finiteResult) > popSize)) {
    finiteSpan.innerHTML = " Sample size required is higher than the total population. Non-response rate is too high."
  } else if(Math.ceil(finiteResult) <=0 || isNaN(finiteResult)|| document.getElementById('nonResponseRate').value > 100 || isNaN(document.getElementById('nonResponseRate').value)){
    finiteSpan.innerHTML = " Please enter valid parameters to calculate sample size."
  } else {
    finiteSpan.innerHTML = " Sample size required is "+ Math.ceil(finiteResult) + " " + finiteText + nonResponseText + "."
  }
  finiteSpan.style.display = "inline-block";
}
function startAgain(){
  document.getElementById("result").innerHTML= " Result will appear here once you enter parameters. ";
  document.getElementById("resultDiv").style.display="none";
  document.querySelectorAll("input").forEach((element)=>element.value = "");
}
startAgain();