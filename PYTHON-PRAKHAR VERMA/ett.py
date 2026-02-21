# WRITE A PROGRAM TO CREATE A BOOK CLASS AND LIBRARY CLASS TO ADD AND DISPLAY BOOKS STORED IN A LIST 
# class Book:
#     def __init__(self,book_name,author):
#         self.author=author
#         self.book_name=book_name
# class Library:
#     def __init__(self):
#         self.books=[]
#     def addbook(self,book):
#         self.books.apppend(book)
#         print("BOOK SUCCESSFULLY ADDED TO YOUR LIBRARY: ",self.book_name)
#     def displaybook(self):
#         for b in self.books:
#             print(f"{b.book_name} by {b.author}")

# Lib=Library()
# Lib.addbook(Book("Python Programming","Prakhar Verma"))
# Lib.addbook(Book("Data Science for professionals","Amazon Web Services"))
# Lib.displaybook()


# WRITE A PROGRAM TO GET THE DETAILS YOU WANT ONCE YOU PRESS 1 THE PROGRAM ASKS YOU FOR THE DETAILS OF STUDENT, ONCE 2 PRESSED IT SHOW THE DETAILS AND ONCE 3 IS PRESSED THE PROGRAM EXITS 
class Student:
    def __init__(self,student_name,section,uid):
        self.student_name=student_name
        self.section=section
        self.uid=uid
    def adddetails(self):
        self.details_list=[]
        self.detail_list[0]=self.student_name
        self.detail_list[1]=self.section
        self.detail_list[2]=self.uid
    def displaydetails(self):
        print("Details of the Student are: ",self.detail_list)
student_name=input("Enter the name of the student:")
section=input("Enter the section:")
uid=int(input("Enter your UID:"))
choice=int(input("Enter your choice:"))
Details=Student(student_name=student_name,section=section,uid=uid)
if choice==1:
    Details.adddetails(student_name,section,uid)
elif choice==2:
    Details.displaydetails()    