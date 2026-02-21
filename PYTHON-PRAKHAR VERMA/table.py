num=int(input("ENTER A NUMBER FOR WHICH YOU WANT THE TABLE: "))
for i in range(1,11):
    print(f"{num}x{i}={num*i}")
    if i==10:
        break