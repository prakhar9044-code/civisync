# write a function which checks for an even or odd number and use the return sstatwment to print the output in this function

def numcheck(num):
    if num%2==0:
        return "EVEN NUMBER"
    else:
        return "ODD NUMBER"
num=int(input("ENTER A NUMBER: "))
print(numcheck(num))