import math
num=input("ENTER A NUMBER: ")
a=int(num[0])
b=int(num[1])
c=int(num[2])
if math.pow(a,3)+math.pow(b,3)+math.pow(c,3)==int(num):
    print(f"{num} IS AN ARMSTRONG NUMBER")
else:
    print(f"{num} IS NOT AN ARMSTRONG NUMBER")