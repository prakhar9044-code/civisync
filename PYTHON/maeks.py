math=int(input("Enter the marks of Mathematics:"))
eng=int(input("Enter the marks of English:"))
chem=int(input("Enter the marks of Chemistry:"))
comp=int(input("Enter the marks of Computer Applications:"))
phy=int(input("Enter the marks of Physics:"))
tot=math+eng+chem+comp+phy
perc=((tot)/500)*100
print("THE SUM OF THE MARKS OF BOTH THE SUBJECTS IS:" , tot)
print("THE PERCENTAGE FOR THE AGGREGATE OF BOTH THE SUBJECTS IS:" , perc)