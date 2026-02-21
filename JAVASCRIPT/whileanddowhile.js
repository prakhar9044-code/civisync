let i=0
let text="";
while (i<=5) {
    text+="The number is"+i+"<br>";
    console.log(i);
}
document.getElementById("demo").innerHTML=text;

do {
    text+="The number is"+i+"<br>";
    i++;
}
while(i<=5);