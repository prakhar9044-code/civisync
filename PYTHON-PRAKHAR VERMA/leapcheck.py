class Year:
    def checkleap(self,year):
        if year%400==0 or (year%4==0 and year%100!=0):
            print(f"{year} IS A LEAP YEAR")
        else:
            print(f"{year} IS NOT A LEAP YEAR")
year=int(input("ENTER THE YEAR YOU WANT TO CHECK: "))
YEAR=Year()
YEAR.checkleap(year)