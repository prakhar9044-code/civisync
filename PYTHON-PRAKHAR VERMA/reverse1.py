num=int(input("ENTER A NUMBER: "))
rev=0
while num>0:
    b=num%10
    rev=rev*10+b
    num=num//10
print(rev)