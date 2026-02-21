function dosum(a,b){
    return a+b;
}
function addfunc(){
    var x=Number(document.getElementById("first").value);
    var y=Number(document.getElementById("second").value);
    let res=dosum(x,y);
    document.write("THE SUM OF THE PROVIDED NUMBERS IS: "+ res)
}