function toggled(){
    let c = document.getElementById("variables");
    if (c.hasAttribute("hidden")){
      document.getElementById('variables').removeAttribute('hidden');
    }
    else{
      document.getElementById('variables').setAttribute('hidden', "");}
  }
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
  }
function startAgain(){
    document.getElementById("result").innerHTML= " Result will appear here once you enter parameters. ";
    document.getElementById("javascriptDisabled").setAttribute("hidden", "");
  }
startAgain();