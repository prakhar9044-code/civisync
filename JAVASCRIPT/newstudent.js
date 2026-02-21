const student={
    name: "Prakhar",
    marks: 30,
    showInfo: function() {
        return "STUDENT NAME:" + this.name + "<br>" + "MARKS: " + this.marks;
    }
};
function showStudent() {
document.write(student.showInfo());
};
// document.getElementById("output").innerHTML=student.showInfo();