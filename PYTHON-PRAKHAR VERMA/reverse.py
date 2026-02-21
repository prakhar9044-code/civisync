num=int(input("ENTER A NUMBER: "))
rev=0
while num>0: 
    b=num%10
    rev=rev*10+b
    num=num//10
if num==rev:
    print("PAlINDROME NUMBER")
    print("END OF PROGRAM!")
else:
    print("NON PALINDROME NUMBER")
    print("END OF PROGRAM!")