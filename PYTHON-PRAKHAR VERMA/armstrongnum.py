num=int(input("ENTER A NUMBER: "))
num_str=str(num)
num_digits=len(num_str)
sum=0
tempnum=num
while tempnum>0:
    digit=tempnum%10
    sum+=digit**num_digits
    tempnum//=10
if sum==num:
    print(num,"IS AN ARMSTRONG NUMBER")
else:
    print(num,"IS NOT AN ARMSTRONG NUMBER")