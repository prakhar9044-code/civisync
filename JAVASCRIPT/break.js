alert("HELLO , WELCOME TO PRAKHAR'S WORLD !")
function breakl(){
    let output="";
    for (let i=1;i<=10;i++){
        if (i==4)
            break;
        output+="The number is "+i+"<br>";
    }
    document.write(output);
}
function contl(){
    let output="";
    for (let s=0;s<=20;s++){
        if (s==4)continue;
        output+="The number is"+s+"<br>";
    }
    document.write(output);
}
alert("METHOD EXECUTED SUCCESSFULLY!")

