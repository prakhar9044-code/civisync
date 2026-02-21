str=int(input("ENTER A VALUE:")).split(",")
list1=list(map(int,str))
for i in list1:
    doublenum=filter(i*2,list1)
print(doublenum)
