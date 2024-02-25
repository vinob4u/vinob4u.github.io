let O="NotYetSelected";
let O1="NotYetSelected";

function typeOfCalculation(){
  O= document.getElementById("TypeOfCalculation");
  O1= O.options[O.selectedIndex].text;
  switch(O1){
    case "Paired Mean":
      PairedMeanShow()
      break;
    case "Paired Proportion":
      PairedProportionShow()
      break;
    default:
      document.getElementById("result").innerHTML="Please report this error to developer"
      break;
  }
  document.getElementById("Calculate").style.display = "inline-block";
  document.getElementById("variableshower").removeAttribute("hidden");
}

function PairedMeanShow(){
  document.getElementById("z1aby2p").removeAttribute("hidden");
  document.getElementById("z1-bp").removeAttribute("hidden");
  document.getElementById("μ1p").removeAttribute("hidden");
  document.getElementById("μ2p").removeAttribute("hidden");
  document.getElementById("σ1p").removeAttribute("hidden");
  document.getElementById("σ2p").removeAttribute("hidden");
  document.getElementById("Npairsp").setAttribute("hidden","");
  document.getElementById("Sp").setAttribute("hidden","");
  document.getElementById("Tp").setAttribute("hidden","");
  document.getElementById("strtagn").removeAttribute("hidden");
  document.getElementById("PairedMeanVariables").removeAttribute("hidden");
  document.getElementById("PairedProportionVariables").setAttribute("hidden", "");
}
function PairedProportionShow(){
  document.getElementById("z1aby2p").removeAttribute("hidden");
  document.getElementById("z1-bp").removeAttribute("hidden");
  document.getElementById("Npairsp").removeAttribute("hidden","");
  document.getElementById("Sp").removeAttribute("hidden","");
  document.getElementById("Tp").removeAttribute("hidden","");
  document.getElementById("σ1p").setAttribute("hidden","");
  document.getElementById("σ2p").setAttribute("hidden","");
  document.getElementById("μ1p").setAttribute("hidden","");
  document.getElementById("μ2p").setAttribute("hidden","");
  document.getElementById("strtagn").removeAttribute("hidden");
  document.getElementById("PairedProportionVariables").removeAttribute("hidden");
  document.getElementById("PairedMeanVariables").setAttribute("hidden", "");
}


function calculate(){
  O= document.getElementById("TypeOfCalculation");
  O1= O.options[O.selectedIndex].text;
  switch(O1){
    case "Paired Mean":
      PairedMeanCalculate()
      break;
    case "Paired Proportion":
      PairedProportionCalculate()
      break;
    case "Please select":
      document.getElementById("result").innerHTML="Please select type of study";
      break;
    default:
      document.getElementById("result").innerHTML="Please report this error to developer"
      break;
  }
  document.getElementById("resultDiv").style.display = "inline-block";
}

function PairedMeanCalculate(){
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
  let e1 = (Za+Zb)*(Za+Zb);
  let σ1 = parseFloat(document.getElementById("σ1").value);
  let σ2 = parseFloat(document.getElementById("σ2").value);
  let μ1 = parseFloat(document.getElementById("μ1").value);
  let μ2 = parseFloat(document.getElementById("μ2").value);
  let σ  = (σ1+σ2)/2;
  let Δ  = (μ1-μ2)/σ;
  let e2 = e1/(Δ*Δ);
  let e3 = (Za*Za)/2;
  let n  = e2+e3;
  if(isNaN(n)){document.getElementById("result").innerHTML= "Please enter valid parameters";}
  else{document.getElementById("result").innerHTML= Math.ceil(n);}
}

function PairedProportionCalculate(){
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
  let S  = parseFloat(document.getElementById("S").value);
  let T  = parseFloat(document.getElementById("T").value);
  let Npairs = parseFloat(document.getElementById("Npairs").value);
  let ψ  = S/T;
  let Pi = (S+T)/Npairs;
  let e1 = Za*(ψ+1);
  let e2 = Zb*(Math.sqrt(((ψ+1)*(ψ+1))-(((ψ-1)*(ψ-1))*Pi)));
  let e3 = (e1+e2)*(e1+e2);
  let e4 = ((ψ-1)*(ψ-1))*Pi;
  let n  = e3/e4;
  if(isNaN(n)){document.getElementById("result").innerHTML= "Please enter valid parameters";}
  else{document.getElementById("result").innerHTML= Math.ceil(n);}
}
function startAgain(){
  document.getElementById("z1aby2p").setAttribute("hidden", "");
  document.getElementById("z1-bp").setAttribute("hidden", "");
  document.getElementById("μ1p").setAttribute("hidden", "");
  document.getElementById("μ2p").setAttribute("hidden", "");
  document.getElementById("σ1p").setAttribute("hidden", "");
  document.getElementById("σ2p").setAttribute("hidden", "");
  document.getElementById("μ1").value="";
  document.getElementById("σ1").value="";
  document.getElementById("σ2").value="";
  document.getElementById("μ2").value="";
  document.getElementById("Npairsp").setAttribute("hidden","");
  document.getElementById("Sp").setAttribute("hidden","");
  document.getElementById("Tp").setAttribute("hidden","");
  document.getElementById("Npairs").value="";
  document.getElementById("S").value="";
  document.getElementById("T").value="";
  document.getElementById("result").innerHTML= " Result will appear here once you enter parameters. ";
  document.getElementById("TypeOfCalculation").selectedIndex = 0;
  document.getElementById("strtagn").setAttribute("hidden", "");
  document.getElementById("variableshower").setAttribute("hidden", "");
  document.getElementById("Calculate").style.display = "none";
  document.getElementById("resultDiv").style.display = "none";
}
startAgain();