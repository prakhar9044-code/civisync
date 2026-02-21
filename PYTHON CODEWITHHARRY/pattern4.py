# to print the hollow square star pattern of n rows entered by the user.
num=int(input("Enter the number of rows:"))
for i in range(1,num+1):
    if(i==1 or i==num):
        print("*"*num , end="")
    else:
        print("*", end="")
        print(" "*(num-2), end="")
        print("*", end="")
    print("")
