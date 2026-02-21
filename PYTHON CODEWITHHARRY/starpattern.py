# to print the star pattern of n rows entered by the user.
n=int(input("Enter the number of rows::"))
for i in range(1,n+1):
    print(" "* (n-i), end="")
    print("*"* (2*i-1), end="")
    print("")
