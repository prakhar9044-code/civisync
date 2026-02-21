n=prompt("ENTER THE RANGE")
text="";
for (let i=0;i<=n;i++){
    text+="The number is "+i+"<br>";
    console.log(i)
}
document.getElementById("demo").innerHTML=text;
alert("LOOP EXECUTED SUCCESSFULLY")