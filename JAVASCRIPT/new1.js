function myFunction(){
    let person=prompt("ENTER YOUR NAME","Name");
    if (person==null || person.trim()==""){
        alert("FIELD IS EMPTY");
    }else {
        document.getElementById("xyz").innerHTML="Hello,"+ person + " " + "How Are You ?";
    }
}
