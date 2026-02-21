str=input("ENTER A VALUD STRING:")
count=0
for i in range(len(str)):
    if i.isdigit() == True:
        countdig+=i
    elif i.isalpha() == True:
        countalph+=i
    elif i.islower() ==True:
        countlower+=i
    elif i.isupper() ==True:
        countupper+=i
    elif i.isdigit() ==False or i.isalpha() ==False:
        countspecial+=i
print("THE NUMBER OF DIGITS IN THE PROVIDED STRING IS:",countdig)
print("THE NUMBER OF SPECIAL CHARACTERS PRESENT IN THE PROVIDED STRING IS:",countspecial)
print("THE NUMBER OF ALPHABETS PRESENT IN THE GIVEN STRING IS:",countalph)
print("THE NUMBER OF UPPERCASE CHARACTERS PRESENT IN THE GIVEN STRING IS:",countupper)
print("THE NUMBER OF LOWERCASE CHARACTERS PRESENT IN THE GIVEN STRING IS:",countlower)