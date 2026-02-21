# to print the reverse star pattern of n rows entered by the user.
num=int(input("Enter the number of rows:"))
for i in range(1,num+1):
    print(" "*i, end="")
    print("*"*(num-i+1), end="")
    print("")