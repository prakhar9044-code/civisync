# to check the grade of a student based on the marks entered by him/her.
marks=int(input("Enter your marks:"))
if marks>=90 and marks<=100:
    print("YOUR GRADE IS Ex")

elif marks>=80 and marks<=90:
    print("YOUR GRADE IS A")

elif marks>=70 and marks<=80:
    print("YOUR GRADE IS B")

elif marks>=60 and marks<=70:
    print("YOUR GRADE IS C")

elif marks>=50 and marks<=60:
    print("YOUR GRADE IS D")

else:
    print("YOUR GRADE IS F")

print("END OF THE PROGRAM !")