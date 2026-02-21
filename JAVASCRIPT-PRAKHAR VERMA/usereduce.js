let array=[1,2,32,3,3,3,2,];
let newarr=array.reduce((res,curr)=>{
    return res+curr;
});
console.log(newarr);