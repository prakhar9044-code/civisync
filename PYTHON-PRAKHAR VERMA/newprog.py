# WRITE A FUNCTION TO REVERSE A NUMBER
def revnum():
    num=int(input("ENTER A NUMBER: "))
    rev=0
    while num>0:
        digit=num%10
        rev=rev*10+digit
        num=num//10
        print("THE REVERSE OF THE GIVEN NUMBER IS: ",rev)
revnum()