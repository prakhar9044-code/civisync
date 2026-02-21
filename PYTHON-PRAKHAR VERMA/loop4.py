r=int(input("ENTER THE NUMBER OF ROWS: "))
i=0
for i in range(r,0,-1):
    for j in range(i):
        print('*' , end=" ")
    print()