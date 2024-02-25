function startAgain(){
  document.getElementById("resultDiv").innerHTML= " Result will appear here once you enter parameters. ";
  document.getElementById("minValue").value="";
  document.getElementById("maxValue").value="";
  document.getElementById("countRandom").value="";
  document.getElementById("printCSV").setAttribute("hidden", "");
  try {
    window.JSInterface.hidePrintAsPDF();
  }
  catch (error){
    try {
      document.getElementById("printAsPDFButton").setAttribute("hidden", "");
    } catch (error) {
      /*means first time; do nothing */
    }
  }
}
startAgain();
let decimalsBoolean=2;
let unique = 0;
function decimalYes(){
  document.getElementById("decimalsNumberp").removeAttribute("hidden");
  decimalsBoolean=1; return decimalsBoolean;}
function decimalNo(){
  document.getElementById("decimalsNumberp").setAttribute("hidden", "");
  decimalsBoolean=2; return decimalsBoolean;}
function decimalNumberChecker(){
  let q =parseInt(document.getElementById("decimalsNumber").value);
  return q;
}
let sorting=0;
function sortingAsc(){sorting=1.1;return sorting}
function sortingDesc(){sorting=1.2;return sorting}
function sortingNo(){sorting=0;return sorting}
let column = 0;
function tableYes(){
  document.getElementById("tableColumnsp").removeAttribute("hidden"); column=parseInt(document.getElementById("tableColumns").value); return column;}
function tableNo(){
  document.getElementById("tableColumnsp").setAttribute("hidden", ""); column=0; return column;}
function columnShow(){
  column =parseInt(document.getElementById("tableColumns").value);
  return column;
}
function uniqueYes(){unique=1; return unique;}
function uniqueNo(){unique=0; return unique;}
let printString=`<table id="printAsCSVTable"><tr><td>
<h2>
  <strong>Save the results as a CSV file</strong>
</h2>
<p id="CSVfileName">
  <label for="fileNameCSV"> Please enter the file name:</label>
  <input id="fileNameCSV" type="text" placeholder="Random Number Generator-Result" /><strong>&nbsp;.csv</strong><br>
  <button id="printAsCSV" onfocus="printAsCSV()">
    Generate CSV file and download
  </button><br>
</p>
<div id="printingStatus"></div>
<div id='Miscellaneous'></div></td></tr></table><hr>`;
function generate(){  
  let m = parseFloat(document.getElementById("minValue").value);
  let M = parseFloat(document.getElementById("maxValue").value);
  let c = parseFloat(document.getElementById("countRandom").value);
  if (c>1000){
    document.getElementById("resultDiv").innerHTML="Maximum count of random numbers that can be generated at once is 1000, this is to prevent system overload and crashes";
    try {
      window.JSInterface.hidePrintAsPDF();
    }
    catch (error){
      try {
        document.getElementById("printAsPDFButton").setAttribute("hidden", "");
      } catch (error) {
        /*do nothing */
      }
    }
    document.getElementById("printCSV").setAttribute("hidden", "");
    return false;
  }
  if (c%1 != 0) {
    document.getElementById("resultDiv").innerText = "Count of random numbers must be a natural number";
    try {
      window.JSInterface.hidePrintAsPDF();
    }
    catch (error){
      try {
        document.getElementById("printAsPDFButton").setAttribute("hidden", "");
      } catch (error) {
        /*do nothing */
      }
    }
    document.getElementById("printCSV").setAttribute("hidden", "");
    return false;
  }
  let q = parseInt(document.getElementById("decimalsNumber").value);
  let q1;
  q1= Math.pow(10, q);
  if (isNaN(m * M * c)||(!Number.isInteger(c))||M<m||c<0) {
    document.getElementById("resultDiv").innerHTML="Please enter valid parameters";
    try {
      window.JSInterface.hidePrintAsPDF();
    }
    catch (error){
      try {
        document.getElementById("printAsPDFButton").setAttribute("hidden", "");
      } catch (error) {
        /*do nothing */
      }
    }
    document.getElementById("printCSV").setAttribute("hidden", "");
    return false;
  }
  if (column===0){
    let n = "<u>Results</u><br>";
    let array = [];
    switch (decimalsBoolean){
      case 2:
        if (unique===1){
          if ((M-m+1)>=c){
            while(array.length < c){
              var r = (m+(Math.round(Math.random()*(M-m))));
              if(array.indexOf(r) === -1) {array.push(r)};
            }
          }
          else{
            document.getElementById("resultDiv").innerHTML="<span>Unique random number </span> <span> generation not possible </span> <span> with the given parameters</span>"; 
            try {
              window.JSInterface.hidePrintAsPDF();
            }
            catch (error){
              try {
                document.getElementById("printAsPDFButton").setAttribute("hidden", "");
              } catch (error) {
                /*do nothing */
              }
            }
            document.getElementById("printCSV").setAttribute("hidden", "");
            return false;
          }
        }
        if (unique===0){
          for(let i=0;i < c;  i++) {
            var r=m+(Math.round(Math.random()*(M-m)));
            array.push(r);
          }
        }
        break;
      case 1:
        if (unique===1){
          if ((((M-m)*q1)+1)>=c){
            while(array.length < c){
              var r = (m+((Math.round((((Math.random()*(M-m)) + (Number.EPSILON))) * q1) / q1))).toFixed(q);
              if(array.indexOf(r) === -1) {array.push(r)};
            }
          }
          else{
            document.getElementById("resultDiv").innerHTML="<span>Unique random number </span> <span> generation not possible </span> <span> with the given parameters</span>";
            try {
              window.JSInterface.hidePrintAsPDF();
            }
            catch (error){
              try {
                document.getElementById("printAsPDFButton").setAttribute("hidden", "");
              } catch (error) {
                /*do nothing */
              }
            }
            document.getElementById("printCSV").setAttribute("hidden", "");
            return false;
          }
        }
        if (unique===0){
          for(let i=0;i < c;  i++) {
            var r =(m+((Math.round(((Math.random()*(M-m)) + (Number.EPSILON)) * q1) / q1))).toFixed(q);
            array.push(r);
          }
        }
    }
    if (sorting===0){
      array=array
    } else if (sorting===1.1){
      array.sort((axe, book) => axe - book);
    } else if (sorting===1.2){
      array.sort((axe, book) => book - axe);
    }
    let realIndex=0;
    array.forEach(element => {
      if (realIndex===(array.length - 1)){
        n+="<span>"+(element.toString())+"</span>"}
        else{n+="<span>"+(element.toString()+",</span>");
      }
      realIndex++;
    });
    document.getElementById("resultDiv").innerHTML=n+"<hr>";
  }
  else{
    let n = "<table><caption>Results<caption><tr>";
    let array = [];
    let counter=1;
    switch (decimalsBoolean){
      case 2:
        if (unique===1){
          if ((M-m+1)>=c){
            while(array.length < c){
              var r = (m+(Math.round(Math.random()*(M-m))));
              if(array.indexOf(r) === -1) {array.push(r)};
            }
          }
          else{
            document.getElementById("resultDiv").innerHTML="<span>Unique random number </span> <span> generation not possible </span> <span> with the given parameters</span>";
            try {
              window.JSInterface.hidePrintAsPDF();
            }
            catch (error){
              try {
                document.getElementById("printAsPDFButton").setAttribute("hidden", "");
              } catch (error) {
                /*do nothing */
              }
            }
            document.getElementById("printCSV").setAttribute("hidden", "");
            return null;
          }
        }
        if (unique===0){
          for(let i=0;i < c;  i++) {
            var r=m+(Math.round(Math.random()*(M-m)));
            array.push(r)
          }
        }
        break;
      case 1:
        if (unique===1){
          if ((((M-m)*q1)+1)>=c){
            while(array.length < c){
              var r = (m+((Math.round((((Math.random()*(M-m)) + (Number.EPSILON))) * q1) / q1))).toFixed(q);
              if(array.indexOf(r) === -1) {array.push(r)};
            }
          }
          else{
            document.getElementById("resultDiv").innerHTML="<span>Unique random number </span> <span> generation not possible </span> <span> with the given parameters</span>";
            try {
              window.JSInterface.hidePrintAsPDF();
            }
            catch (error){
              try {
                document.getElementById("printAsPDFButton").setAttribute("hidden", "");
              } catch (error) {
                /*do nothing */
              }
            }
            document.getElementById("printCSV").setAttribute("hidden", "");
            return null;
          }
        }
        if (unique===0){
          for(let i=0;i < c;  i++) {
            var r=(m+((Math.round(((Math.random()*(M-m)) + (Number.EPSILON)) * q1) / q1))).toFixed(q);
            array.push(r)
          }
        }
        break;
    }
    if (sorting===0){
      array=array
    } else if (sorting===1.1){
      array.sort((axe, book) => axe - book);
    } else if (sorting===1.2){
      array.sort((axe, book) => book - axe);
    };
    array.forEach( element => {
      n+=`<td><span>${element}</span></td>`;
      if (counter%column===0){
        n+="</tr><tr>";
      }
      counter++;
    });
    n+="</tr></table>";
    document.getElementById("resultDiv").innerHTML = n+"<hr>";
  }
  document.getElementById("printCSV").innerHTML=printString;
  if (column===0){
    document.getElementById("printCSV").setAttribute("hidden", "");
  }
  else{
    document.getElementById("printCSV").removeAttribute("hidden");
    document.getElementById("printAsCSV").removeAttribute("hidden");
  }
  document.getElementById("Generate").blur();
  try {
    window.JSInterface.showPrintAsPDF();
  } catch (error) {
    if(document.getElementById("printAsPDFButton")) {
      document.getElementById("printPDF").innerHTML = "";
    }
    let printAsPDFButton = document.createElement("button");
    printAsPDFButton.setAttribute("id", "printAsPDFButton");
    printAsPDFButton.setAttribute("onfocus", "window.print(); document.getElementById('printAsPDFButton').blur();");
    printAsPDFButton.innerText="Print Results/ Save as PDF";
    document.getElementById("printPDF").appendChild(printAsPDFButton);
    document.getElementById("printPDF").innerHTML += "<hr>";
  }
  return true;
}
let link;
function printAsCSV(){
  var content="";
  var table = document.getElementById("resultDiv").querySelectorAll("table");
  table.forEach( tableNumber => {
    var caption = tableNumber.querySelector("caption");
    var rows = tableNumber.querySelectorAll("tr");
    content += caption.innerText;
    content += "\n,";
    for (var i = 0;i<rows.length; i++){
        var row=[];
        var cols=rows[i].querySelectorAll("td");
        for (var j=0; j<cols.length; j++){
          row.push(cols[j].innerText);
        }
        content += row.join();
        content += !(i===rows.length-1) ? "\n," : "\n";
    }
  });
  let csv;
  csv = new Blob([content],{type: "text/csv"});
  link = document.createElement("a");
  var fileName1;
  if (document.getElementById("fileNameCSV").value===""){
    fileName1 = "Random Number Generator-Result.csv";
  }
  else{
    if (checkPattern()){
      fileName1 = document.getElementById("fileNameCSV").value+".csv";}
    else{
      document.getElementById('Miscellaneous').innerHTML="Since you entered invalid file Name, Name of the downloaded file will be 'Random Number Generator-Result.csv'. <br> See help.";
      fileName1= "Random Number Generator-Result.csv";
    }
  }
  link.download = fileName1;
  let blobtodata = new FileReader();
  blobtodata.readAsDataURL(csv);
  blobtodata.onload = () => {
    link.href = blobtodata.result;
    link.click();
  }
  link.innerHTML = "<button>Download!</button>";
  document.getElementById("printingStatus").innerHTML+="File generation successfull. If the download didn't start automatically, please click on the button below to download.<br>"
  document.getElementById("printingStatus").appendChild(link);
  document.getElementById("printAsCSV").blur();
  document.getElementById("printAsCSV").setAttribute("hidden","");
  return null;
}

function checkPattern() {
  let element = document.getElementById("fileNameCSV");
  let regex = /^[0-9a-zA-Z_\-.\s]+$/;
  return regex.test(element.value);
}

function feedfileName(){ //forAndroidAppOnly
  var fileName;
  if (document.getElementById("fileNameCSV").value===""){
   fileName = "Random Number Generator-Result";
  }
  else{
    if (checkPattern()){
      fileName = document.getElementById("fileNameCSV").value;
    }
    else{
      fileName= "Random Number Generator-Result";
    }
  }
  return fileName;
}