# to check whether the message entered by the user is a spam or not.
spam=["Make a lot of money" , "Buy now" , "Subscribe this" , "Click this" ]
cmt=input("Enter the message:")
if cmt in spam:
    print("THIS COMMENT IS A SPAM !")

else:
    print("THIS COMMENTV IS NOT A SPAM !")