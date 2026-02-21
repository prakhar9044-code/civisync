function myFunction(){
    let color=prompt("ENTER YOUR COLOR NAME","Color Name");
    if (color==null || color.trim()==""){
        alert("FIELD IS EMPTY");
    }else {
        document.body.style.backgroundColor=(color);
    }
}
