# Please write a program using generator to print the numbers which can be divisible
# by 5 and 7 between 0 and n in comma separated form while n is input by console.
def div(num):
    try:
        for i in range(0,num):
            if i%5==0 and i%7==0:
                print(i,end=",")
            else:
                continue
    except ValueError:
        print("INVALID INPUT PROVIDED")
    finally:
        print("\nEXECUTION COMPLETED SUCCESSFULLY")
num=int(input("ENTER THE RANGE: "))
div(num)