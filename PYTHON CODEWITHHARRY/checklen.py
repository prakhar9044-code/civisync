# to check whether the username entered by the user has less than 10 characters.
username=input("Enter your Username:")
l=len(username)
if l<10:
    print("THE USERNAME CONSISTS OF LESS THAN 10 CHARACTERS")
else:
    print("THE USERNAME CONSISTS OF MORE THAN 10 CHARACTERS")