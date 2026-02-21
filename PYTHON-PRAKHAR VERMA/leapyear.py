year=int(input("ENTER THE YEAR: "))
if (year%400==0) or (year%4==0 and year%100!=0):
    print("LEAP YEAR")
else:
    print("NOT A LEAP YEAR")