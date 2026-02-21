# WRITE A PROGRAM THAT SORTS A LIST AND REMOVES ALL THE DUPLICATE ELEMENTS FROM IT 
listnew=input("ENTER THE ELEMENTS OF THE LIST SEPARATED BY SPACES: ").split()
def listsort(self,listnew):
    for i in range(len(listnew)):
        if listnew.count(i)>1:
            listnew.remove(i)
        else:
            continue
    return sorted(listnew)
print("THE SORTED LIST WITHOUT DUPLICATES IS: ",listsort(0,listnew))