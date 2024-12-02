let s="NotYetSelected";
let s1="NotYetSelected";

function typeOfStudy(){
  s= document.getElementById("TypeOfStudy");
  s1= s.options[s.selectedIndex].text;
  switch(s1){
    case "Cross Sectional Study":
      CrossSectionalShow()
      break;
    case "Case Control Study":
      CaseControlShow()
      break;
    case "Cohort Study/RCT":
      CohortShow()
      break;
    default:
      document.getElementById("result").innerHTML="Please report this error to developer"
      break;
  }
  document.getElementById("Calculate").style.display = "inline-block";
  document.getElementById("strtagn").style.display = "inline-block";
  document.getElementById("variableshower").removeAttribute("hidden");
}
function CrossSectionalShow(){
  document.getElementById("z1aby2p").removeAttribute("hidden");
  document.getElementById("z1-bp").removeAttribute("hidden");
  document.getElementById("p1p").removeAttribute("hidden");
  document.getElementById("p2p").removeAttribute("hidden");
  document.getElementById("ORP1P2p").setAttribute("hidden", "");
  document.getElementById("RRP1P2p").setAttribute("hidden","");
  document.getElementById("p2*p").setAttribute("hidden","");
  document.getElementById("p1*p").setAttribute("hidden","");
  document.getElementById("RRp").setAttribute("hidden","");
  document.getElementById("ORp").setAttribute("hidden","");
  document.getElementById("CrossSectionalVariables").removeAttribute("hidden");
  document.getElementById("CaseControlVariables").setAttribute("hidden", "");
  document.getElementById("CohortVariables").setAttribute("hidden", "");
  document.getElementById('finiteResultSpan').style.display= "none";
  document.getElementById('finiteResult').innerHTML= "";
}
function CaseControlShow(){
  document.getElementById("z1aby2p").removeAttribute("hidden");
  document.getElementById("z1-bp").removeAttribute("hidden");
  document.getElementById("ORP1P2p").removeAttribute("hidden");
  document.getElementById("p1p").setAttribute("hidden","");
  document.getElementById("p2p").setAttribute("hidden","");
  document.getElementById("RRP1P2p").setAttribute("hidden","");
  document.getElementById("p2*p").setAttribute("hidden","");
  document.getElementById("p1*p").setAttribute("hidden","");
  document.getElementById("RRp").setAttribute("hidden","");
  document.getElementById("ORp").setAttribute("hidden","");
  document.getElementById("CaseControlVariables").removeAttribute("hidden");
  document.getElementById("CrossSectionalVariables").setAttribute("hidden", "");
  document.getElementById("CohortVariables").setAttribute("hidden", "");
  document.getElementById('finiteResultSpan').style.display= "none";
  document.getElementById('finiteResult').innerHTML= "";
}
function CohortShow(){
  document.getElementById("z1aby2p").removeAttribute("hidden");
  document.getElementById("z1-bp").removeAttribute("hidden");
  document.getElementById("RRP1P2p").removeAttribute("hidden");
  document.getElementById("p1p").setAttribute("hidden","");
  document.getElementById("p2p").setAttribute("hidden","");
  document.getElementById("ORP1P2p").setAttribute("hidden", "");
  document.getElementById("p2*p").setAttribute("hidden","");
  document.getElementById("p1*p").setAttribute("hidden","");
  document.getElementById("RRp").setAttribute("hidden","");
  document.getElementById("ORp").setAttribute("hidden","");
  document.getElementById("CohortVariables").removeAttribute("hidden");
  document.getElementById("CrossSectionalVariables").setAttribute("hidden", "");
  document.getElementById("CaseControlVariables").setAttribute("hidden", "");
  document.getElementById('finiteResultSpan').style.display= "none";
  document.getElementById('finiteResult').innerHTML= "";
}
function ORP1P2Selected(){
  let s2=document.getElementById("ORP1P2Select");
  let s3= s2.options[s2.selectedIndex].text;
  switch(s3){
    case "Odds ratio and P2*":
      document.getElementById("ORp").removeAttribute("hidden")
      document.getElementById("p2*p").removeAttribute("hidden")
      document.getElementById("p1*p").setAttribute("hidden", "")
      break;
    case "P1* and P2*":
      document.getElementById("p1*p").removeAttribute("hidden")
      document.getElementById("p2*p").removeAttribute("hidden")
      document.getElementById("ORp").setAttribute("hidden", "")
      break;
    default:
      document.getElementById("result").innerHTML="Please report this error to developer"
      break;
  }
}
function RRP1P2Selected(){
  let s4=document.getElementById("RRP1P2Select");
  let s5= s4.options[s4.selectedIndex].text;
  switch(s5){
    case "Relative Risk and P2":
      document.getElementById("RRp").removeAttribute("hidden")
      document.getElementById("p2p").removeAttribute("hidden")
      document.getElementById("p1p").setAttribute("hidden", "")
      break;
    case "P1 and P2":
      document.getElementById("p1p").removeAttribute("hidden")
      document.getElementById("p2p").removeAttribute("hidden")
      document.getElementById("RRp").setAttribute("hidden","")
      break;
    default:
      document.getElementById("result").innerHTML="Please report this error to developer"
      break;
  }
}
function calculate(){
  s= document.getElementById("TypeOfStudy");
  s1= s.options[s.selectedIndex].text;
  switch(s1){
    case "Cross Sectional Study":
      CrossSectionalCalculate()
      break;
    case "Case Control Study":
      CaseControlCalculate()
      break;
    case "Cohort Study/RCT":
      CohortCalculate()
      break;
    case "Please select":
      document.getElementById("result").innerHTML="Please select type of study";
      break;
    default:
      document.getElementById("result").innerHTML="Please report this error to developer"
      break;
  }
  document.getElementById('finiteResultSpan').style.display= "none";
  document.getElementById('finiteResult').innerHTML= "";
  document.getElementById("resultDiv").style.display = "inline-block";
}
function CrossSectionalCalculate(){
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
  let P1 = parseFloat(document.getElementById("P1").value);
  let P2 = parseFloat(document.getElementById("P2").value);
  let P0 = (P1+P2)/2;
  let e1 = Za*(Math.sqrt(2*P0*(1-P0)));
  let e2 = Zb*(Math.sqrt((P1*(1-P1))+(P2*(1-P2))));
  let e3 = (e1+e2)*(e1+e2);
  let e4 = (P1-P2)*(P1-P2);
  let  n = e3/e4;
  if(isNaN(n)){document.getElementById("result").innerHTML= "Please enter valid parameters";}
  else{document.getElementById("result").innerHTML= Math.ceil(n);}
}
function CaseControlCalculate(){
  let t  = document.getElementById("ORP1P2Select")
  let t1 = t.options[t.selectedIndex].text;
  let P1;
  switch(t1){
    case "Odds ratio and P2*":
      let P2 = parseFloat(document.getElementById("P2*").value);
      let OR = parseFloat(document.getElementById("OR").value);
      P1 = (OR*P2)/((OR*P2)+(1-P2));
      break;
    case "P1* and P2*":
      P1 = parseFloat(document.getElementById("P1*").value);
      break;
    case "Please select":
      document.getElementById("result").innerHTML="Please select and enter parameters you have"
      break;
    default:
      document.getElementById("result").innerHTML="Please report this error to developer"
      return null;
  }
  let OR = parseFloat(document.getElementById("OR").value);
  let P2 = parseFloat(document.getElementById("P2*").value);
  let P0 = (P1+P2)/2;
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
    default:document.getElementById('result').innerHTML= "Please report this error to developer"
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
  let e1 = Za*(Math.sqrt(2*P0*(1-P0)));
  let e2 = Zb*(Math.sqrt((P1*(1-P1))+(P2*(1-P2))));
  let e3 = (e1+e2)*(e1+e2);
  let e4 = (P1-P2)*(P1-P2);
  let  n = e3/e4;
  if(isNaN(n) || OR === 0){document.getElementById("result").innerHTML= "Please enter valid parameters";}
  else{document.getElementById("result").innerHTML= Math.ceil(n);}
}

function CohortCalculate(){
  let u  = document.getElementById("RRP1P2Select")
  let u1 = u.options[u.selectedIndex].text;
  let P1;
  switch(u1){
    case "Relative Risk and P2":
      let P2 = parseFloat(document.getElementById("P2").value);
      let RR = parseFloat(document.getElementById("RR").value);
      P1 = RR*P2;
      break;
    case "P1 and P2":
      P1 = parseFloat(document.getElementById("P1").value);
      break;
    case "Please select":
      document.getElementById("result").innerHTML="Please select and enter parameters you have"
      break;
    default:
      document.getElementById("result").innerHTML="Please report this error to developer"
      return null;
  }
  let RR = parseFloat(document.getElementById("RR").value);
  let P2 = parseFloat(document.getElementById("P2").value);
  let P0 = (P1+P2)/2;
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
  let e1 = Za*(Math.sqrt(2*P0*(1-P0)));
  let e2 = Zb*(Math.sqrt((P1*(1-P1))+(P2*(1-P2))));
  let e3 = (e1+e2)*(e1+e2);
  let e4 = (P1-P2)*(P1-P2);
  let  n = e3/e4;
  if(isNaN(n) || RR === 0){document.getElementById("result").innerHTML= "Please enter valid parameters";}
  else{document.getElementById("result").innerHTML= Math.ceil(n);}
}
function finiteCalculate(){
  let popSize = document.getElementById('popSize').value;
  let infiniteResult = document.getElementById('result').innerText;
  let finiteResult = infiniteResult / (1+ ((infiniteResult - 1)/popSize));
  let finiteSpan = document.getElementById('finiteResult');
  document.getElementById("finiteResultSpan").style.display = "inline-block";
  document.getElementById("finiteResultSpan").innerText = "Result for "+ popSize +" population:";
  finiteSpan.innerText = Math.ceil(finiteResult);
  finiteSpan.style.display = "inline-block";
}
function startAgain(){
  document.getElementById("z1aby2p").setAttribute("hidden", "");
  document.getElementById("z1-bp").setAttribute("hidden", "");
  document.getElementById("P1").value="";
  document.getElementById("p1p").setAttribute("hidden", "");
  document.getElementById("p2p").setAttribute("hidden", "");
  document.getElementById("P2").value="";
  document.getElementById("p1*p").setAttribute("hidden", "");
  document.getElementById("p2*p").setAttribute("hidden", "");
  document.getElementById("P1*").value="";
  document.getElementById("ORP1P2p").setAttribute("hidden", "");
  document.getElementById("RRP1P2p").setAttribute("hidden", "");
  document.getElementById("P2*").value="";
  document.getElementById("ORp").setAttribute("hidden", "");
  document.getElementById("RRp").setAttribute("hidden", "");
  document.getElementById("result").innerHTML= " Result will appear here once you enter parameters. ";
  document.getElementById("OR").value="";
  document.getElementById("RR").value="";
  document.getElementById("TypeOfStudy").selectedIndex = 0;
  document.getElementById("ORP1P2Select").selectedIndex = 0;
  document.getElementById("RRP1P2Select").selectedIndex = 0;
  document.getElementById("variableshower").setAttribute("hidden", "");
  document.getElementById('Calculate').style.display="none";
  document.getElementById("resultDiv").style.display="none";
  document.getElementById("strtagn").style.display="none";
}
startAgain();