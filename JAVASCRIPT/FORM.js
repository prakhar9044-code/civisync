alert("Hello!,WELCOME TO NASA");
function data(){
    var a=document.getElementById("username").value;
    var b=document.getElementById("pass").value;
    var c=document.getElementById("pass1").value;
    var d=document.getElementById("phone").value;

if (a=="" || b=="" || c=="" || d==""){
    alert("FILLING ALL THE DETAILS IS MANDATORY !");
    return False;
}
else if(b.length<10 || b.length>10){
    alert("PHONE NUMBER MUST BE 10 DIGITS LONG !");
    return False;
}
else if(b!=c){
    alert("PASSWORDS DO NOT MATCH !");
    return False;
}
else{
    true;
}
}