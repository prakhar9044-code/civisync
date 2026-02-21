let student={
    name: "Prakhar",
    age: "18",
    course: "CSE",
    school: "LPU"
};
// ACCESS OBJECT PROPERTIES 

let info="Name : " + student.name + "<br>" + 
"Age : " + student.age + "<br>" +
"Course : " + student.course + "<br>" + 
"School : " + student.school + "<br><br>";

// ADDING A NEW PROPERTY 
student.grade="A";
info+="Added grade" + student.grade + "<br>";

// UPDATE A PROPERTY 
student.age=19;
info+="Updated Age : " + student.age + "<br>";

// DELETE A PROPERTY 
delete student.course;
info+="After deleting course" + JSON.stringify(student) + "<br>";

// DISPLAY RESULT 
document.getElementById("output").innerHTML = info;