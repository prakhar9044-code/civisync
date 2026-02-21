n=int(input("ENTER THE NUMBER OF ROWS: "))
i=0
for i in range(0,n):
    for j in range(1,i+1):
        print(j,end=" ")
    print()

n=int(input("ENTER THE NUMBER OF ROWS: "))
i=0
for j in range(n,0,-1):
    for i in range(1,j+1):
        print(i,end=' ')
    print()

n=int(input("ENTER THE NUMBER OF ROWS: "))
i=0
for i in range(n,0,-1):
    for j in range(i,0,-1):
        print(j,end=" ")
    print()


n=int(input("ENTER THE NUMBER OF ROWS: "))
i=0
for i in range(1,n+1):
    print(" "*(n-i),end=" ")
    print("* "*i)

n=int(input("ENTER THE NUMBER OF ROWS: "))
i=0
for i in range(n,0,-1):
    print(" "*(n-i),end=" ")
    print("* "*i)