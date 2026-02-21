name=input("ENTER YOUR NAME:")
print("WELCOME TO THE PYTHON CALCULATOR !" , name)
if name=="PRAKHAR VERMA":
    print("PRESS 0 FOR MENU")
    print("PRESS 1 FOR TERMINATION")
    if int(input())==0:
            print("1.ADDITION")
            print("2.SUBTRACTION")
            print("3.MULTIPLICATION")
            print("4.DIVISION")
            print("5.MODULUS")
            print("6.EXPONENTIATION")
            print("7.FLOOR DIVISION")
            print("8.SQUARE ROOT")
            print("9.CUBE ROOT")
            print("10.PERCENTAGE")
            print("11.SINE")
            print("12.COSINE")
            print("13.TANGENT")
            print("14.FACTORIAL")
            print("15.EXIT")
    choice=int(input("ENTER YOUR CHOICE:"))
        if choice==1:
        a=float(input("ENTER THE FIRST NUMBER:"))
        b=float(input("ENTER THE SECOND NUMBER:"))
        s=a+b
        print("THE SUM IS:" , s)
    elif choice==2:
        a=float(input("ENTER THE FIRST NUMBER:"))
        b=float(input("ENTER THE SECOND NUMBER:"))
        s1=a-b
        print("THE DIFFERENCE IS:" , s1)
    elif choice==3:
        a=float(input("ENTER THE FIRST NUMBER:"))
        b=float(input("ENTER THE SECOND NUMBER:"))
        m=a*b
        print("THE PRODUCT IS:" , m)
    elif choice==4:
        a=float(input("ENTER THE FIRST NUMBER:"))
        b=float(input("ENTER THE SECOND NUMMBER:"))
        d=a/b
        print("THE QUOTIENT IS:" , d)
    elif choice==5:
        a=float(input("ENTER THE FIRST NUMBER:"))
        b=float(input("ENTER THE SECOND NUMBER:"))
        mod=a%b
        print("THE MODULUS IS:" , mod)
    elif choice==6:
        a=float(input("ENTER A NUMBER:"))
        b=float(input("ENTER THE POWER:"))
        exp=a**b
        print("THE RESULT IS:" , exp)
    elif choice==7:
        a=float(input("ENTER THE FIRST NUMBER:"))
        b=float(input("ENTER THE SECOND NUMBER:"))
        f=a//b
        print("THE FLOOR VALUE IS:" , f)
    elif choice==8:
        a=float(input("ENTER A NUMBER:"))
        sqrt=a**0.5
        print("THE SQUARE ROOT IS:" , sqrt)
    elif choice==9:
        a=float(input("ENTER A NUMBER:"))
        cbrt=a**0.33
        print("THE CUBE ROOT IS:" , cbrt)
    elif choice==10:
        a=float(input("ENTER THE TOTAL VALUE:"))
        b=float(input("ENTER THE OBTAINED VALUE:"))
        perc=(a/b)*100
        print("THE PERCENTAGE IS:" , perc)
    elif choice==11:
        a=float(input("ENTER THE VALUE IN DEGREES:"))
        s=sin(a*3.14/180)
        print("THE SINE VALUE IS:" , s)
    elif choice==12:
        a=float(input("ENTER THE VALUE IN DEGREES:"))
        c=cos(a*3.14/180)
        print("THE COSINE VALUE IS:" , c)
    elif choice==13:
        a=float(input("ENTER THE VALUE IN DEGREES:"))
        t=tan(a*3.14/180)
        print("THE TANGENT VALUE IS:" , t)
    elif choice==14:
        a=int(input("ENTER A NUMBER:"))
        fact=1
        for i in range(1,a+1):
            fact=fact*i
        print("THE FACTORIAL IS:" , fact)
    elif choice==15:
        print("THANK YOU FOR USING THE CALCULATOR" , name)
        print("HAVE A NICE DAY!")
    else:
        print("INVALID INPUT ! PLEASE TRY AGAIN.")
else:
    print("USER NOT REGISTERED")
    print("KINDLY CREATE AN ACCOUNT FOR PROCEEDING")
    print("THANK YOU !")
