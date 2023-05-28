function toggled(){
    let c = document.getElementById("variables");
    if (c.hasAttribute("hidden")){
      document.getElementById('variables').removeAttribute('hidden');
    }
    else{
      document.getElementById('variables').setAttribute('hidden', "");}
  }
   function calculate(){
    let Za = parseFloat(document.getElementById("z1aby2").value);
    let Zb = parseFloat(document.getElementById("z1-b").value);
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
    document.getElementById("z1aby2").value="";
    document.getElementById("z1-b").value="";
    document.getElementById("javascriptDisabled").setAttribute("hidden", "");
    document.getElementById("variableshower").removeAttribute("hidden");
  }
  startAgain();