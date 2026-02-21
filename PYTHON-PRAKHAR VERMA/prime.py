num=int(input("ENTER THE NUMBER: "))
if num>1:
    for i in range(2,num):
        if(num%i)==0:
            print(num,"IS NOT A PRIME NUMBER")
            break
    else:
        print(num,"IS A PRIME NUMBER")


        # b=num%10
        # rev=rev*10+b
        # num=num//10