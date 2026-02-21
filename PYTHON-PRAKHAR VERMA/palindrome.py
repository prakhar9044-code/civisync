num=int(input("ENTER A NUMBER: "))
rev=0
temp=num #helps in storing the original number for comparison purpose later.
while num>0: 
    b=num%10
    rev=rev*10+b
    num=num//10
if temp==rev:
    print("PALINDROME NUMBER")
    print("END OF PROGRAM!")
else:
    print("NOT A PALINDROME NUMBER")
    print("END OF PROGRAM!")