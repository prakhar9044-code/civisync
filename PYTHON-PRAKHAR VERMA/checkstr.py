# Write a Python Program to check if a string contains any special character.
def checkstring(self,str):
    for char in str:
        if char.isdigit()==True or char.isaplha()==True:
            continue
        else:
            print(f"THE STRING CONTAINS {char} WHICH IS A SPECIAL CHARACTER")
str=input("ENTER A STRING: ")
checkstring(str)