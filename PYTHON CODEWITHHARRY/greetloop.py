# to greet each name in the list that starts with the letter R with a HELLO message. 
l=["HARRY", "RANBIR", "RAKHAR", "VISHAL"]
name=input("Enter your name:")
for name in l:
    if name.startswith("R"):
        print("HELLO" + name)
    else:
        print("USER NOT RECOGNIZED")

