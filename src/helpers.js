// format number from 10000 to '10.000'
export function prettyfyPopulationNum(num){
  let myArray = num.toString().split('').reverse();
  let counter = 0;
  let newArray = [];
  for(let i = 0; i < myArray.length; i++){
    if(counter === 3){
      newArray.push('.');
      counter = 1;
    }else{
      counter++;
    }
    newArray.push(myArray[i]);
  }
  return newArray.reverse().join('');
}
