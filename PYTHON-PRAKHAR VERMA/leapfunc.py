def leapyear(year):
    if (year%400==0) or (year%4==0 and year%100!=0):
        return "LEAP YEAR"
    else:
        return "NOT A LEAP YEAR"
year=int(input("ENTER THE YEAR: "))
print(leapyear(year))