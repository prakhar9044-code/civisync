let day;
switch(new Date().getDay()){
    case 0: day="SUNDAY";
    break;

    case 1: day="MONDAY";
    break;

    case 2: day="TUESDAY";
    break;

    case 3: day="WEDNESDAY";
    break;

    case 4: day="THURSDAY";
    break;

    case 5: day="FRIDAY";
    break;

    case 6: day="SATURDAY";
    break;
}
document.getElementById("demo").innerHTML="Today is"+" "+day;
let i=0
while (i<=5) {
    console.log(i)
}