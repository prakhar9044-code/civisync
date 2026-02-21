n=int(input("ENTER THE NUMBER OF ELEMENTS YOU WANT IN THE TUPLE: "))
temp_list=[]
for i in range(0,n):
    val=input("ENTER THE VALUE: ")
    temp_list.append(val)
my_tup=tuple(temp_list)
print(my_tup)