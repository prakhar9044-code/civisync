r=int(input("ENTER THE NUMBER OF ROWS: "))
i=0
for i in range(r,0,-1):
    for j in range(1,i+1):
        print(j, end=" ")
    print()