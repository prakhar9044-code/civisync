// var can be redeclared as well as reupdated
var a=10;
a=20; //updated
// let ccan be updated but cant be redeclared in the same block 
let b=30;
b=40; 
// const cant be updated or redeclared 
const c=50;
// c=60; this could cause an error 
document.write("The value of a:"+ a + "<br>" + "The value of b:" + b + "<br>" +"The value of c:" + c);