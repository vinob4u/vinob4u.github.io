let mainTableTd = 0;

function PrAbsPShow(){
  document.getElementById("labelCF").setAttribute("hidden", "");
  document.getElementById("CF").setAttribute("hidden", "");
  document.getElementById("labelPrevalence").removeAttribute("hidden");
  document.getElementById("prevalence").removeAttribute("hidden");
  document.getElementById("labelCF").removeAttribute("hidden");
  document.getElementById("CF").removeAttribute("hidden");
  document.getElementById("labelAbsPrecision").removeAttribute("hidden");
  document.getElementById("AbsPrecision").removeAttribute("hidden");
  document.getElementById("labelRelPrecision").setAttribute("hidden", "");
  document.getElementById("RelPrecision").setAttribute("hidden", "");
  document.getElementById("labelSD").setAttribute("hidden", "");
  document.getElementById("SD").setAttribute("hidden", "");
  document.getElementById("labelMean").setAttribute("hidden", "");
  document.getElementById("mean").setAttribute("hidden", "");
  document.getElementById("formulaImage").setAttribute("src", "./ProportionAbsolutePrecision.png");
  document.getElementById("variableHint").innerHTML = `
  Z<sub>1-α</sub> = Z value of Alpha Error<br>
  p = Expected Prevalence<br>
  q = 1-p <br>
  d = Absolute Precision<br>`;
  document.getElementById('percent1').style.display = "inline-block";
  document.getElementById("variableshower").removeAttribute("hidden");
  document.getElementById('Calculate').style.display="inline-block";
  document.getElementById('strtagn').style.display="inline-block";
  document.getElementById('finiteResultSpan').style.display= "none";
  document.getElementById('finiteResult').innerHTML= "";
  mainTableTd = 1;
  return mainTableTd;
}
function PrRelPShow(){
  document.getElementById("labelPrevalence").removeAttribute("hidden");
  document.getElementById("prevalence").removeAttribute("hidden");
  document.getElementById("labelCF").removeAttribute("hidden");
  document.getElementById("CF").removeAttribute("hidden");
  document.getElementById("labelRelPrecision").removeAttribute("hidden");
  document.getElementById("RelPrecision").removeAttribute("hidden");
  document.getElementById("labelAbsPrecision").setAttribute("hidden", "");
  document.getElementById("AbsPrecision").setAttribute("hidden", "");
  document.getElementById("labelSD").setAttribute("hidden", "");
  document.getElementById("SD").setAttribute("hidden", "");
  document.getElementById("labelMean").setAttribute("hidden", "");
  document.getElementById("mean").setAttribute("hidden", "");
  document.getElementById("variableHint").innerHTML = `
  Z<sub>1-α</sub> = Z value of Alpha Error<br>
  p = Expected Prevalence<br>
  q = 1-p <br>
  ε = Relative Precision<br>`
  document.getElementById("formulaImage").setAttribute("src", "./ProportionRelativePrecision.png");
  document.getElementById("variableshower").removeAttribute("hidden");
  document.getElementById('Calculate').style.display="inline-block";
  document.getElementById('strtagn').style.display="inline-block";
  document.getElementById('finiteResultSpan').style.display= "none";
  document.getElementById('finiteResult').innerHTML= "";
  mainTableTd = 2;
  return mainTableTd;
}
function MAbsPShow(){
  document.getElementById("labelSD").removeAttribute("hidden");
  document.getElementById("SD").removeAttribute("hidden");
  document.getElementById("labelCF").removeAttribute("hidden");
  document.getElementById("CF").removeAttribute("hidden");
  document.getElementById("labelAbsPrecision").removeAttribute("hidden");
  document.getElementById("AbsPrecision").removeAttribute("hidden");
  document.getElementById("labelRelPrecision").setAttribute("hidden", "");
  document.getElementById("RelPrecision").setAttribute("hidden", "");
  document.getElementById("labelPrevalence").setAttribute("hidden", "");
  document.getElementById("prevalence").setAttribute("hidden", "");
  document.getElementById("labelMean").setAttribute("hidden", "");
  document.getElementById("mean").setAttribute("hidden", "");
  document.getElementById("variableHint").innerHTML = `
  Z<sub>1-α</sub> = Z value of Alpha Error<br>
  σ = Expected Standard Deviation<br>
  d = Absolute Precision<br>`;
  document.getElementById("percent1").style.display = "none";
  document.getElementById("formulaImage").setAttribute("src", "./MeanAbsolutePrecision.png");
  document.getElementById("variableshower").removeAttribute("hidden");
  document.getElementById('Calculate').style.display="inline-block";
  document.getElementById('strtagn').style.display="inline-block";
  document.getElementById('finiteResultSpan').style.display= "none";
  document.getElementById('finiteResult').innerHTML= "";
  mainTableTd = 3;
  return mainTableTd;
}
function MRelPShow(){
  document.getElementById("labelSD").removeAttribute("hidden");
  document.getElementById("SD").removeAttribute("hidden");
  document.getElementById("labelCF").removeAttribute("hidden");
  document.getElementById("CF").removeAttribute("hidden");
  document.getElementById("labelRelPrecision").removeAttribute("hidden");
  document.getElementById("RelPrecision").removeAttribute("hidden");
  document.getElementById("labelAbsPrecision").setAttribute("hidden", "");
  document.getElementById("AbsPrecision").setAttribute("hidden", "");
  document.getElementById("labelPrevalence").setAttribute("hidden", "");
  document.getElementById("prevalence").setAttribute("hidden", "");
  document.getElementById("mean").removeAttribute("hidden");
  document.getElementById("labelMean").removeAttribute("hidden");
  document.getElementById("variableHint").innerHTML = `
  Z<sub>1-α</sub> = Z value of Alpha Error<br>
  σ = Expected Standard Deviation<br>
  ε = Relative Precision<br>
  μ = Expected Mean`;
  document.getElementById("formulaImage").setAttribute("src", "./MeanRelativePrecision.png");
  document.getElementById("variableshower").removeAttribute("hidden");
  document.getElementById('Calculate').style.display="inline-block";
  document.getElementById('strtagn').style.display="inline-block";
  document.getElementById('finiteResultSpan').style.display= "none";
  document.getElementById('finiteResult').innerHTML= "";
  mainTableTd = 4;
  return mainTableTd;
}

function calculate(){
  if (document.getElementById('prevalence').value>100 || document.getElementById('AbsPrecision').value>100 || document.getElementById('RelPrecision').value>100 || document.getElementById('SD').value>100||document.getElementById('prevalence').value<0 || document.getElementById('AbsPrecision').value<0 || document.getElementById('RelPrecision').value<0 || document.getElementById('SD').value<0){
    document.getElementById('result').innerHTML= "Please enter valid parameters";
  }
  else{
    let z= document.getElementById("CF");
    switch(mainTableTd){
      case 0:
        document.getElementById('result').innerHTML= "Please Select Type of Calculation"
        break;
      case 1:
        PrAbsPCalculate()
        break;
      case 2:
        PrRelPCalculate()
        break;
      case 3:
        MAbsPCalculate()
        break;
      case 4:
        MRelPCalculate()
        break;
      default:
        document.getElementById('result').innerHTML= "Please report this error to developer";
    }
    document.getElementById('finiteResultSpan').style.display= "none";
    document.getElementById('finiteResult').innerHTML= "";
    document.getElementById('resultDiv').style.display="inline-block";
  }
}
function PrAbsPCalculate(){
  let p1= document.getElementById('prevalence').value;
  z= document.getElementById("CF");
  var z01 = z.options[z.selectedIndex].text;
  let z1= 1.96;
  switch(z01){
    case '80%':
      z1= 1.282
      break;
    case '85%':
      z1= 1.440
      break;
    case '90%':
      z1= 1.645
      break;
    case '95%':
      z1= 1.96;
      break;
    case '99%':
      z1= 2.576
      break;
    case '99.5%':
      z1=  2.807
      break;
    case '99.9%':
      z1=3.291
      break;
    default:document.getElementById('result').innerHTML= "Please report this error to developer";
      break;
    }
  let z12 = z1*z1;
  let q1= 100-p1;
  let d1= document.getElementById('AbsPrecision').value;
  let d12= d1*d1;
  let r1= z12*p1*q1/d12;
  let r10= Math.ceil(r1);
  if (isNaN(r10)){document.getElementById('result').innerHTML= "Please enter valid parameters";}
  else{
  document.getElementById('result').innerHTML= r10;}
}
function PrRelPCalculate(){
  let p2= document.getElementById('prevalence').value;
  z= document.getElementById("CF");
  var z02 = z.options[z.selectedIndex].text;
  let z2= 1.96;
  switch(z02){
    case '80%':
      z2= 1.282
      break;
    case '85%':
      z2= 1.440
      break;
    case '90%':
      z2= 1.645
      break;
    case '95%':
      z2= 1.96;
      break;
    case '99%':
      z2= 2.576
      break;
    case '99.5%':
      z2=  2.807
      break;
    case '99.9%':
      z2=3.291
      break;
    default:document.getElementById('result').innerHTML= "Please report this error to developer"
      break;
    }
  let z22 = z2*z2;
  let q2= 100-p2;
  let d2= document.getElementById('RelPrecision').value;
  let d22= d2*d2*p2*p2;
  let r2= 10000*z22*p2*q2/d22;
  let r20= Math.ceil(r2);
  if (isNaN(r20)){document.getElementById('result').innerHTML= "Please enter valid parameters";}
  else{
  document.getElementById('result').innerHTML= r20;}
}
function MAbsPCalculate(){
  let p3= document.getElementById('SD').value;
  z= document.getElementById("CF");
  var z03 = z.options[z.selectedIndex].text;
  let z3= 1.96;
  switch(z03){
    case '80%':
      z3= 1.282
      break;
    case '85%':
      z3= 1.440
      break;
    case '90%':
      z3= 1.645
      break;
    case '95%':
      z3= 1.96;
      break;
    case '99%':
      z3= 2.576
      break;
    case '99.5%':
      z3=  2.807
      break;
    case '99.9%':
      z3=3.291
      break;
    default:document.getElementById('result').innerHTML= "Please report this error to developer"
      break;
    }
  let z32 = z3*z3;
  let d3= document.getElementById('AbsPrecision').value;
  let d32= d3*d3;
  let p32= p3*p3;
  let r3= z32*p32/d32;
  let r30= Math.ceil(r3);
  if (isNaN(r30)){document.getElementById('result').innerHTML= "Please enter valid parameters";}
  else{
  document.getElementById('result').innerHTML= r30;}
}
function MRelPCalculate(){
  let p4= document.getElementById('SD').value;
  z= document.getElementById("CF");
  var z04 = z.options[z.selectedIndex].text;
  let z4= 1.96;
  switch(z04){
    case '80%':
      z4= 1.282
      break;
    case '85%':
      z4= 1.440
      break;
    case '90%':
      z4= 1.645
      break;
    case '95%':
      z4= 1.96;
      break;
    case '99%':
      z4= 2.576
      break;
    case '99.5%':
      z4=  2.807
      break;
    case '99.9%':
      z4=3.291
      break;
    default:document.getElementById('result').innerHTML= "Please report this error to developer"
      break;
    }
  let z42 = z4*z4;
  let p42= p4*p4;
  let d4= (document.getElementById('RelPrecision').value)/100;
  let m4= document.getElementById('mean').value;
  let d42= d4*d4*m4*m4;
  let r4= z42*p42/d42;
  let r40= Math.ceil(r4)
  if (isNaN(r40)){document.getElementById('result').innerHTML= "Please enter valid parameters";}
  else{
  document.getElementById('result').innerHTML= r40;}
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
  document.getElementById("ProportionAbsPrecision").checked = false;
  document.getElementById("ProportionRelPrecision").checked = false;
  document.getElementById("MeanAbsPrecision").checked = false;
  document.getElementById("MeanRelPrecision").checked = false;
  document.getElementById("labelPrevalence").setAttribute("hidden", "");
  document.getElementById("prevalence").setAttribute("hidden", "");
  document.getElementById("prevalence").value="";
  document.getElementById("labelSD").setAttribute("hidden", "");
  document.getElementById("SD").setAttribute("hidden", "");
  document.getElementById("SD").value="";
  document.getElementById("labelAbsPrecision").setAttribute("hidden", "");
  document.getElementById("AbsPrecision").setAttribute("hidden", "");
  document.getElementById("AbsPrecision").value="";
  document.getElementById("labelRelPrecision").setAttribute("hidden", "");
  document.getElementById("RelPrecision").setAttribute("hidden", "");
  document.getElementById("RelPrecision").value="";
  document.getElementById("labelCF").setAttribute("hidden", "");
  document.getElementById("CF").setAttribute("hidden", "");
  document.getElementById('result').innerHTML= " Result will appear here once you enter parameters. ";
  document.getElementById("CF").selectedIndex = 3;
  document.getElementById("labelMean").setAttribute("hidden", "");
  document.getElementById("mean").setAttribute("hidden", "");
  document.getElementById("mean").value="";
  document.getElementById('variableshower').setAttribute('hidden', "");
  document.getElementById('Calculate').style.display="none";
  document.getElementById("resultDiv").style.display="none";
  document.getElementById("strtagn").style.display="none";
  mainTableTd=0;
  return mainTableTd;
}
startAgain();