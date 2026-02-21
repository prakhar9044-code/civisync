function greetuser(){
    alert("Hello, Welcome to Javascript !");
}
// you can give any name to the function which is a keyword.
function heading(){
    
}
prompt("ENTER YOUR NAME")
confirm("GOOD MORNING !")
// CONFIRM GIVES TWO OPTIONS WHICH IS OK AND CANCEL WHEREAS ALERT GIVES ONLY OK BUTTON 
function checkConfirm(){
    if (confirm("Do you want to continue ?")){
        document.getElementById("demo").innerHTML="You pressed OK!"
    }else {
        document.getElementById("demo").innerHTML="You pressed CANCEL!"
    }
}
