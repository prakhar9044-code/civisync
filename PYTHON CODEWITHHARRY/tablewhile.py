# to print the multiplication table of a number entered by the user.
num=int(input("Enter the number for which you want the table:"))
i=1
while(i<11):
    print(f"{num} X {i} = {num*i}")
    i+=1
