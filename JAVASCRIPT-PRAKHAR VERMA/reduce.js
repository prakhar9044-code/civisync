let n=prompt("ENTER A NUMBER ");
let arr=[];
for (let i=1;i<=n;i++){
    arr[i-1]=i;
}
console.log(arr);
let newSum=arr.reduce((res,curr)=>{
    return res+curr;
});
console.log(newSum);
let newProd=arr.reduce((res,curr)=>{
    return res*curr;
});
console.log(newProd);

alert("ARRAY REDUCE METHOD EXECUTED SUCCESSFULLY !");