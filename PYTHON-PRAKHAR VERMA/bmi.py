weight=float(input("ENTER YOUR WEIGHT"))
height=float(input("ENTER YOUR HEIGHT"))
bmi=weight/(height*height)
if bmi<18.5:
    print("UNDERWEIGHT")
elif bmi>=18.5 and bmi<25:
    print("NORMAL")
elif bmi>=25 and bmi<30:
    print("OVERWEIGHT")
else:
    print("OBESITY")
