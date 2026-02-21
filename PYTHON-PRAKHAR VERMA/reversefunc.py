def revnum(num):
    rev=0
    while num>0:
        digit=num%10
        rev=rev*10+digit
        num=num//10 
    # print("REVERSED NUMBER IS: " , rev)
    return rev

num=int(input("ENTER A NUMBER: "))
print(revnum(num))