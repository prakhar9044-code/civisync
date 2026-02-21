const student={
    fullname:"Pralhar Verma",
    marks:94.4,
    printmarks:function(){
        console.log("marks=",this.marks);
    }
}
// direct way of creating an object 
// this.marks means student.marks 
// in javascript an array is internally an object 
const employee= {
    calctax() {
        console.log("THE TAX RATE IS 10%")
    }
}