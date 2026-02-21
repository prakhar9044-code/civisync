r=int(input("ENTER THE NUMBER OF ROWS: "))
i=0
for i in range(r,0,-1):
    for j in range(i,0,-1):
        print(j , end=" ")
    print()