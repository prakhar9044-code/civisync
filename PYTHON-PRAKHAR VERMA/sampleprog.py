num1=int(input("ENTER THE FIRST NUMBER:"))
num2=int(input("ENTER THE SECOND NUMBER:"))
num3=int(input("ENTER THE THIRD NUMBER:"))
num4=int(input("ENTER THE FOURTH NUMBER:"))
num5=int(input("ENTER THE FIFTH NUMBER:"))
set1={num1,num2,num3,num4,num5}  #including all integers taken from the user in a set.
print(set1)  #printing the set as the first line of output.
list1=list(set1)   #converting the set into a list.   
for i in range(0,len(list1),2):
    list1[i]*=2
    if i>22:
        continue
    
newset=set(list1)
alternate=list1[0::2]
alterset=set(alternate)
print(alterset)