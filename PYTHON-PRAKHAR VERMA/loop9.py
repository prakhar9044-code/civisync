r=int(input("ENTER THE NUMBER OF ROWS: "))
i=0
for i in range(r,0,-1):
    # print("* "*i)
    # i-=1
    for j in range(0,i):
        print("*",end=" ")
    print()