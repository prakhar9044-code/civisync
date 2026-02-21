document.addEventListener("keydown",function(abc){
    document.write("Key Down: "  + abc.key)
});
// keypress,keyup,keydown
document.addEventListener("keyup",function(abc){
    document.getElementById("output").innerHTML="Key Press O/P: " + abc.key;
});
document.addEventListener("keypress",function(abc){
    document.getElementById("output").innerHTML="Key Press O/P: " + abc.key;
});
