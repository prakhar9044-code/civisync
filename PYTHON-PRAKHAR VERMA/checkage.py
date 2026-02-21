name=input("ENTER YOUR NAME: ")
age=int(input("ENTER YOUR AGE: "))
class agecheck:
    def checkage(self,name,age):
        if age >=18:
            print((f"{name} IS ELIGIBLE TO VOTE"))
        else:
            print((f"{name} IS NOT ELIGIBLE TO VOTE"))
AGE=agecheck()
AGE.checkage(name,age)