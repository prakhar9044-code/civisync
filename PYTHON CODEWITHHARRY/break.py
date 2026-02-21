# The loop will break when the value of i is 34 and it will not print anything after that.
i=0
for i in range(100):
    if(i==34):
        break # exit this loop right now.
    print(i)

# The loop will continue when the value of i is 34 and it will print all the values except 34.
i=0
for i in range(100):
    if(i==34):
        continue # it will skip the current iteration only.
    print(i)

for i in range(645):
    pass # it will do nothing and move to the next iteration.
    

i=0
while(i<45):
    print(i)
    i+=1
    