# to find the factorial of a number entered by the user using for loop.
num=int(input("Enter the number for which you want the factorial:"))
fact=1
for i in range(1,num+1):
    fact=fact*i
print(f"The factorial of {num} is {fact}")