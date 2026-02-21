let modeBtn=document.querySelector("#mode");
let body=document.querySelector("body");
let currMode="light";

modeBtn.addEventListener("click",function(){
    // console.log("YOU ARE TRYING TO CHANGE THE MODE OF THE WEBPAGE");
    if (currMode==="light") {
        currMode="dark";
        body.classList.add("dark");
        body.classList.remove("light");
    }
    else{
        currMode="light";
        body.classList.add("light");
        body.classList.remove("dark");
    }

    console.log(currMode);
});