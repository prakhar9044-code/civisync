# to check the greatest among four numbers entered by the user.
a=int(input("Enter first number:"))
b=int(input("Enter second number:"))
c=int(input("Enter third number:"))
d=int(input("Enter fourth number:"))
if a>b and a>c and a>d:
    print("The greatest number is:" , a)

elif b>a and b>c and b>d:
    print("The greatestv number is:" , b)

elif c>a and c>b and c>d:
    print("The greatest number is:" , c)

else:
    print("The greatest number is:" , d)