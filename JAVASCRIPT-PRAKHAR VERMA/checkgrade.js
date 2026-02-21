// write a code which can guve grades to the students according to their scores 
let score=prompt("ENTER YOUR SCORE");
if (score>=80 && score<=100) {
    console.log("GRADE 'A'");
} else if (score>=70 && score<=89) {
    console.log("GRADE 'B'");
}else if(score>=60 && score<=69){
    console.log("GRADE 'C'");
}else if (score>=50 && score<=59){
    console.log("GRADE 'D'");
}else if (score>=0 && score<=49){
    console.log("GRADE 'F'");
}else{
    console.log("INVALID SCORE");
}
alert("GRADE RELEASED");