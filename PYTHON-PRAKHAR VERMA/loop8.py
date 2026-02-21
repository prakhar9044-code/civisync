rows = int(input("Enter the number of rows: "))

i=0
for i in range(1, rows + 1):
    # print spaces
    print(" " * (rows - i), end="")
    # print stars
    print("* " * i)
