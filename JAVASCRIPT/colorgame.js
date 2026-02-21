function changeColor(){
    const colors=["red","green","yellow","black"]
    document.body.style.backgroundColor=colors[Math.floor(Math.random()*colors.length)]
}