# Create a function that takes a string as input and capitalizes a letter if its ASCII code
# is even and returns its lower case version if its ASCII code is odd.
str=input("ENTER A STRING: ")
def checkascii(self,str):
    for char in str:
        if (ord(char)%2==0):
            print(char.capitalize())
        else:
            print(char.lower())
checkascii(str)