let boxes=document.querySelectorAll(".box");
let turnO=true;
let resetBtn=document.getElementById("#reset");
let newGameBtn=document.querySelector("#new-btn");
let msgContainer=document.querySelector(".msgContainer");
let msg=document.querySelector("#msg");
let count=0;
const winpattern= [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8]
];
const resetGame =()=> {
    turnO=true;
    count=0;
    enableBoxes();
    msgContainer.classList.add("hide");
};
boxes.forEach((box) => {
    box.addEventListener("click",()=> {
        // console.log("BOX WAS CLICKED");
        if(turnO) {
            box.innerText="O";
            turnO=false;
        }
        else{
            box.innerText="X";
            turnO=true;
        }
    box.disabled=true;
    count++;

   let isWinner = checkWinner();

    if (count === 9 && !isWinner) {
      gameDraw();
    }
    });
});
const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};
const showWinner=(winner)=> {
    msg.innerText= `CONGRATULATIONS , WINNER IS ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
}

const checkWinner=()=> {
    for (pattern of winpattern){
        console.log(pattern[0],pattern[1],pattern[2]);
        let pos1Val=boxes[pattern[0]].innerText;
        let pos2Val=boxes[pattern[1]].innerText;
        let pos3Val=boxes[pattern[2]].innerText;

        if(pos1Val !="" && pos2Val !="" && pos3Val !="") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                console.log("Winner",pos1Val);
                showWinner(pos1Val);
                return true;
            }
        }
    }
}

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click",resetGame);
