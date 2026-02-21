var x=prompt("ENTER ANY NUMBER BETWEEN 1 TO 5");
var y=prompt("ENTER ANY NUMBER BETWEEN 1 TO 10");
let name=document.getElementById("demo").innerHTML="HELLO MY NAME IS SWET RAJ SINGH!";
console.log(name);
function displayName(){
    if (x>y) {
        document.write("MY NAME IS PRAKHAR NOT SWET");
        res=x+y;
        document.write("THE RESULT IS: "+res);
        document.querySelector("body").style.backgroundColor="black";
        document.querySelector("body").style.color="white";
    }else {
        document.write("VIBE NOT MATCHED"+"<BR>");
        res=x-y;
        document.write("THE RESULT IS DECREMENTED AND IS EQUAL TO: "+res+"<BR>");
        document.querySelector("body").style.backgroundColor="black";
        document.querySelector("body").style.color="white";
    }
};