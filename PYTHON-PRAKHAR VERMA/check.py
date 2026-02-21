a=int(input("ENTER FIRST NUMBER:"))
b=int(input("ENTER SECOND NUMBER:"))
c=int(input("ENTER THIRD NUMBER:"))
d=int(input("ENTER FOURTH NUMBER:"))
list1=[a,b,c,d]
print("a: ", a)
print("b: ", b)
print("c: ", c)
print("d: ", d)
for n in list1:
    if n%6 == 0:
        print(n)
        continue