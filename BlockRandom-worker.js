
function generateNumbers(){
  let q1;
  switch (q){
    case 1: q1=10; break;
    case 2: q1=100; break;
    case 3: q1=1000; break;
    case 4: q1=10000; break;
    case 5: q1=100000; break;
    default: document.getElementById("result").innerHTML="Please report this error to developers"; break;
  }
    let array = [];
    var numberString="";
    switch (typeOfCalculation){
      case 2:
        if (unique===1){
        if (((M-m+1)*q1)>=c){
        while(array.length < c){
          var r = m+(Math.round(Math.random()*(M-m)));
          if(array.indexOf(r) === -1) {
          array.push(r);
          };
        }
        if (sorting===0){array=array}
        if (sorting===1.1){array.sort(function(axe, book){return axe - book});};
        if (sorting===1.2){array.sort(function(axe, book){return book - axe});};
        array.forEach(element => {if (array.indexOf(element)===(array.length - 1)){numberString+="<span>"+(element.toString())+"&nbsp;</span>"}
                                  else{numberString+="<span>"+(element.toString()+",&nbsp;</span>");}}          );
        return [array, numberString];
        }
        }
        if (unique===0){
        for(let i=0;i < c;  i++) {
          var r = m+(Math.round(Math.random()*(M-m)));
          array.push(r);
          }
        if (sorting===0){array=array}
        if (sorting===1.1){array.sort(function(axe, book){return axe - book});};
        if (sorting===1.2){array.sort(function(axe, book){return book - axe});};
        array.forEach(element => {if (array.indexOf(element)===(array.length - 1)){numberString+="<span>"+(element.toString())+"&nbsp;</span>"}
                                  else{numberString+="<span>"+(element.toString()+",&nbsp;</span>");}}          );
        return [array, numberString];
        }
        break;  
      case 1:
        if (unique===1){
        if ((((M-m)*q1)+1)>=c){
        let i=0;
        while(array.length < c){
          var r = (m+(Math.round(((Math.random()*(M-m)) + (Number.EPSILON))* q1)/ q1)).toFixed(q);
          if(array.indexOf(r) === -1) {array.push(r)};
        }
        }
        if (sorting===0){array=array}
        if (sorting===1.1){array.sort(function(axe, book){return axe - book});};
        if (sorting===1.2){array.sort(function(axe, book){return book - axe});};
        array.forEach(element => {if (array.indexOf(element)===(array.length - 1)){numberString+="<span>"+(element.toString())+"&nbsp;</span>"}
                                  else{numberString+="<span>"+(element.toString()+",&nbsp;</span>");}}          );
        return [array, numberString];
        }
        if (unique===0){
        for(let i=0;i < c;  i++) {
          let r = (m+(Math.round(((Math.random()*(M-m)) + (Number.EPSILON))* q1)/ q1)).toFixed(q);
          array.push(r);
        }
        if (sorting===0){array=array}
        if (sorting===1.1){array.sort(function(axe, book){return axe - book});};
        if (sorting===1.2){array.sort(function(axe, book){return book - axe});};
        array.forEach(element => {if (array.indexOf(element)===(array.length - 1)){numberString+="<span>"+(element.toString())+"&nbsp;</span>"}
                                  else{numberString+="<span>"+(element.toString()+",&nbsp;</span>");}}          );
        return [array, numberString];
        }
     }
}
function generateMain(){
  let N = "";
  
  if (C===""||document.getElementById("countRandom").value===""||document.getElementById("minValue").value===""||document.getElementById("maxValue").value===""){
    document.getElementById("result").innerText="Please enter all the fields";
    return null;
  }
  let a=[];
  if (uniqueBlock===1){
  if (uniqueOrder===0){
  while(a.length<C){
    if (validityChecker()===true){
      let arrayPlusNumberString = generateNumbers();
      let array= arrayPlusNumberString[0];
      let numberString= arrayPlusNumberString[1];
      let arrayString = array.toString();
      if (a.indexOf(arrayString) === -1){
        a.push(arrayString);
        N+=("<p>")+numberString+("&nbsp;&nbsp;&nbsp;</p><hr>");
      }
    }
    else{return null;}//invalid parameters
  }
  }
  else{//uniqueOrder===1;
  
  let majorArray= [];
  while(a.length<C){
    if (validityChecker()===true){
      let arrayPlusNumberString = generateNumbers();
      let array= arrayPlusNumberString[0];
      let numberString= arrayPlusNumberString[1];
      let arrayString = array.toString();
      
      let possiblePermutations= permutator(array);
      
      possiblePermutations.forEach(arrayElement  => {
      let pPString= arrayElement.toString();
      if (majorArray.indexOf(arrayString) === -1 ){ 
        if (a.indexOf(arrayString) === -1){
          a.push(arrayString);
          N+=("<p>")+numberString+("&nbsp;&nbsp;&nbsp;</p><hr>");
        }
      }
      majorArray.push(pPString);
      } );
      
    }
    else{return null;}//invalid parameters
  }
  }
  }
  else{//uniqueBlock===0;
  while(a.length<C){
    if (validityChecker()===true){
      let arrayPlusNumberString = generateNumbers();
      let array= arrayPlusNumberString[0];
      let numberString= arrayPlusNumberString[1];
      let arrayString = array.toString();  
        N+=("<p>")+numberString+("&nbsp;&nbsp;&nbsp;</p><hr>");
        a.push(arrayString);
    }
    else{return null;}//invalid parameters
  }
  }
  self.postMessage(document.getElementById("result").innerHTML=N;)
  self.postMessage(document.getElementById("Generate").blur();)
}
const permutator = (inputArr) => {
  let result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next))
     }
   }
 }

 permute(inputArr)

 return result;
}

